var baseUrl = 'api/';
var authBaseUrl = '/api/';

export const WEB_API = {
  CORE: {
    TOP_NAV: authBaseUrl + 'Antunes/TopNav',
    TIME_ZONE: authBaseUrl + 'TimeZone',
  },

  REPORT: {
    GET: baseUrl + 'Reports/ViewReport',
    GET_ALL: baseUrl + 'Reports/getreportlist',
    GET_Filter: baseUrl + 'ReportFilter',
    GET_SUBFilter: baseUrl + 'ReportFilter/ReportSubFilter',
    POST: baseUrl + 'Reports/ReportSaveUpdate',
    PUT: baseUrl + 'Report/',
    DELETE: baseUrl + 'Reports/DeleteReport',
  },
  WIDGET: {
    GETE: baseUrl + 'Equipment/',
    GETP: baseUrl + 'EquipmentProperty/',
    GETA: baseUrl + 'EquipmentAlert/',
    POST: baseUrl + 'Widget/',
    DELETE: baseUrl + 'Widget/',
  },
  FILTER: {
    GET: baseUrl + 'Report/filter/',
    GET_ALL: baseUrl + 'Report/filter/',
    POST: baseUrl + 'Report/filter/',
    PUT: baseUrl + 'Report/filter/',
    DELETE: baseUrl + 'Report/filter/',
  },
  REPORTSHARE: {
    GET_USER_LIST: baseUrl + 'SharedReport/GetSharedReportUserList',
    SHARE_REPORT: baseUrl + 'SharedReport/SaveSharedReport',
    ARCHIVE_REPORT: baseUrl + 'SharedReport/SaveArchiveReport',
  },
  REPORTSCHEDULE: {
    GET_SCH_TYPES: baseUrl + 'ReportSchedule/GetReportScheduleTypes',
    POST: baseUrl + 'ReportSchedule/CreateReportSchedules',
    GET: baseUrl + 'ReportSchedule/GetReportSchedules',
    UPDATE: baseUrl + 'ReportSchedule/UpdateReportSchedules',
    DELETE: baseUrl + 'ReportSchedule/DeleteReportSchedule',
    GET_RPTID_TOKEN: baseUrl + 'ReportSchedule/GetReportIdAndTokenByCode',
    GET_RPTURL_BYID: baseUrl + 'ReportSchedule/GetReportUrlById',
  },

  ACTIVITY: {
    GET: baseUrl + 'Activity',
  },
  ACTIVITYALERT: {
    GET: baseUrl + 'ActivityAlert',
  },
};
