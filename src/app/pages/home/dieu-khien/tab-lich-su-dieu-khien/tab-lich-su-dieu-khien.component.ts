import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';
import * as moment from 'moment';
import { catchError, finalize, map } from 'rxjs/operators';
import { DieuKhienService } from 'src/app/core/services/dieu-khien.service';
import { LichSuDK } from 'src/app/shared/models/dieukhien.model';
import { PageData } from 'src/app/shared/models/page/page-data';
import { PageLink } from 'src/app/shared/models/page/page-link';
import { Direction } from 'src/app/shared/models/page/sort-order';
import { GroupHistoryByDay } from '../dieu-khien.page';

@Component({
  selector: 'app-tab-lich-su-dieu-khien',
  templateUrl: './tab-lich-su-dieu-khien.component.html',
  styleUrls: ['./tab-lich-su-dieu-khien.component.scss'],
})
export class TabLichSuDieuKhienComponent implements OnInit, OnChanges {
  @Input() damTomId: string;
  @Input()  deviceID: string;
  @Input() fromDate: any;
  @Input() toDate: any;
  @Input() segment: number;
  @Output() countLichSu = new EventEmitter<number>();
  isLoading = true;
  infiniteLoad = false;
  isWantFilterByDevice = false;
  // 26/8 sua tam thanh true
  isWantFilterByTime = true;
  countNewHistory = 0;
  pageLink: PageLink;
  sortOrder;
  lstLichsu: GroupHistoryByDay[] = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    private dieuKhienService: DieuKhienService,
    public alertController: AlertController,
  ) {}

  ngOnInit() {
    this.sortOrder = {
      property: 'commandTime',
      direction: Direction.DESC,
    };
    this.pageLink = new PageLink(10, 0, '', this.sortOrder);
  }
  async ngOnChanges(change: SimpleChanges){
    if (this.segment !== 3){
      return;
    }
    if (!this.datesValid()){
      return;
    }
    this.isLoading = true;
    if (!this.damTomId) {
      this.isLoading = false;
      return;
    }
    if (this.deviceID === 'all') {
      this.isWantFilterByDevice = false;
    }
    else{
      this.isWantFilterByDevice = true;
    }
    this.lstLichsu = [];
    if (this.infiniteScroll != null){
      this.infiniteScroll.disabled = false;
    }
    // set l???i trang b???t ?????u = 0;
    if (this.pageLink != null){
      this.pageLink.page = 0;
      this.fetchData();
    }
  }
  preLoadData() {
    if (!this.damTomId) {
      this.isLoading = false;
      return;
    }
    // Khai bao form
    this.lstLichsu = [];
    this.infiniteScroll.disabled = false;
    // this.isWantFilterByTime = false;
    // 26/8 sua tam thanh true
    this.isWantFilterByTime = true;
    // set l???i trang b???t ?????u = 0;
    this.pageLink.page = 0;
    this.fetchData();
  }

  // C??c h??m get
  getLstLichSu(): GroupHistoryByDay[] {
    return this.lstLichsu;
  }
  // getLstRpcZone(): DeviceRpcZone[] {
  //   return this.lstRpcZone;
  // }

  // C??c h??m set
  // setLstRpcZone(data) {
  //   // ki???m tra n???u d??? li???u thay ?????i th?? m???i c???p nh???t
  //   if (!arrayEqual(data, this.lstRpcZone)) {
  //     this.lstRpcZone = data;
  //   }
  // }
  /* C??i set l???ch s??? n??y s??? h??i kh??c v?? n?? tr??? v??? d???ng page - So s??nh ph???n t??? ?????u ti??n
  N???u data[0] kh??c v???i lstLichSu[0] (T???c l?? ???? c?? l???ch s??? m???i)
  th?? m???i c???p nh???t l???i danh s??ch l???ch s???
  Edit by ChuongNV
  */
  checkBeforeSetLstLichsu(data) {
    if (this.lstLichsu.length === 0) {
      return false;
    } else if (
      this.lstLichsu[0].dataHistory[0].commandTime === data?.commandTime
    ) {
      return true; // D??? li???u kh??ng thay ?????i
    } else {
      return false; // D??? li???u c?? thay ?????i
    }
  }

  getFirstPageLichSu() {
    const pageLinkOnePage = new PageLink(10, 0, '', this.sortOrder);
    return this.dieuKhienService
      .getListLichSu(this.damTomId, pageLinkOnePage, null, Date.parse(this.fromDate).toString(),
      Date.parse(this.toDate).toString())
      .toPromise();
  }
  // Get lich su
  fetchData(event?) {
    if (!this.isWantFilterByDevice && !this.isWantFilterByTime) {
      let index = 0;
      this.dieuKhienService
        .getListLichSu(this.damTomId, this.pageLink)
        .pipe(
          map((pageData: PageData<LichSuDK>) => {
            if (pageData.data.length >= 1) {
              pageData.data.forEach((e) => {
                e.isWantShow = false;
                const timeCompare = this.convertSecondtoTime(e.commandTime);
                this.lstLichsu.forEach((el) => {
                  if (el === this.lstLichsu[this.lstLichsu.length - 1]) {
                    if (el.time === timeCompare) {
                      el.dataHistory.push(e);
                    } else {
                      index += 1;
                    }
                  }
                });
                if (this.lstLichsu[index] === undefined) {
                  this.lstLichsu[index] = {
                    time: 0,
                    dataHistory: [],
                  };
                  this.lstLichsu[index].time =
                    this.convertSecondtoTime(timeCompare);
                  this.lstLichsu[index].dataHistory.push(e);
                }
                if (event !== undefined) {
                  if (event.type === 'ionInfinite') {
                    event.target.complete();
                  }
                }
                // Check Page has next
                if (pageData.hasNext === false) {
                  this.infiniteScroll.disabled = true;
                }
              });
              this.isLoading = false;
            } else {
              this.infiniteScroll.disabled = true;
              this.isLoading = false;
            }
          }),
          finalize(() => {
            this.isLoading = false;
          }),
          catchError((error) => {
            this.lstLichsu.length = 0;
            return null;
          })
        )
        .subscribe();
    } else if (this.isWantFilterByDevice && !this.isWantFilterByTime) {
      let index = 0;
      this.dieuKhienService
        .getListLichSu(this.damTomId, this.pageLink, this.deviceID)
        .pipe(
          map((pageData: PageData<LichSuDK>) => {
            if (pageData.data.length >= 1) {
              pageData.data.forEach((e) => {
                e.isWantShow = false;
                const timeCompare = this.convertSecondtoTime(e.commandTime);
                this.lstLichsu.forEach((el) => {
                  if (el === this.lstLichsu[this.lstLichsu.length - 1]) {
                    if (el.time === timeCompare) {
                      el.dataHistory.push(e);
                    } else {
                      index += 1;
                    }
                  }
                });
                if (this.lstLichsu[index] === undefined) {
                  this.lstLichsu[index] = {
                    time: 0,
                    dataHistory: [],
                  };
                  this.lstLichsu[index].time =
                    this.convertSecondtoTime(timeCompare);
                  this.lstLichsu[index].dataHistory.push(e);
                }
                if (event !== undefined) {
                  if (event.type === 'ionInfinite') {
                    event.target.complete();
                  }
                }
                // Check Page has next
                if (pageData.hasNext === false) {
                  this.infiniteScroll.disabled = true;
                }
              });
              this.isLoading = false;
            } else {
              this.infiniteScroll.disabled = true;
              this.isLoading = false;
            }
          }),
          finalize(() => {
            this.isLoading = false;
          }),
          catchError((error) => {
            this.lstLichsu.length = 0;
            return null;
          })
        )
        .subscribe();
    } else if (!this.isWantFilterByDevice && this.isWantFilterByTime) {
      let index = 0;
      if (this.datesValid()) {
        this.dieuKhienService
          .getListLichSu(
            this.damTomId,
            this.pageLink,
            null,
            Date.parse(this.fromDate).toString(),
            Date.parse(this.toDate).toString()
          )
          .pipe(
            map((pageData: PageData<LichSuDK>) => {
              if (pageData.data.length >= 1) {
                pageData.data.forEach((e) => {
                  e.isWantShow = false;
                  const timeCompare = this.convertSecondtoTime(e.commandTime);
                  this.lstLichsu.forEach((el) => {
                    if (el === this.lstLichsu[this.lstLichsu.length - 1]) {
                      if (el.time === timeCompare) {
                        el.dataHistory.push(e);
                      } else {
                        index += 1;
                      }
                    }
                  });
                  if (this.lstLichsu[index] === undefined) {
                    this.lstLichsu[index] = {
                      time: 0,
                      dataHistory: [],
                    };
                    this.lstLichsu[index].time =
                      this.convertSecondtoTime(timeCompare);
                    this.lstLichsu[index].dataHistory.push(e);
                  }
                  if (event !== undefined) {
                    if (event.type === 'ionInfinite') {
                      event.target.complete();
                    }
                  }
                  // Check Page has next
                  if (pageData.hasNext === false) {
                    this.infiniteScroll.disabled = true;
                  }
                });
                this.isLoading = false;
              } else {
                this.infiniteScroll.disabled = true;
                this.isLoading = false;
              }
            }),
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.lstLichsu.length = 0;
              return null;
            })
          )
          .subscribe();
      } else {
        this.isLoading = false;
        this.infiniteScroll.disabled = true;
      }
    } else {
      let index = 0;
      if (this.datesValid()) {
        this.dieuKhienService
          .getListLichSu(
            this.damTomId,
            this.pageLink,
            this.deviceID,
            Date.parse(this.fromDate).toString(),
            Date.parse(this.toDate).toString()
          )
          .pipe(
            map((pageData: PageData<LichSuDK>) => {
              if (pageData.data.length >= 1) {
                pageData.data.forEach((e) => {
                  e.isWantShow = false;
                  const timeCompare = this.convertSecondtoTime(e.commandTime);
                  this.lstLichsu.forEach((el) => {
                    if (el === this.lstLichsu[this.lstLichsu.length - 1]) {
                      if (el.time === timeCompare) {
                        el.dataHistory.push(e);
                      } else {
                        index += 1;
                      }
                    }
                  });
                  if (this.lstLichsu[index] === undefined) {
                    this.lstLichsu[index] = {
                      time: 0,
                      dataHistory: [],
                    };
                    this.lstLichsu[index].time =
                      this.convertSecondtoTime(timeCompare);
                    this.lstLichsu[index].dataHistory.push(e);
                  }
                  if (event !== undefined) {
                    if (event.type === 'ionInfinite') {
                      event.target.complete();
                    }
                  }
                  // Check Page has next
                  if (pageData.hasNext === false) {
                    this.infiniteScroll.disabled = true;
                  }
                });
                this.isLoading = false;
              } else {
                this.infiniteScroll.disabled = true;
                this.isLoading = false;
              }
            }),
            finalize(() => {
              this.isLoading = false;
            }),
            catchError((error) => {
              this.lstLichsu.length = 0;
              return null;
            })
          )
          .subscribe();
      } else {
        this.isLoading = false;
        this.infiniteScroll.disabled = true;
      }
    }
    this.getCountLsNew();
  }
  readAll(timeInput){
    const timeConvert = timeInput - (timeInput % 86400000) - 25200000;
    // tslint:disable-next-line: max-line-length
    this.dieuKhienService.viewAllHistory(this.damTomId, timeConvert.toString(), timeInput.toString()).subscribe((res) => {
      this.getCountLsNew();
      this.lstLichsu.forEach(e => {
        e.dataHistory.forEach(el => {
          el.viewed = true;
        });
      });
    });
  }

  // Load th??m data khi k??o xu???ng d?????i
  loadMore(e) {
    if (this.pageLink.page !== undefined) {
      this.pageLink.page++;
    }
    this.infiniteLoad = true;
    this.fetchData(e);
    // this.getCountLsNew();
  }
  convertTiengViet(entityType: string) {
    let result: string;
    switch (entityType) {
      case 'Monday':
        result = 'Th??? hai';
        break;
      case 'Tuesday':
        result = 'Th??? ba';
        break;
      case 'Wednesday':
        result = 'Th??? t??';
        break;
      case 'Thursday':
        result = 'Th??? n??m';
        break;
      case 'Friday':
        result = 'Th??? s??u';
        break;
      case 'Saturday':
        result = 'Th??? b???y';
        break;
      case 'Sunday':
        result = 'Ch??? nh???t';
        break;
      default:
        result = entityType;
    }
    return result;
  }
  convertSecondtoTime(secs) {
    const day = moment(new Date(secs))
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .valueOf();
    return day;
  }
  transformThu(dateInput: number) {
    const datePipe = new DatePipe('en-US');
    const result = datePipe.transform(dateInput, 'EEEE');
    return result;
  }
  getCountLsNew() {
    this.dieuKhienService.getCountNewLs(this.damTomId).subscribe((res) => {
      this.countNewHistory = res;
      this.countLichSu.emit(this.countNewHistory);
    });
  }
  datesValid() {
    return Date.parse(this.toDate) > Date.parse(this.fromDate);
  }
  // 26/8/2021 by ChuongNv
  getCommandStatus(commandStatus: string): string {
    switch (commandStatus) {
      case 'NEW':
        return '??ang ch???';
      case 'EXECUTING':
        return '??ang th???c thi';
      case 'SUCCESS':
        return 'Th??nh c??ng';
      case 'TIMEOUT':
        return 'Th???t b???i';
      case 'NO_ACTIVE_CONNECTION':
        return 'Th???t b???i';
      case 'EXCEPTION':
        return 'Th???t b???i';
      case 'CANCEL':
        return 'B??? h???y b???';
      case 'CANCEL_SAME_STATUS':
        return 'Tr??ng tr???ng th??i hi???n t???i';
      case 'CANCEL_INACTIVE_SCHEDULE':
        return 'B??? h???y b???';
      case 'CANCEL_INACTIVE_ALAMRPC':
        return 'B??? h???y b???';
      case 'CANCEL_TIME_EXPRIED':
        return 'H???t h???n';
      case 'RETRY_1':
        return '??ang th???c thi';
      case 'RETRY_2':
        return '??ang th???c thi';
      case 'RETRY_3':
        return '??ang th???c thi';
      case 'RETRY_4':
        return '??ang th???c thi';
      case 'RETRY_5':
        return '??ang th???c thi';
      default:
        return 'Kh??ng x??c ?????nh';
    }
  }
  displayTypeControl(origin: number){
    switch (origin) {
      case 1:
        return 'Th??? c??ng';
      case 2:
        return 'Nh??m ??i???u khi???n';
      case 3:
      case 6:
        return 'T??? ?????ng';
      case 4:
      case 7:
        return 'H???n gi???';
      case 5: 
        return '??i???u khi???n r??m';
      default:
        break;
    }
  }
  convertRemAction(action: string) {
    switch (action) {
      case 'PUSH':
        return ' r???i r??m';
      case 'PULL': 
        return ' thu r??m';
      case 'STOP':
        return ' d???ng';
      default:
        return '';
    }
  }

  convertPercentRem(remId: string, rpcRemStatus: number, remAction: string) {
    if (remId == null || remAction == 'STOP') return '';
    return ` t???i m???c ${rpcRemStatus}%`;
  }
}
