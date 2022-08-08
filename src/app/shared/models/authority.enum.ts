///
/// Copyright © 2016-2021 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

export enum Authority {
  SYS_ADMIN = 'SYS_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  CUSTOMER_USER = 'CUSTOMER_USER',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  ANONYMOUS = 'ANONYMOUS',
  PAGES_USERS = 'PAGES.USERS',
  PAGES_USERS_CREATE = 'PAGES.USERS.CREATE',
  PAGES_USERS_EDIT = 'PAGES.USERS.EDIT',
  PAGES_USERS_DELETE = 'PAGES.USERS.DELETE',
  PAGES_USERS_ACCESS_HISTORY = 'PAGES.USERS.ACCESS.HISTORY',
  PAGES_ROLES = 'PAGES.ROLES',
  PAGES_ROLES_CREATE = 'PAGES.ROLES.CREATE',
  PAGES_ROLES_EDIT = 'PAGES.ROLES.EDIT',
  PAGES_ROLES_DELETE = 'PAGES.ROLES.DELETE',
  PAGES_DAMTOM = 'PAGES.DAMTOM',
  PAGES_DAMTOM_CREATE = 'PAGES.DAMTOM.CREATE',
  PAGES_DAMTOM_EDIT = 'PAGES.DAMTOM.EDIT',
  PAGES_DAMTOM_DELETE = 'PAGES.DAMTOM.DELETE',
  PAGES_GIAMSAT = 'PAGES.GIAMSAT',
  PAGES_DIEUKHIEN = 'PAGES.DIEUKHIEN',
  PAGES_DLCAMBIEN = 'PAGES.DLCAMBIEN',
  PAGES_TLLUATCANHBAO = 'PAGES.TLLUATCANHBAO',
  PAGES_QLCAMERA = 'PAGES.QLCAMERA',
  PAGES_QLCAMERA_CREATE = 'PAGES.QLCAMERA.CREATE',
  PAGES_QLCAMERA_EDIT = 'PAGES.QLCAMERA.EDIT',
  PAGES_QLCAMERA_DELETE = 'PAGES.QLCAMERA.DELETE',
  PAGES_QLTHIETBI = 'PAGES.QLTHIETBI',
  PAGES_QLTHIETBI_CREATE = 'PAGES.QLTHIETBI.CREATE',
  PAGES_QLTHIETBI_EDIT =  'PAGES.QLTHIETBI.EDIT',
  PAGES_QLTHIETBI_DELETE = 'PAGES.QLTHIETBI.DELETE',
  PAGES_DATLICH_XUATBC = 'PAGES.REPORT.SCHEDULE',
  PAGES_DATLICH_XUATBC_CREATE = 'PAGES.REPORT.SCHEDULE.CREATE',
  PAGES_DATLICH_XUATBC_EDIT = 'PAGES.REPORT.SCHEDULE.EDIT',
  PAGES_DATLICH_XUATBC_DELETE = 'PAGES.REPORT.SCHEDULE.DELETE',
  PAGES_BAOCAO = 'PAGES.BAOCAO',
  PAGES_BC_TONGHOP = 'PAGES.BC_TONGHOP',
  PAGES_BC_DLGIAMSAT = 'PAGES.BC_DLGIAMSAT',
  PAGES_BC_CANHBAO = 'PAGES.BC_CANHBAO',
  PAGES_BC_KETNOI_CAMBIEN = 'PAGES.BC_KETNOI_CAMBIEN',
  PAGES_BC_GUI_TTCB = 'PAGES.BC_GUI_TTCB',
}