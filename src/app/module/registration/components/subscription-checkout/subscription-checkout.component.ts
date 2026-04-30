import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FullBillPaymentRequest, FusebillInvoiceRequest, InvoiceResponse, PaymentAmount, RegisterCompany, SubscriptionProduct } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'subscription-checkout',
  templateUrl: './subscription-checkout.component.html',
  styleUrls: ['./subscription-checkout.component.scss']
})
export class SubscriptionCheckoutComponent implements OnInit {

  constructor(public regService:RegistrationService) { }

  totalPrice:Number = 0;
  @ViewChild('paymentForm')paymentForm:FormGroupDirective;
  @Input('subscDetails') subscDetails:any;
  @ViewChild('captcha') captcha:any;

  @Output() formSubmitted = new EventEmitter<boolean>();
  promoCode:any = "";
  fusebillInvoiceRequest:FusebillInvoiceRequest[] =[];
  fusebillPaymentRequest:FullBillPaymentRequest = new FullBillPaymentRequest();
  invoiceResponse:InvoiceResponse = new InvoiceResponse();
  promoCodeApplied:boolean = false;
  showCoupanError:boolean = false;
  countryCode:string;
  countriesData:any=[];
  countriesList:any=[];
  stateList:any[] = [];
  countryName:any ="";
  stateName:any = "";
  copyAddress:boolean = false;
  couponDisable :boolean = false
  validCoupons:any=[];
  customIsoCodes: { [key: string]: string } = {
    'Famagusta': '04',
    'Kyrenia': '06',
    'Larnaca': '03'
  };
  

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
      this.countryName = selCountry?.name;
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
        let selState = this.stateList.find(c=>c.subDivisionIsoCode==this.fusebillPaymentRequest.stateCode);
        this.stateName = selState?.name;
      }
    });
    let fusebillId = this.regService.customerId.getValue();
    let userSubsc = this.regService.userSubscriptions.getValue().customerSubscriptions;
    if(userSubsc && userSubsc.length > 0 && fusebillId > 0)
      this.couponDisable = true;

     
      //resetting captcha
    this.regService.paymentsubmitted.subscribe((res)=>{
      if(res){
          this.captcha.reset();
          this.regService.paymentsubmitted.next(false);
      }
    })

    this.copyCompanyAddress();
  }

  ngOnChanges(changes:SimpleChanges){
    if (changes.subscDetails && changes.subscDetails.currentValue) {
      let prodPrices = this.subscDetails.map((e)=> {return  ( Number(e.subDetails.planDetails.actPrice) || 0) })
      this.totalPrice = prodPrices.reduce((a,b)=> a+ b,0);
      this.fusebillInvoiceRequest=[]; 
      this.subscDetails.map((s)=>{
        let plan = this.fusebillInvoiceRequest.find((f)=>f.planId == s.subDetails.planDetails.planId);
        let subscriptionProduct: SubscriptionProduct = new SubscriptionProduct()
        subscriptionProduct.isIncluded = true;
        subscriptionProduct.quantity = s.subDetails.planDetails.quantity;
        subscriptionProduct.planProductUniqueId = Number(s.subDetails.planDetails.planProductUniqueId);
        if(plan){
            plan.subscriptionProducts.push(subscriptionProduct);
        }
        else{
          let planObject:FusebillInvoiceRequest = new FusebillInvoiceRequest;
          planObject.planId = Number(s.subDetails.planDetails.planId);
          planObject.planFrequencyId =Number(s.subDetails.planDetails.planFrequencyId);

          let userSubsc = this.regService.userSubscriptions.getValue().customerSubscriptions;
          if(userSubsc){
           
            let coupons = [];
            userSubsc.map((s)=>{
              let couponslist = s.couponDetail.map((c)=>{return c.couponCode});
              //coupons = [...coupons , ...couponslist];
              coupons = coupons.concat(couponslist);

            })
            planObject.couponCodes = coupons;
          }
          else{
            planObject.couponCodes = [];
          }
          planObject.subscriptionProducts = [];
          planObject.subscriptionProducts.push(subscriptionProduct);

          planObject.taxationAddress = this.regService.setTaxationAddress();

          this.fusebillInvoiceRequest.push(planObject);
        }
      });

      this.getInvoicePlan();
    }

  }

  gotoRegistration(){
    this.formSubmitted.emit(false);
  }

  gotoPrevStep(){
    let currentStep = this.regService.currentStep.getValue();
    // this.currentStep = this.currentStep- 1;
    this.regService.setNextStep(currentStep- 1);
  }

  applyCoupons(){
    this.showCoupanError = false;
    this.promoCodeApplied = true;
    
    if(!this.promoCode)
      return

    this.regService.setLoader(true);

    if(!this.validCoupons.some((coupon)=> coupon.trim().toUpperCase() == this.promoCode.trim().toUpperCase()))
      this.validCoupons.push(this.promoCode);

    this.fusebillInvoiceRequest.map((f)=>{
      if(!(f.couponCodes || []).some((coupon)=> coupon.trim().toUpperCase() == this.promoCode.trim().toUpperCase()))
        f.couponCodes.push(this.promoCode);
    })

    this.regService.getInvoicePlan({ "fusebillInvoiceRequest":this.fusebillInvoiceRequest}).subscribe((e)=>{
      this.invoiceResponse = e;
      let paymentCollectOptions:PaymentAmount = new PaymentAmount();
      paymentCollectOptions.collectionAmount = (e.total || 0 );
      this.regService.paymentAmount.next(paymentCollectOptions.collectionAmount);
      this.fusebillPaymentRequest.paymentCollectOptions = paymentCollectOptions;
      this.regService.setFullbillPaymentRequest(this.fusebillPaymentRequest);

      if (e.fusebillErrorMessage.errorMessage && e.fusebillErrorMessage.errorMessage.length > 0) {
        this.showCoupanError = true;
        this.fusebillInvoiceRequest.map((f) => {
          let couponIndex = f.couponCodes.findIndex(a => a.trim().toUpperCase()  == this.promoCode.trim().toUpperCase() )
          if (couponIndex >= 0)
            f.couponCodes.splice(couponIndex, 1);
        });
      }
      this.promoCode = "";
      this.regService.setLoader(false);

    });

    
  }

  removeCoupons(promocode){
    let coupanName = this.getCoupanName(promocode);
    this.fusebillInvoiceRequest.map((f) => {
      let couponIndex = f.couponCodes.findIndex(a => a.trim().toUpperCase() == coupanName.trim().toUpperCase())
      if (couponIndex >= 0)
        f.couponCodes.splice(couponIndex, 1);
    });

    let couponIndex = this.validCoupons.findIndex(a => a.trim().toUpperCase() == coupanName.trim().toUpperCase());
    if (couponIndex >= 0)
      this.validCoupons.splice(couponIndex, 1);
    this.getInvoicePlan();
  }

  getInvoicePlan(){
    if(this.fusebillInvoiceRequest.length <= 0)
    return;
    this.regService.setLoader(true);
    this.regService.getInvoicePlan({ "fusebillInvoiceRequest":this.fusebillInvoiceRequest}).subscribe((e)=>{
      this.invoiceResponse = e;
      let paymentCollectOptions:PaymentAmount = new PaymentAmount();
      paymentCollectOptions.collectionAmount = (e.total || 0 );
      this.regService.paymentAmount.next(paymentCollectOptions.collectionAmount);
      this.fusebillPaymentRequest.paymentCollectOptions = paymentCollectOptions;
      this.regService.setFullbillPaymentRequest(this.fusebillPaymentRequest);
      this.regService.setLoader(false);
    })
  }

  getCoupanName(couponDescription){
    if(!couponDescription)
      return "" ;
      let coupon = couponDescription.split(":")
      if(coupon && coupon.length>1)
        return coupon[1];
  }

  resolved(captchaResponse: string) {
    this.fusebillPaymentRequest.recaptcha = captchaResponse;
  }

  paymentConfirmed(){
    this.paymentForm.onSubmit(undefined);
    if (this.paymentForm.form.valid) {
      let InvoiceRequest = this.regService.invoiceRquest.getValue();
      InvoiceRequest.map((e)=>{
        e.couponCodes = this.validCoupons;
        e.subscriptionProducts = [];
      })
      this.subscDetails.map((s) => {
        let plan = InvoiceRequest.find((f) => f.planId == s.subDetails.planDetails.planId);
        let _invplan  = this.fusebillInvoiceRequest.find((f)=>f.planId == s.subDetails.planDetails.planId);
        if(_invplan){
          plan.couponCodes = (_invplan.couponCodes || [])
        }
        let subscriptionProduct: SubscriptionProduct = new SubscriptionProduct()
        subscriptionProduct.isIncluded = true;
        subscriptionProduct.quantity = s.subDetails.planDetails.quantity;
        subscriptionProduct.planProductUniqueId = Number(s.subDetails.planDetails.planProductUniqueId);
        if (plan) {
          plan.subscriptionProducts.push(subscriptionProduct);
        }
      });
      this.regService.setFullbillPaymentRequest(this.fusebillPaymentRequest);
      this.regService.createCustomer(InvoiceRequest);
    }
  }

  SubmitForm() {
   this.paymentConfirmed();
  }

  countryChanged(countryCode:string){
    if(countryCode){
      this.stateList = [];
      let selCountry = this.countriesData.find(c=>c.iso3 ==countryCode);
      if(selCountry)
        this.stateList = (selCountry.states || [])
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

}
