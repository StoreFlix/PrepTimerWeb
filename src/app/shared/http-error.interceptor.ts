import { HttpEvent, HttpInterceptor, HttpHandler,HttpRequest,HttpResponse, HttpErrorResponse, HttpHeaders,} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';

export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const id_token = localStorage.getItem('id_token');
    // if(!id_token){
    //   this.ShowMessage('Session Expired.','Redirecting to login screen','error',true);
    //   return
    // }
    const headerDetails:any = localStorage.getItem('header_details');
    let token = id_token ? id_token : '';
    let Code = localStorage.getItem('view_Code') != ''? localStorage.getItem('view_Code'): null;
    if (Code != null) {
      if ( localStorage.getItem('view_Token') != null &&
          localStorage.getItem('view_Token') != ''
       ) {
        request = request.clone({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Token: localStorage.getItem('view_Token'),
          }),
        });
      } else {
        request = request.clone({
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Code: Code,
          }),
        });
      }
    } else {
      request = request.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ token
        }),
      });
    }

    if(request.url.includes("SaveLabelCategory") || request.url.includes("CreateActivateSubscription") || request.url.includes("LabelSaveUpdate")){
      request = request.clone({
        headers: new HttpHeaders({
         'Authorization': 'Bearer '+ token
        }),
      });
    } 

    if(request.url.includes("AddUpdateCondimentLanguage")){
      request = request.clone({
        headers: new HttpHeaders({
          'Authorization': 'Bearer '+ token
        }),
      });
    } 

    if(request.url.includes("api/item") && (request.method === 'POST' || request.method === 'PUT')){
      request = request.clone({
        headers: new HttpHeaders({
        'Authorization': 'Bearer '+ token
        }),
      });
    } 
    if(request.url.includes("subscriptionplatform")){
      request = request.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }

    if (request.url.toLowerCase().includes("label")) {
      if (headerDetails) {
        let headerMenus = (JSON.parse(headerDetails).headerMenuList || []);
        if (!headerMenus.some((a) => a.menuName.toLowerCase().includes("label"))) {
          this.ShowMessage('Oops...', 'You are not authorized to access this.', 'error', true);
          return
        }
      }
    }

    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if(request.url.includes('payment')){
         
        }
        else if(request.url.includes('assets/themes')){

        }          
        else if (error.status == 0) {
          this.ShowMessage('Oops...','Please start Services!','error',false);
        } 
        else if (error.status == 400) {
          this.ShowMessage('Oops...','Something went wrong!','error',false);
        } 
        else if (error.status == 401) {
          this.ShowMessage('Session Expired.','Redirecting to login screen','error',true);
        } 
        else if (error.status == 403) {
          this.ShowMessage('Oops...','Forbidden','error',true);
        } 
        else if (error.status == 405) {
          this.ShowMessage('Oops...','Method is not Allowed!','error',true);
        } 
        else if (error.status == 500) {
          this.ShowMessage('Oops...','Hm..unfortunately the server is crashed..apologies!','error',false);
        } 
        else {
          this.ShowMessage('Oops...','Something went wrong!','error',false);
        }

        return throwError(error);
      })
    );
  }

  redirectToLogin(){
    localStorage.removeItem('id_token');
    localStorage.removeItem('header_details');
    window.open(environment.logoutUrl, '_self');
  }

  ShowMessage(title:string,text:string,icon:any,redirectLogin:boolean){
    // if (redirectLogin) {
    //   Swal.fire({
    //     title: title,
    //     text: text,
    //     icon: icon,
    //     timer:4000,
    //     timerProgressBar:true,
    //     onClose: () => {
    //       if (this.redirectToLogin)
    //         this.redirectToLogin();
    //     },
    //   });
    // }
    // else{
    //   Swal.fire({
    //     title: title,
    //     text: text,
    //     icon: icon,
    //   });
    // }
  }
}
