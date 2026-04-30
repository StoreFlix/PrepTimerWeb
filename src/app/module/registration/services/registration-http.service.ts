import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AddFuseBillCustomerRquest, CreateSubscriptionRequest } from '../models/register-company';

@Injectable({
  providedIn: 'root'
})
export class RegistrationHttpService {

  private readonly _baseUrl: string;
  constructor(private http:HttpClient) { 
    this._baseUrl = environment.baseUrl;  
  }

  registerCustomer(body:any){
    let url = `${this._baseUrl}api/customer/registercustomer`;
    return this.http.post<any>(url, body);
  }

  getCountryStateList(){
    let url = `${this._baseUrl}api/Customer/GetCustomerDropDown`;
    return this.http.post<any>(url,{IsCountries:true,IsFranchise:true});
  }

  getSubscriptionDetails(franchise){
    let url = `${this._baseUrl}api/Customer/GetCustomerSubscriptions?FranchiseCode=${franchise}`;
    return this.http.get<any>(url);
  }

  getInvoicePlan(body:any){
    let url = `${this._baseUrl}api/Customer/GetInvoiceForPlan`;
    return this.http.post<any>(url, body);
  }

  fuseBillPayment(body: any,payurl:string) {
    let url = payurl;
    return this.http.post(url, body);
  }

  checkCompanyNameExists(name:string){
    let url = `${this._baseUrl}api/Customer/CheckCustomerCompanyName`;
    return this.http.post(url, name);
  }

  createActivateSubscription(body:any){
    let url = `${this._baseUrl}api/Customer/CreateActivateSubscription`;
    return this.http.post(url, body);
  }

  addFusebillCustomer(body:AddFuseBillCustomerRquest){
    let url = `${this._baseUrl}api/Customer/AddFusebillCustomer`;
    return this.http.post(url, body);
  }

  getCompanyFuseBillId(){
    let url = `${this._baseUrl}api/Customer/GetCompanyFusebillId`;
    return this.http.post<any>(url,{});
  }

  viewSubscriptions(customerId){
    let url= `${this._baseUrl}api/Customer/ViewSubscriptions?CustomerId=${customerId}`
    return this.http.get<any>(url);
  } 

  checkCustomerLoginName(userName){
    let url= `${this._baseUrl}api/Customer/CheckCustomerLoginName?strCustomerLoginName=${userName}`
    return this.http.post<any>(url,{});
  }

  checkCustomerCompanyName(companyName){
    let url= `${this._baseUrl}api/Customer/CheckCustomerCompanyName?strCustomerCompanyName=${companyName}`
    return this.http.post<any>(url,{});
  }

  getCompanyAddress(){
    let url= `${this._baseUrl}api/Customer/GetCompanyPaymentAddress`
    return this.http.get<any>(url);
  }


  manageSubscriptions(customerId){
    let url= `${this._baseUrl}api/Customer/ManageSubscriptions?CustomerId=${customerId}`
    return this.http.get<any>(url);
  }

  getLatLangValues(){
    let address = '1600+Amphitheatre+Parkway,+Mountain+View,+CA'
    let mapKey = environment.mapApiKey;
    let url =`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapKey}}`;
    return this.http.post<any>(url,{});
  }
}
