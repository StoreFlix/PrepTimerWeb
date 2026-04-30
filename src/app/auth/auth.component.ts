import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../core/service/core.service';
import { LoginModel, User } from '../core/model/menu.model';
import { FormGroupDirective } from '@angular/forms';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  @ViewChild('loginForm')loginForm:FormGroupDirective;
  reponseloading:boolean = false;
  public access_Token: string;
  public routeChoice:string;
  loginModel:LoginModel =new LoginModel();
  constructor(private route: ActivatedRoute,private router: Router,private _coreService:CoreService){
    this.loginModel.userDetails = new User();
  }
  ngOnInit() {
  this.access_Token = this.route.snapshot.queryParamMap.get('t');
  this.routeChoice = this.route.snapshot.queryParamMap.get('r');
  this.getToken(this.access_Token);
  this.getrouting(this.routeChoice);
  }

  getToken(access_Token ){
    if (access_Token)
      localStorage.setItem('id_token', access_Token);
  }

  getrouting(routeChoice ){
      switch( routeChoice ) {
        case 'report': {
          this.router.navigate(['reports']);
            break;
        }
        case 'alerts': {
          this.router.navigate(['alerts']);
            break;
        }
        case 'label': {
          this.router.navigate(['label']);
            break;
        }
        case 'registration': {
          this.router.navigate(['registration']);
            break;
        }
        case 'mysubscriptions': {
          this.router.navigate(['registration/mysubscriptions']);
            break;
        }
        default: {
          this.router.navigate(['']);
            break;
        }
      }
  }

  SubmitForm(){

    this.loginForm.onSubmit(undefined);

    if(this.loginForm.valid)
    {
      this.reponseloading = true;
      this.loginModel.isWebLogin = true;

      this._coreService.login(this.loginModel).pipe(catchError(error=>of(this.handleError(error)))).subscribe((res)=>{
        console.log(res);
        localStorage.setItem('id_token', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);

        this.getrouting('mysubscriptions');

        this.reponseloading = false;

      })
    }

  }

  handleError(res:any){
    this.reponseloading = false;
    Swal.fire({ title: res?.error?.message,
      icon: 'error',
    });
  }

 
}
