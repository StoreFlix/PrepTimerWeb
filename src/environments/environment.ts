// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  baseUrl: 'https://preptimer-api.azurewebsites.net/',

  pageSize:40,
 // Equipment ,Alert, Property Page Size
  ePATypePageSize:2000,
  production: false,
  logoutUrl: "https://digital.antunes.com/",
  profileUrl: "http://demo.storeflix.com/Generic/UpdateProfile",
  alertUrl: "http://demo.storeflix.com/Alerts/AlertProfile",
  mapApiKey:"AIzaSyCe119kBF2IvNA5YpDt9f6EwljN5s73Pl8",
  siteurl:"http://demo.storeflix.com",
  mapquestKey: "GXk0NVfBONPqeGJGmXynFZHaZvSKoYYI"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
