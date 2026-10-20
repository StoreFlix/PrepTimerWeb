import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginModel, ResponseHeaderDetails } from '../model/menu.model';


@Injectable(
    {
        providedIn: "root"
    }
)
export class CoreService {

  private readonly _baseUrl: string;
  
  constructor(private _http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl;
  } 

  getHeaderData():Observable<ResponseHeaderDetails>{
    let url = this._baseUrl+ 'api/header';
    return this._http.post<ResponseHeaderDetails>(url,{});
  }

  login(loginModel:LoginModel){
    let url = this._baseUrl+ 'api/user/login';

    return this._http.post<any>(url,loginModel);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(this._baseUrl + 'api/user/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(this._baseUrl + 'api/user/reset-password', { token, newPassword });
  }

}
