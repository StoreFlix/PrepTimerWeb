import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  ActivationEnd,
  NavigationStart,
} from '@angular/router';
import { CoreService } from './core/service/core.service';
import { ResponseHeaderDetails } from './core/model/menu.model';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AntunesRPT';
  headerDataResponse: ResponseHeaderDetails;
  currentUrl: string;
  access_Token: string;
  subscriptions: Subscription[] = [];
  localStorageToken: string;
  userChanged: boolean = false;
  isIndependant: boolean = true;
  headerApiProcessing:boolean = false;
  showHeaderFooter:boolean = true;
  routeChangeEvent:any
  constructor(private _coreService: CoreService, private _router: Router ,private renderer:Renderer2 
    ,private httpClient:HttpClient ,private location: Location) {
    this.localStorageToken = localStorage.getItem('id_token');
    localStorage.setItem('view_Token', '');
    localStorage.setItem('view_Code', '');
    this.setTheme();
  }


  ngOnInit(){
   let routeSubscription =  this._router.events.subscribe(event => {
      if(event instanceof ActivationEnd){

        
        this.access_Token = event.snapshot.queryParams['t'];

        if (this.access_Token)
          localStorage.setItem('id_token', this.access_Token);

        if (this.access_Token && this.localStorageToken != this.access_Token){
          localStorage.removeItem('header_details');
          this.userChanged = true;
        }

        this.routeChangeEvent= this.location.onUrlChange((_url) => {

          if(_url.includes('registration')||_url.includes('translation')||_url.includes('condiments')){
            this.showHeaderFooter = false;
          }

          
          if(_url ==  '/registration' || _url ==  '/')
              this.isIndependant = false;
          else
            this.isIndependant = true;
        })
          let url = event.snapshot.url;



          if(url.length == 0)
            this.isIndependant = false;

          if(url.length > 0 ){
            url.forEach(u=> {
              if(u.toString().includes("users") ||u.toString().includes("categories") ||u.toString().includes("condiments") || u.toString().includes("translation") || u.toString().includes("registration")){
                this.showHeaderFooter = false;
              }
            })
           
          };
          
          if (url.length >= 3) {
            if (url[0].toString() == 'reports' && url[1].toString() == 'view') {
              let code = url[2].toString();
              if (isNaN(Number(code))) {
                this.isIndependant = false;
                localStorage.setItem('view_Code', code);
              }
            }
          
          }

        const headerDetails = localStorage.getItem('header_details');

        if (headerDetails && !this.userChanged) {
          let headerObj = JSON.parse(headerDetails);
          this.headerDataResponse = headerObj;
        } else if(!this.headerApiProcessing && url.length>0 && url[0].toString() != 'registration'){
            this.getHeaderDetails();
        }

        this.userChanged = false;
        
        if(localStorage.getItem('view_Code') && localStorage.getItem('view_Code').length > 0){
          localStorage.removeItem('id_token');
          localStorage.removeItem('header_details');
        }
      }
      if (event instanceof NavigationStart) {
        setTimeout(() => {
          this.currentUrl = event.url;
        });
      }
    });

    this.subscriptions.push(routeSubscription);

 
  }

  getHeaderDetails() {
    this.headerApiProcessing = true;
    if (localStorage.getItem('view_Code') == '') {
      let headerDataSubscription = this._coreService
        .getHeaderData()
        .subscribe((res) => {
          if (res) {
            this.headerDataResponse = res;
            localStorage.setItem('header_details', JSON.stringify(res));
            //this.setTheme();
          }
          this.headerApiProcessing = false;
        });
      this.subscriptions.push(headerDataSubscription);
    }
  }


  setTheme(){
    const headerDetails = localStorage.getItem('header_details');
    if(headerDetails){
      //let companyDetails = JSON.parse(headerDetails);
      //let themeFile = `/assets/themes/${companyDetails.themeName}.css`;
      // let pivotThemeFile = `/assets/themes/webdatarocks-${companyDetails.themeName}.css`;

     this.ApplyDefaultTheme();
      this.ApplyDefaultThemePivot(); 

      // this.httpClient.head(pivotThemeFile).subscribe(() => {
      //   this.ApplyDefaultThemePivot();
      //   this.ApplyDynamicThemePivot(pivotThemeFile);

      // }, (err) => {
      //   this.ApplyDefaultThemePivot();
      // });

    }
    else {
      this.ApplyDefaultTheme();
      this.ApplyDefaultThemePivot();
    }

  }

  ApplyDefaultTheme(){
    const bluelink = this.renderer.createElement('link');
    this.renderer.setAttribute(bluelink, 'rel', 'stylesheet');
    this.renderer.setAttribute(bluelink, 'href', 'assets/themes/skin-blue.css');
    this.renderer.appendChild(document.head, bluelink);
  }
  
  ApplyDynamicTheme(themeFile){
    if(!themeFile)
    return;
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', themeFile);
    this.renderer.appendChild(document.head, link);
  }
  ApplyDefaultThemePivot(){
    const link1 = this.renderer.createElement('link');
    this.renderer.setAttribute(link1, 'rel', 'stylesheet');
    this.renderer.setAttribute(link1, 'href', 'assets/themes/webdatarocks-skin-blue.css');
    this.renderer.appendChild(document.head, link1);
  }
  ApplyDynamicThemePivot(pivotThemeFile){
    if(!pivotThemeFile)
    return;
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', pivotThemeFile);
    this.renderer.appendChild(document.head, link);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.routeChangeEvent.unsubscribe();
  }
}
