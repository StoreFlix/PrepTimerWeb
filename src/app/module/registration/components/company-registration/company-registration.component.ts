import { HttpClient } from '@angular/common/http';
import { Component, OnInit,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerDetails, CustomerRegistrationRequest, RegisterCompany, RegisterStore, RegisterSubscription, RegisterUser } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.scss']
})
export class CompanyRegistrationComponent implements OnInit {

  currentStep:number =1;
  currentParamTab:number = 1
  reponseloading:boolean = false;
  latitude:any = 20.5937;
  longitude:any =78.9629;
  isCommercial:boolean = true;
  isResidential:boolean = false;
  registerType:any ="commericial";
  paymentRequest:any={};
  customer:CustomerRegistrationRequest = new CustomerRegistrationRequest();
  companyDetails:RegisterCompany =new RegisterCompany();
  customerDetails:CustomerDetails;

  countriesData:any=[];
  countriesList:any=[];
  stateList:any[] = [];
  franchises:any[];
  siteUrl:any = environment.siteurl;
  @ViewChild('companyForm')  companyForm: any;
  @ViewChild('homeForm')  homeForm: any;

  @ViewChild('storeForm')  storeForm: any;
  @ViewChild('userForm')  userForm: any;
  @ViewChild('subscription')  subscriptionForm: any;
  @ViewChild('billingAddressForm')  billingAddressForm: any;

  @ViewChild('checkout')  checkoutForm: any;
  selectedSubscriptionDetails:any=[];
  constructor(private regService:RegistrationService,private http:HttpClient,private router: Router) { }
 
  ngOnInit(): void {

    let  headerDetails:any = localStorage.getItem('header_details');
    if(headerDetails){
      headerDetails= JSON.parse(headerDetails);
      if(headerDetails && headerDetails.userLoginName)
        this.router.navigate(['registration/mysubscriptions']);
    }
    this.regService.currentStep.subscribe((step)=>{
      this.currentStep = step;
    });

    this.regService.reponseloading.subscribe((res)=>{
      this.reponseloading = res;
    })

    this.regService.customerDetails.subscribe((_custDetails)=>{
      this.customerDetails = _custDetails;
      if(this.customerDetails.companyDetails){
        this.companyDetails = this.customerDetails.companyDetails;
      }
  }); 

    //this.regService.res
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

   residentialRegister(){
    this.companyDetails.isCommercial = 0;
    this.customerDetails.companyDetails = this.companyDetails;
    this.regService.setCustomerDetails(this.customerDetails);
     this.isResidential = true;
     this.isCommercial = false;
     this.registerType = "residential";

   }

   corporateRegister(){
    this.companyDetails.isCommercial = 1;
    // this.companyDetails.country ='';
    // this.companyDetails.state ='';
    this.customerDetails.companyDetails = this.companyDetails;
    this.regService.setCustomerDetails(this.customerDetails);
    this.isResidential = false;
    this.isCommercial = true;
    this.registerType = "commericial";

   }

  onSubmit(){
    if(this.currentStep == 1 && this.isCommercial){
      this.companyForm.SubmitForm();
    }
    else if(this.currentStep == 1 && this.isResidential)
        this.homeForm.SubmitForm();
        
    else if(this.currentStep == 2 && this.isCommercial ){
      this.storeForm.SubmitForm();
    } 
    else if(this.currentStep == 2 && this.isResidential ){
      this.userForm.SubmitForm();
    } 
    else if(this.currentStep == 3 && this.isCommercial  ){
      this.userForm.SubmitForm();
    }
    else if(this.currentStep == 3 && this.isResidential  ){
      this.subscriptionForm.SubmitForm();
    }
    else if(this.currentStep == 4 && this.isCommercial){
      this.subscriptionForm.SubmitForm();
    } 
    else if(this.currentStep == 5 && this.isCommercial){
      this.billingAddressForm.SubmitForm();
    } 
    else if(this.currentStep == 4 && this.isResidential){
      this.checkoutForm.SubmitForm();
    } 
    else if(this.currentStep == 6){
      this.checkoutForm.SubmitForm();
    }

  }

  gotoPrevStep(){
    // this.currentStep = this.currentStep- 1;
    if(this.currentStep == 3)
      this.regService.setNextStep(this.currentStep- 2);
    else
      this.regService.setNextStep(this.currentStep- 1);
  }

  step1Completed(companyDetails:any){
    this.regService.setNextStep(this.currentStep+ 2);
    this.customer.registerCompany = [];
    this.customer.registerCompany.push(companyDetails);
  }

  step2Completed(storeDetails:any){
    this.regService.setNextStep(this.currentStep+ 1);

    this.customer.registerStore = [];
    storeDetails.zipcode = storeDetails.zipcode.toString();
    this.customer.registerStore.push(storeDetails);
  }

  step3Completed(userDetails:any){
    this.regService.setNextStep(this.currentStep+ 1);

    this.customer.registerUser = [];
    this.customer.registerUser.push(userDetails);
  }

  step4Completed(subscriptionDetails:any){
    this.regService.setNextStep(this.currentStep+ 1);

    this.customer.registerSubscription = [];
    this.customer.registerSubscription = subscriptionDetails.map((a)=> {return a.subscriptionId});
    
    this.selectedSubscriptionDetails = subscriptionDetails;
  }

  step5Completed(fusebillPaymentRequest:any){
    this.regService.setNextStep(this.currentStep+ 1);
  }

  step6Completed(success:any){
    if(success)
     this.resiterCustomer();
   else
     this.gotoRegistration();
   }
 

  tabChange(tab:string){
    this.currentParamTab = Number(tab);
  }

  gotoRegistration(){
    this.router.navigate(['/']);
  }

  resiterCustomer(){
    let url = `http://localhost:8141/api/customer/registercustomer`;
    this.http.post(url, this.customer).subscribe((e)=>{
      alert("Customer created");
      this.gotoRegistration();
    });
  }

  
  mapInitializer() {

  //   let coordinates = new google.maps.LatLng(this.latitude, this.longitude);
  //   let mapOptions: google.maps.MapOptions = {
  //     center: coordinates,
  //     zoom:5,
  //   };

  //   this.map = new google.maps.Map(this.gmap.nativeElement, 
  //     mapOptions);

  //    let  marker = new google.maps.Marker({
  //       position: coordinates,
  //       map: this.map,
  //     });
  //     marker.setMap(this.map);
  //  }

  //  setCenter(e:any){
  //   e.preventDefault();
  //   this.mapInitializer();

    // new google.maps.Geocoder().geocode({address:"251 Pantigo Road Hampton Bays NY 11946"},function (results,status)
    // { 
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     var p = results[0].geometry.location;
    //     var lat=p.lat();
    //     var lng=p.lng();

    //     let coordinates = new google.maps.LatLng(lat, lng);
    //     let mapOptions: google.maps.MapOptions = {
    //       center: coordinates,
    //       zoom: 8,
    //     };
    
    //     this.map = new google.maps.Map(this.gmap.nativeElement, 
    //       mapOptions);
    
    //      let  marker = new google.maps.Marker({
    //         position: coordinates,
    //         map: this.map,
    //       });
    //       marker.setMap(this.map);

        
    //   }

    // })
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  createCustomer(){
   
    // this.regService.fuseBillPayment(this.paymentRequest).subscribe((e)=>{
    //   console.log(e);
    // })
  }

  fillData(){
    this.regService.fillDataForTest();
  }




}
