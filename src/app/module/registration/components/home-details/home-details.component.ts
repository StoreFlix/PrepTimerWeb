import { Component,  ElementRef,  EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { CustomerDetails, RegisterCompany } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';
import { environment } from 'src/environments/environment';
declare var L:any
L.mapquest.key = environment.mapquestKey;

@Component({
  selector: 'home-details',
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.scss']
})
export class HomeDetailsComponent implements OnInit {

  constructor(private regService:RegistrationService) { }

  @ViewChild('detailsForm')companyDetailsForm:FormGroupDirective;
  @Output() formSubmitted = new EventEmitter<RegisterCompany>();
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  
  companyDetails:RegisterCompany =new RegisterCompany();
  customerDetails:CustomerDetails;
  storeDetails:any;
  validName:boolean = true;
  message:string;
  imgURL:any;
  companyfrachise:any;
  countriesData:any=[];
  countriesList:any=[];
  stateList:any[] = [];
  franchises:any[];
  homeMap:any ={};
  map: any;
  

  ngOnInit(): void {
    this.companyDetails.logoFile = "Choose file";
    this.companyDetails.country = "United States";

    this.regService.countryStateList.subscribe((e)=>{
      this.countriesData = (e|| [])
      this.countriesList =  this.countriesData ;
      let selCountry = this.countriesData.find(c=>c.iso3 =="USA")
      if(selCountry)
        this.stateList = (selCountry.states || [])
    })

    this.regService.franchiseList.subscribe((franchLst)=>{
        this.franchises = franchLst;
    })

    this.regService.customerDetails.subscribe((_custDetails)=>{
        this.customerDetails = _custDetails;
      if (this.customerDetails.companyDetails) {
        this.companyDetails = this.customerDetails.companyDetails;
      }
      else
        this.companyDetails = new RegisterCompany();
    });

    this.regService.homeMapDetails.subscribe((map)=>{
      this.homeMap.latitude = map.latitude;
      this.homeMap.longitude = map.longitude;
      this.homeMap.timeZone = map.timeZone;
    })

    
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  preview(files) {
    if (files.length === 0)
      return;
    this.companyDetails.logoFile  = files[0].name;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  SubmitForm() {
    this.companyDetailsForm.onSubmit(undefined);
    if (this.companyDetailsForm.form.valid && this.validName){
      this.companyDetails.isCommercial = 0;
      this.homeMap.latitude = parseFloat(this.homeMap.latitude).toFixed(2);
      this.homeMap.longitude = parseFloat(this.homeMap.longitude).toFixed(2);
      this.customerDetails.companyDetails = this.companyDetails;
      this.regService.setCustomerDetails(this.customerDetails);
      this.regService.setHomeMapDetails(this.homeMap);
      this.regService.setNextStep(2);
     // this.formSubmitted.emit(this.companyDetails);
    }
  }

  countryChanged(countryCode:string){
    if(countryCode){
      this.stateList = [];
      let selCountry = this.countriesData.find(c=>c.iso3 ==countryCode);
      if(selCountry)
        this.stateList = (selCountry.states || [])
    }
  }

  setFranchise(){
    this.regService.setFranchise(this.companyfrachise);
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

  mapInitializer() {

    if (this.homeMap.latitude || this.homeMap.longitude) {
      let latLng = { lat: this.homeMap.latitude, lng: this.homeMap.longitude }
      this.LoadMapBylatlang(latLng);
      return;
    }

    L.mapquest.geocoding().geocode('USA', (error, response) => {
      let location = response.results[0].locations[0];
      let latLng = location.displayLatLng;
      if (this.map) {
        this.map.remove();
      }
      this.map = L.mapquest.map(this.gmap.nativeElement, {
        center: latLng,
        layers: L.mapquest.tileLayer('map'),
        zoom: 1
      });
      this.map.addControl(L.mapquest.control());
    });
  }

  createMap(error, response) {
    var location = response.results[0].locations[0];
    var latLng = location.displayLatLng;

    if(latLng){
      this.homeMap.latitude = latLng.lat;
      this.homeMap.longitude = latLng.lng;
    }
    this.LoadMapBylatlang(latLng);
    this.map.addControl(L.mapquest.control());
  }

  calGeoCode(){
    let address = [this.companyDetails.address1,this.companyDetails.address2,
    this.companyDetails.city,this.companyDetails.country,this.companyDetails.zipcode].join(',');

    if(address)
       L.mapquest.geocoding().geocode(address, this.createMap.bind(this));
  }

  latlangChanged() {
    if (this.map) {
      this.map.remove();
    }

    let latLng = { lat: this.homeMap.latitude, lng: this.homeMap.longitude }
    this.LoadMapBylatlang(latLng)
  }

   LoadMapBylatlang(latLng: any) {
    if (this.map)
      this.map.remove();
    this.map = L.mapquest.map(this.gmap.nativeElement, {
      center: latLng,
      layers: L.mapquest.tileLayer('map'),
      zoom: 8
    });
    L.marker(latLng, {
      icon: L.mapquest.icons.marker(),
      draggable: false
    }).addTo(this.map);
  }

  checkValidCompanyName(){
    this.regService.setLoader(true);
    this.regService.checkCustomerCompanyName(this.companyDetails.name).subscribe((res)=>{
      this.validName = !res;
      this.regService.setLoader(false);
    })
  }
 
}
