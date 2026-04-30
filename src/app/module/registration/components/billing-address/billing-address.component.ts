import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FullBillPaymentRequest, RegisterUser } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'billing-address',
  templateUrl: './billing-address.component.html',
  styleUrl: './billing-address.component.scss'
})


export class BillingAddressComponent implements OnInit {

  @ViewChild('billingAddressForm')billingAddressForm:FormGroupDirective;
  @Output() formSubmitted = new EventEmitter<FullBillPaymentRequest>();
  fusebillPaymentRequest:FullBillPaymentRequest = new FullBillPaymentRequest();
  countryCode:string;
  countriesData:any=[];
  countriesList:any=[];
  stateList:any[] = [];
  copyAddress:boolean = false;

  customIsoCodes: { [key: string]: string } = {
    'Famagusta': '04',
    'Kyrenia': '06',
    'Larnaca': '03'
  };
  

  
  constructor(public regService:RegistrationService) { }
  
  ngOnInit(): void {
    this.regService.fusebillPaymentRequest.subscribe((res)=>{
      this.fusebillPaymentRequest = res;
    })
    this.regService.countryStateList.subscribe((e)=>{
      this.countriesData = (e|| [])
      this.countriesList =  this.countriesData ;
      let countryCode =  "USA";
      if(this.fusebillPaymentRequest.countryCode)
        countryCode =this.fusebillPaymentRequest.countryCode
      let selCountry = this.countriesData.find(c=>c.iso3 ==countryCode)
      if(selCountry){
        this.stateList = (selCountry.states || []).map(state => {
          if (!state.subDivisionIsoCode && this.customIsoCodes[state.name]) {
            return {
              ...state,
              subDivisionIsoCode: this.customIsoCodes[state.name]
            };
          }
          return state;
        });
      }
       // this.stateList = (selCountry.states || [])
    });

     

    this.copyCompanyAddress();
  }

  copyCompanyAddress(){
    if (!this.copyAddress)
      return
    let custDetails = this.regService.customerDetails.getValue();
    if (this.regService.editSubscription) {
      this.regService.setLoader(true);
      this.regService.getCompanyAddress().subscribe((res) => {
        if (res) {
          this.fusebillPaymentRequest.firstName = res.firstName;
          this.fusebillPaymentRequest.lastName = res.lastName;
          this.fusebillPaymentRequest.address1 = res.address1;
          this.fusebillPaymentRequest.city = res.city;
          this.fusebillPaymentRequest.stateCode = res.state;
          this.fusebillPaymentRequest.countryCode = res.country; 
          this.fusebillPaymentRequest.postalZip = res.zip;
        }
        this.regService.setLoader(false);
      })
    }
    else {
      if(custDetails.userDetails.firstName)
        this.fusebillPaymentRequest.firstName = custDetails.userDetails.firstName;

      if(custDetails.userDetails.lastName)
        this.fusebillPaymentRequest.lastName = custDetails.userDetails.lastName;

      if(custDetails.userDetails.lastName)
        this.fusebillPaymentRequest.lastName = custDetails.userDetails.lastName;

      if(custDetails.companyDetails.address1)
        this.fusebillPaymentRequest.address1 = custDetails.companyDetails.address1;
      else if(custDetails.storeDetails.address1)
        this.fusebillPaymentRequest.address1 = custDetails.storeDetails.address1;

      if( custDetails.companyDetails.city)
        this.fusebillPaymentRequest.city = custDetails.companyDetails.city;
      else if(custDetails.storeDetails.city)
        this.fusebillPaymentRequest.city = custDetails.storeDetails.city;

      if( custDetails.companyDetails.state)
        this.fusebillPaymentRequest.stateCode = custDetails.companyDetails.state;
      else if(custDetails.storeDetails.state)
        this.fusebillPaymentRequest.stateCode = custDetails.storeDetails.state;
      
      if( custDetails.companyDetails.country)
        this.fusebillPaymentRequest.countryCode = custDetails.companyDetails.country;
      else if(custDetails.storeDetails.country)
        this.fusebillPaymentRequest.countryCode = custDetails.storeDetails.country;

      if( custDetails.companyDetails.zipcode)
        this.fusebillPaymentRequest.postalZip = custDetails.companyDetails.zipcode;
      else if(custDetails.storeDetails.zipcode)
        this.fusebillPaymentRequest.postalZip = custDetails.storeDetails.zipcode;

    }
  }

  allowOnlyNumbers(e){
    var inp = String.fromCharCode(e.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }
  countryChanged(countryCode:string){
    debugger
    if(countryCode){
      this.stateList = [];
      let selCountry = this.countriesData.find(c=>c.iso3 ==countryCode);
      if(selCountry){
        this.stateList = (selCountry.states || []).map(state => {
          if (!state.subDivisionIsoCode && this.customIsoCodes[state.name]) {
            return {
              ...state,
              subDivisionIsoCode: this.customIsoCodes[state.name]
            };
          }
          return state;
        });
      }
       // this.stateList = (selCountry.states || [])
    }
  }

  SubmitForm() {
    this.billingAddressForm.onSubmit(undefined);
    if (this.billingAddressForm.form.valid){
      this.regService.setFullbillPaymentRequest(this.fusebillPaymentRequest);
      this.formSubmitted.emit(this.fusebillPaymentRequest);
    }
  }



}
