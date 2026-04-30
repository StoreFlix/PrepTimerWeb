import { Injectable } from '@angular/core';
import { RegistrationHttpService } from './registration-http.service';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from 'src/environments/environment';

import { AddFuseBillCustomerRquest, BillingAddress, CreateSubscriptionRequest, CustomerDetails, CustomerRegistrationRequest, FullBillPaymentRequest, FusebillInvoiceRequest, RegisterCompany, RegisterStore, RegisterUser, SubscriptionRequest, TaxationAddress, ViewSubscriptionsResponse } from '../models/register-company';
import {  Router } from '@angular/router';
declare var L:any
L.mapquest.key = environment.mapquestKey;
@Injectable({
  providedIn: 'root'
})

export class RegistrationService {
  countryStateList = new BehaviorSubject<any>([]);
  timezoneList = new BehaviorSubject<any>([]);
  currentStep = new BehaviorSubject<number>(1);
  franchiseList = new BehaviorSubject<any>([]);
  franchise = new BehaviorSubject<string>("Others");
  customerId = new BehaviorSubject<number>(0);
  subscriptionList = new BehaviorSubject<any>(null);
  reponseloading= new BehaviorSubject<boolean>(false);
  imageUrl = new BehaviorSubject<any>(null);
  customerDetails = new BehaviorSubject<CustomerDetails>(new CustomerDetails());
  fusebillPaymentRequest = new BehaviorSubject<FullBillPaymentRequest>(new FullBillPaymentRequest());
  userSubscriptions = new BehaviorSubject<ViewSubscriptionsResponse>(new ViewSubscriptionsResponse());
  invoiceRquest = new BehaviorSubject<SubscriptionRequest[]>([]);
  subscriptionDetails:any[] = []
  homeMapDetails =  new BehaviorSubject<any>({});
  editSubscription:boolean = false;
  logoFile:any;
  paymentsubmitted= new BehaviorSubject<boolean>(false);
  paymentAmount= new BehaviorSubject<number>(0);

  customIsoCodes: { [key: string]: string } = {
    'Famagusta': '04',
    'Kyrenia': '06',
    'Larnaca': '03'
  };

  constructor(private _regSVC:RegistrationHttpService,private router: Router) 
  { 
    this.getCountryStateList();
    //this.getSubscriptionDetails();
  }

  setNextStep(step:number){
    this.currentStep.next(step);
  }

  setFusebillId(customerId:number){
    this.customerId.next(customerId);
  }

  setFranchise(franchiseCode){
    this.franchise.next(franchiseCode);
    //this.getSubscriptionDetails();
  }

  setCompanyLogo(imageUrl){
    this.imageUrl.next(imageUrl);
    if(!imageUrl)
      this.logoFile = null;
  }

  setCustomerDetails(_custDetails:CustomerDetails){
    this.customerDetails.next(_custDetails);
  }

  setFullbillPaymentRequest(_fuseBillPayReq:FullBillPaymentRequest){
    this.fusebillPaymentRequest.next(_fuseBillPayReq);
  }

  setUserSubscriptions(_usrSubsc:ViewSubscriptionsResponse){
    this.userSubscriptions.next(_usrSubsc);
  }

  registerCustomer(body:any){
    return this._regSVC.registerCustomer(body);
  }

  getCountryStateList(){
    this.reponseloading.next(true);
    this._regSVC.getCountryStateList().subscribe((res)=>{
      if(!res)
          return
      this.countryStateList.next(res.countries);
      this.franchiseList.next(res.franchises);
      if(res.timezoneList){
        this.timezoneList.next(res.timezoneList);
      }
      this.reponseloading.next(false);
    });
  }

  getSubscriptionDetails(){
    this.reponseloading.next(true);
    let franchise = this.franchise.getValue();
    if(this.editSubscription)
        franchise = localStorage.getItem('franchiseCode');
    if(!franchise)
        franchise="Others";
     this._regSVC.getSubscriptionDetails(franchise).subscribe((subs)=>{

       const prepTimerSubs = subs.filter(s =>
         s.productCode?.toLowerCase().includes('preptimer')
       );
       this.subscriptionList.next(prepTimerSubs);
       this.setInitialInvoiceRequest();
       this.reponseloading.next(false);
     });
  }

  setLoader(loading){
    this.reponseloading.next(loading);
  }

  getInvoicePlan(body:any){
    return this._regSVC.getInvoicePlan(body);
  }

  getCompanyFuseBillId(){
    return this._regSVC.getCompanyFuseBillId();
  }

  getLatLangValues(){
    return this._regSVC.getLatLangValues();
  }

  viewSubscriptions(customerId) {
    return this._regSVC.viewSubscriptions(customerId);
  }

  manageSubscriptions(customerId) {
    return this._regSVC.manageSubscriptions(customerId);
  }

  fuseBillPayment(body: any,payurl:string) {
    return this._regSVC.fuseBillPayment(body,payurl);
  }

  createActivateSubscription(body:any){
    return this._regSVC.createActivateSubscription(body);
  }

  checkCustomerLoginName(userName){
    return this._regSVC.checkCustomerLoginName(userName);
  }

  checkCustomerCompanyName(companyName){
    return this._regSVC.checkCustomerCompanyName(companyName);
  }

  getCompanyAddress(){
    return this._regSVC.getCompanyAddress();
  }

  createCustomer(invoicRequest:SubscriptionRequest[]){
    let custId = this.customerId.getValue();
    if(custId){
      this.AddSubscriptions(invoicRequest);
      return
    }
    let addFusCustReq = new AddFuseBillCustomerRquest();
    let custDetails = this.customerDetails.getValue();
    let fusebillPayRequest = this.fusebillPaymentRequest.getValue();

    this.reponseloading.next(true);

    if (!this.editSubscription) {
      addFusCustReq.firstName = (custDetails.userDetails.firstName || fusebillPayRequest.firstName);
      addFusCustReq.lastName = (custDetails.userDetails.lastName|| fusebillPayRequest.lastName);
      addFusCustReq.primaryEmail = custDetails.userDetails.email;
      addFusCustReq.companyName = custDetails.companyDetails.name;
      addFusCustReq.currency ="USD";

      let billingAddress = this.setBillingAddress();
      billingAddress.companyName = custDetails.companyDetails.name;

      addFusCustReq.billing = billingAddress;
      this.CreateFuseBillCust(invoicRequest,addFusCustReq);
    }
    else{
      this.getCompanyAddress().subscribe((res)=>{
        if(res){
          addFusCustReq.firstName = res.firstName;
          addFusCustReq.lastName = res.lastName;
          addFusCustReq.primaryEmail = res.email;
          addFusCustReq.companyName = res.companyName;

          addFusCustReq.currency ="USD";

          let billingAddress = this.setBillingAddress();
          billingAddress.companyName = res.companyName;

          addFusCustReq.billing = billingAddress;

          this.CreateFuseBillCust(invoicRequest,addFusCustReq);
        }
      })
    }
  }

  CreateFuseBillCust(invoicRequest:SubscriptionRequest[],fusBillCustReq:any){
    this._regSVC.addFusebillCustomer(fusBillCustReq).subscribe((e:any)=>{
      let fusebillPayReq = this.fusebillPaymentRequest.getValue();
      fusebillPayReq.customerId = e.customerId;
      fusebillPayReq.publicApiKey = e.paymentToken;
      let payurl = e.paymentUrl;
      let PaymentAmount = this.paymentAmount.getValue();

      if (fusebillPayReq.paymentCollectOptions && fusebillPayReq.paymentCollectOptions.collectionAmount <= 0)
        fusebillPayReq.paymentCollectOptions = {collectionAmount:0.10};
        
      //this.fusebillPaymentRequest.next(fusebillPayReq);
      this._regSVC.fuseBillPayment(fusebillPayReq,payurl).subscribe((e)=>{

        let formData = new FormData()
        formData = this.setActivateSubscObject(invoicRequest,PaymentAmount);

        setTimeout(()=>{
          this._regSVC.createActivateSubscription(formData).subscribe((res:any)=>{
            if(res.status == 200){
              if(this.editSubscription)
                this.ShowMessage('Subscriptions created/updated successfully.','','success','registration/mysubscriptions');
              else
                Swal.fire({ title: 'Customer created successfully.',
                            icon: 'success',
                            willClose: () => {
                              window.open(environment.logoutUrl, '_self');
                          },
                      });
            }
            else{
              let msg = 'Error in customer creation. Please try again.';
              if(res.message)
                msg = res.message;
              this.ShowMessage(msg,'','error');
            }
           this.reponseloading.next(false);
           this.paymentsubmitted.next(true);
          }
          )
        },10000);
      },
      (error)=>{
        Swal.fire({title:'There was an error validating the payment method: Failed validation.',icon: 'error'})
          this.reponseloading.next(false);
          this.paymentsubmitted.next(true);
      }
      )
  });
  }

  AddSubscriptions(invoicRequest:SubscriptionRequest[]){
    this.reponseloading.next(true);
    let fusebillPayReq = this.fusebillPaymentRequest.getValue();
    fusebillPayReq.customerId = this.customerId.getValue();
    //fusebillPayReq.publicApiKey = "389364f9-a383-4519-be82-7b70f0e64352"; - Dev
    fusebillPayReq.publicApiKey = "da49be16-c81f-4571-b208-4d4e1b657eb9"; //Prod

    let payurl = "https://payments.subscriptionplatform.com/api/paymentsv2";
    let PaymentAmount = this.paymentAmount.getValue();
    if (fusebillPayReq.paymentCollectOptions && fusebillPayReq.paymentCollectOptions.collectionAmount <= 0)
       fusebillPayReq.paymentCollectOptions = {collectionAmount:0.10};
           
    //this.fusebillPaymentRequest.next(fusebillPayReq);
    this._regSVC.fuseBillPayment(fusebillPayReq,payurl).
    subscribe((e:any)=>{
        let custDetails = this.customerDetails.getValue();
        this.getCompanyAddress().subscribe((res)=>{
          let companyDetails = new RegisterCompany();
          companyDetails.name =res.companyName;
          companyDetails.address1 = res.address1;
          companyDetails.address2 = res.address2;
          companyDetails.city = res.city;
          companyDetails.state = res.state;
          companyDetails.country = res.country;
          companyDetails.zipcode = res.zip;

          custDetails.companyDetails = companyDetails;
          this.setCustomerDetails(custDetails);
          let formData = new FormData()
          formData = this.setActivateSubscObject(invoicRequest,PaymentAmount);

          setTimeout(()=>
          {
            this._regSVC.createActivateSubscription(formData).
            subscribe((res:any)=>
            {
              if(res.status == 200)
                this.ShowMessage('Subscriptions created/updated successfully.','','success','registration/mysubscriptions');
              else{
                let msg = 'Error in updating subscription. Please try again.';
                if(res.message)
                  msg = res.message;
                this.ShowMessage(msg,'','error');
              }
              this.reponseloading.next(false);
              this.paymentsubmitted.next(true);
            })
          },10000);

        })
       
    },
    (error)=>{
      this.ShowMessage('There was an error validating the payment method: Failed validation.','','error');
      this.reponseloading.next(false);
      this.paymentsubmitted.next(true);
      }
    )
  }

  addFusebillCustomer(){
    let fusBillCustReq = this.setAddFuseBillCustomerRequest();
    return this._regSVC.addFusebillCustomer(fusBillCustReq);
  }

  fillDataForTest(){
    
    let companyDetails = {id:0,name:"Test Company",phone:"9874561238",address1:"address1",address2:"address2",city:"PQR city" ,state:"NY"
                          ,zipcode:"10547",county:"PASSAIC",country:"USA",logoFile:"test.png",isCommercial:1} ;
    let storeDetails = {name:"Test Store",regionName:"West",territoryName:"Rosemead",subTerritoryName:"103",storeNumber:" 3478",phone:"9874561238"
                          ,address1:"address1",address2:"address2",city:"Test city" ,state:"IL"
                          ,zipcode:"52250",county:"COOK",country:"USA",latitude:"17.690474",longitude:"83.231049",timeZone:"Eastern Standard Time",UTCOffSet:-240} ;
    let userDetails = {name:"testuser",email:"testuser@gmail.com",title:"ROD",firstName:"Test Fname",lastName:"Test Lname" ,
                         password:"test123",landingPage:1,status:"N",phone1:"9874561238",phone2:"9874561235",userType:"C"
                         } ;
    let subscriptionDetails = [];


    let testCustomer:CustomerDetails = new CustomerDetails();
    testCustomer.companyDetails = companyDetails;
    testCustomer.storeDetails = storeDetails;
    testCustomer.userDetails = userDetails;
    testCustomer.subscDetails = subscriptionDetails;

    let fusebillPaymentRequest = new FullBillPaymentRequest();
    fusebillPaymentRequest.customerId = 9475158;
    //fusebillPaymentRequest.publicApiKey = "389364f9-a383-4519-be82-7b70f0e64352"; - Dev
    fusebillPaymentRequest.publicApiKey = "da49be16-c81f-4571-b208-4d4e1b657eb9"; //Prod
    fusebillPaymentRequest.cvv = 123;
    fusebillPaymentRequest.makeDefault = true;
    fusebillPaymentRequest.firstName = "Test";
    fusebillPaymentRequest.lastName = "user";
    fusebillPaymentRequest.cardNumber = "4111111111111111";
    fusebillPaymentRequest.expirationMonth = 12;
    fusebillPaymentRequest.expirationYear = 23;
    fusebillPaymentRequest.cvv = 123;
    fusebillPaymentRequest.paymentCollectOptions ={ "collectionAmount":1.35}
    this.fusebillPaymentRequest.next(fusebillPaymentRequest);
    this.customerDetails.next(testCustomer);

  }

  setInitialValues(){
    let testCustomer:CustomerDetails = new CustomerDetails();
    testCustomer.companyDetails = new RegisterCompany();
    testCustomer.storeDetails = new RegisterStore();
    testCustomer.userDetails = new RegisterUser();
    testCustomer.subscDetails = [];
    let subsc = this.subscriptionList.getValue();
    (subsc || []).map((s)=>{
      s.selected = false;
      s.plans.map((p)=>{
      p.isSelected = false;
      p.quantity =0;
      });
    }
    );
    this.subscriptionList.next(subsc);
    this.customerDetails.next(testCustomer);
  }

  setActivateSubscObject(invoicRequest:SubscriptionRequest[],PaymentAmount:any){

    let customerDetails = this.CopyToCustDetails();
    let regCustomerReq  = new CustomerRegistrationRequest();

    regCustomerReq.registerCompany = [];
    let companyDetails = (customerDetails.companyDetails || new RegisterCompany())
    regCustomerReq.registerCompany.push(companyDetails);


    regCustomerReq.registerStore = [];
    let storeDetails = new RegisterStore();
    
    if(customerDetails.companyDetails.isCommercial == 1)
     storeDetails = ( customerDetails.storeDetails || new RegisterStore());
    else
     storeDetails = this.setStoreObjectFromCompany(customerDetails.companyDetails)

    regCustomerReq.registerStore.push(storeDetails);

    regCustomerReq.registerUser = [];
    let userDetails = (customerDetails.userDetails || new RegisterUser())
    regCustomerReq.registerUser.push(userDetails);

    regCustomerReq.registerSubscription = customerDetails.subscDetails;
    let fusebillSubscriptionRequest:SubscriptionRequest[] = []
    invoicRequest.map((inv)=>{
      inv.customerId = this.fusebillPaymentRequest.getValue().customerId
        fusebillSubscriptionRequest.push(inv);
    });
    let _createSubReq:CreateSubscriptionRequest = new CreateSubscriptionRequest();
    _createSubReq.fusebillSubscriptionRequest = fusebillSubscriptionRequest;
    const formData = new FormData();
    
    if(this.logoFile)
      formData.append("Files",this.logoFile,this.logoFile.name);
    formData.append("FusebillId", this.fusebillPaymentRequest.getValue().customerId.toString());
    formData.append("FranchiseCode",this.franchise.getValue());
    formData.append("CustomerRegistrationRequest",JSON.stringify(regCustomerReq));
    formData.append("FusebillSubscriptionRequest",JSON.stringify(fusebillSubscriptionRequest));
    formData.append("PaymentAmount", PaymentAmount.toString());
    return formData;

  }

  setStoreObjectFromCompany(companyDetails:RegisterCompany){
    let storeDetails = new RegisterStore();
    storeDetails.name = companyDetails.name;
    storeDetails.address1 = companyDetails.address1;
    storeDetails.address2 = companyDetails.address2;
    storeDetails.city = companyDetails.city;
    storeDetails.country = companyDetails.country;
    storeDetails.state = companyDetails.state;
    storeDetails.zipcode = companyDetails.zipcode;
    storeDetails.phone = companyDetails.phone;
    storeDetails.regionName = 'region1';
    storeDetails.territoryName = 'territory1';
    storeDetails.subTerritoryName = 'subterritory1'
    if(this.homeMapDetails.getValue()){

      storeDetails.latitude = this.homeMapDetails.getValue().latitude;
      storeDetails.longitude =this.homeMapDetails.getValue().longitude;
      storeDetails.timeZone =this.homeMapDetails.getValue().timeZone;
    }
    

    return storeDetails;
  }

  setAddFuseBillCustomerRequest(){
    debugger
    let addFusCustReq = new AddFuseBillCustomerRquest();
    let custDetails = this.customerDetails.getValue();
    let fusebillPayRequest = this.fusebillPaymentRequest.getValue();
    if (!this.editSubscription) {
      addFusCustReq.firstName = (custDetails.userDetails.firstName || fusebillPayRequest.firstName);
      addFusCustReq.lastName = (custDetails.userDetails.lastName ||fusebillPayRequest.lastName) ;
      addFusCustReq.primaryEmail = custDetails.userDetails.email;
      addFusCustReq.companyName = custDetails.companyDetails.name;

      addFusCustReq.currency ="USD";

      let billingAddress = this.setBillingAddress();
      billingAddress.companyName = custDetails.companyDetails.name;

      addFusCustReq.billing = billingAddress;
    }
    else{
      this.getCompanyAddress().subscribe((res)=>{
        if(res){
          addFusCustReq.firstName = res.firstName;
          addFusCustReq.lastName = res.lastName;
          addFusCustReq.primaryEmail = res.email;
          addFusCustReq.companyName = res.companyName;

          addFusCustReq.currency ="USD";
          let billingAddress = this.setBillingAddress();
          billingAddress.companyName = res.companyName;

          addFusCustReq.billing = billingAddress;
        }
      })
    }
    return addFusCustReq;
  }

  setBillingAddress(){
    let billingAddress = new BillingAddress();

    let fusebillPayRequest = this.fusebillPaymentRequest.getValue();

    billingAddress.line1 = fusebillPayRequest.address1;
    billingAddress.line2 =  "General Delivery";
    billingAddress.postalZip =fusebillPayRequest.postalZip;
    billingAddress.city = fusebillPayRequest.city;
    billingAddress.country = fusebillPayRequest.countryCode;
    billingAddress.state = fusebillPayRequest.stateCode;

    return billingAddress;
  }

  setTaxationAddress(){
    let taxationAddress = new TaxationAddress();

    let fusebillPayRequest = this.fusebillPaymentRequest.getValue();

    taxationAddress.line1 = fusebillPayRequest.address1;
    taxationAddress.line2 =  "General Delivery";
    taxationAddress.postalZip = fusebillPayRequest.postalZip;
    taxationAddress.city = fusebillPayRequest.city;
    let countryId = 0;
    let stateId = 0;
    let countriesData = (this.countryStateList.value || []);
    let selCountry =countriesData.find(c=>c.iso3 == fusebillPayRequest.countryCode)
    if(selCountry){
      countryId = selCountry.id;
      //let stateList = (selCountry.states || [])

      let stateList = (selCountry.states || []).map(state => {
        if (!state.subDivisionIsoCode && this.customIsoCodes[state.name]) {
          return {
            ...state,
            subDivisionIsoCode: this.customIsoCodes[state.name]
          };
        }
        return state;
      });
      if(stateList){
        let selState = stateList.find(s=>s.subDivisionIsoCode ==fusebillPayRequest.stateCode)
        stateId =selState.id;
      }
    }
    taxationAddress.countryId = countryId;
    taxationAddress.stateId =stateId

    return taxationAddress;
  }


  setInitialInvoiceRequest(){
   let subsList = this.subscriptionList.getValue();
   let subscProducts = [];
   subsList.map((prod)=>{
     prod.plans.map((plan)=>{
       if(subscProducts.some(p=>p.planId == plan.planId))
        return;
       let _subcPlan = new SubscriptionRequest();
       _subcPlan.planId = plan.planId;
       _subcPlan.planFrequencyId = plan.planFrequencyId;
       _subcPlan.couponCodes = [];
       _subcPlan.subscriptionProducts = [];
       subscProducts.push(_subcPlan);
     })
   })

   this.invoiceRquest.next(subscProducts);

  }

  uploadLogo(files) {
    if (files.length === 0)
      return;

    let companyDetails =   this.customerDetails.getValue().companyDetails
    companyDetails.logoFile  = files[0].name;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    this.logoFile = files[0];

    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imageUrl.next(reader.result); 
    }
    
  }

  setHomeMapDetails(map:any){
    if (!map)
      return;

    let homeMapDetails:any = {};
    homeMapDetails.latitude = map.latitude;
    homeMapDetails.longitude = map.longitude;
    homeMapDetails.timeZone = map.timeZone;

    this.homeMapDetails.next(homeMapDetails);

  }
  
  ShowMessage(title:string,text:string,icon:any, redirectUrl:string=''){
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      willClose: () => {
        if(redirectUrl)
          this.router.navigate([redirectUrl]);
      },
    });
  }

  CopyFromCustDetails(){

  let custDetails = this.customerDetails.getValue();
  
  if(!custDetails.storeDetails)
  custDetails.storeDetails = new RegisterStore();

  let fusebillPaymentRequest:FullBillPaymentRequest = new FullBillPaymentRequest();
 
  if(custDetails.userDetails.firstName)
    fusebillPaymentRequest.firstName = custDetails.userDetails.firstName;

  if(custDetails.userDetails.lastName)
    fusebillPaymentRequest.lastName = custDetails.userDetails.lastName;

  if(custDetails.userDetails.lastName)
    fusebillPaymentRequest.lastName = custDetails.userDetails.lastName;

  if(custDetails.companyDetails.address1)
   fusebillPaymentRequest.address1 = custDetails.companyDetails.address1;
  else if(custDetails.storeDetails.address1)
   fusebillPaymentRequest.address1 = custDetails.storeDetails.address1;

  if( custDetails.companyDetails.city)
   fusebillPaymentRequest.city = custDetails.companyDetails.city;
  else if(custDetails.storeDetails.city)
    fusebillPaymentRequest.city = custDetails.storeDetails.city;

  if( custDetails.companyDetails.state)
    fusebillPaymentRequest.stateCode = custDetails.companyDetails.state;
  else if(custDetails.storeDetails.state)
    fusebillPaymentRequest.stateCode = custDetails.storeDetails.state;
  
  if( custDetails.companyDetails.country)
    fusebillPaymentRequest.countryCode = custDetails.companyDetails.country;
  else if(custDetails.storeDetails.country)
    fusebillPaymentRequest.countryCode = custDetails.storeDetails.country;

  if( custDetails.companyDetails.zipcode)
    fusebillPaymentRequest.postalZip = custDetails.companyDetails.zipcode;
  else if(custDetails.storeDetails.zipcode)
    fusebillPaymentRequest.postalZip = custDetails.storeDetails.zipcode;

    this.fusebillPaymentRequest.next(fusebillPaymentRequest);
  }

  CopyToCustDetails(){

    let custDetails = this.customerDetails.getValue();
    let fusebillPaymentRequest =  this.fusebillPaymentRequest.getValue();

    if(!custDetails.companyDetails.address1)
      custDetails.companyDetails.address1 =  fusebillPaymentRequest.address1;
    if(!custDetails.companyDetails.city)
      custDetails.companyDetails.city =  fusebillPaymentRequest.city;
    if(!custDetails.companyDetails.state)
      custDetails.companyDetails.state =  fusebillPaymentRequest.stateCode;
    if(!custDetails.companyDetails.country)
      custDetails.companyDetails.country =  fusebillPaymentRequest.countryCode;
    if(!custDetails.companyDetails.zipcode)
      custDetails.companyDetails.zipcode =  fusebillPaymentRequest.postalZip;
    if(!custDetails.companyDetails.phone)
      custDetails.companyDetails.phone =  '';

    if(!custDetails.storeDetails)
     custDetails.storeDetails = new RegisterStore();

    if(!custDetails.storeDetails.address1)
      custDetails.storeDetails.address1 =  fusebillPaymentRequest.address1;
    if(!custDetails.storeDetails.city)
      custDetails.storeDetails.city =  fusebillPaymentRequest.city;
    if(!custDetails.storeDetails.state)
      custDetails.storeDetails.state =  fusebillPaymentRequest.stateCode;
    if(!custDetails.storeDetails.country)
      custDetails.storeDetails.country =  fusebillPaymentRequest.countryCode;
    if(!custDetails.storeDetails.zipcode)
      custDetails.storeDetails.zipcode =  fusebillPaymentRequest.postalZip;
    if(!custDetails.storeDetails.phone)
      custDetails.storeDetails.phone =  '';

    if(!custDetails.storeDetails.regionName)
      custDetails.storeDetails.regionName =  'region1';
    if(!custDetails.storeDetails.territoryName)
      custDetails.storeDetails.territoryName =  'territory1';
    if(!custDetails.storeDetails.subTerritoryName)
      custDetails.storeDetails.subTerritoryName =  'subterritory1';
    

    if(!custDetails.userDetails.firstName)
      custDetails.userDetails.firstName =  fusebillPaymentRequest.firstName;
    if(!custDetails.userDetails.lastName)
      custDetails.userDetails.lastName =  fusebillPaymentRequest.lastName;
    if(!custDetails.userDetails.phone1)
      custDetails.userDetails.phone1 =  '';


    let address = [custDetails.storeDetails.address1, custDetails.storeDetails.address2,
    custDetails.storeDetails.city, custDetails.storeDetails.country, custDetails.storeDetails.zipcode].join(',');
    if (address) {
      L.mapquest.geocoding().geocode(address, (error, response) => {
        let location = response.results[0].locations[0];
        let latLng = location.displayLatLng;
        if (latLng) {
          custDetails.storeDetails.latitude = latLng.lat;
          custDetails.storeDetails.longitude = latLng.lng;
        }
      });
    }
    return  custDetails;
  }
  
}
