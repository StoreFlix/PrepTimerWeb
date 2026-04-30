import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { PlatformLocation } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './core/layout/nav-menu/nav-menu.component';
import { BreadcrumbComponent } from './core/layout/breadcrumb/breadcrumb.component';

import { HttpErrorInterceptor } from './shared/http-error.interceptor';
import { AuthComponent } from './auth/auth.component';
import { SharedModule } from './shared/shared.module';
import { PreptimerHeaderComponent } from './core/layout/preptimer-header/preptimer-header.component';
import { PreptimerFooterComponent } from './core/layout/preptimer-footer/preptimer-footer.component';

 
export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    BreadcrumbComponent,
    AuthComponent,
    PreptimerHeaderComponent,
    PreptimerFooterComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    FormsModule,
    HttpClientModule ,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    { provide: 'BASE_URL',  useValue: environment.baseUrl  },
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
