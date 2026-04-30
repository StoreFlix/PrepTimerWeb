import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild,ElementRef } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { CustomerDetails, RegisterStore } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';
import { environment } from 'src/environments/environment';
declare var L:any
L.mapquest.key = environment.mapquestKey;
@Component({
  selector: 'store-details',
  templateUrl: './store-details.component.html',
  styleUrls: ['./store-details.component.scss']
})

export class StoreDetailsComponent implements OnInit {
  @ViewChild('detailsForm')storeDetailsForm:FormGroupDirective;
  @ViewChild('logo')logo:any;
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;

  @Output() formSubmitted = new EventEmitter<RegisterStore>();
  storeDetails:RegisterStore = new RegisterStore();
  customerDetails:CustomerDetails;

  countriesData:any=[];
  countriesList:any=[];
  stateList:any[] = [];
  timezoneList:any[] = [];
  imageUrl:any;
  map: any;
 
  constructor(private regService:RegistrationService) {
      this.storeDetails.regionName = 'region1';
      this.storeDetails.territoryName = 'territory1';
      this.storeDetails.subTerritoryName = 'subterritory1';
   }

  ngOnInit(): void {
    this.regService.countryStateList.subscribe((e) => {
      this.countriesData = (e || []);
      this.countriesList = this.countriesData;
      let selCountry = this.countriesData.find(c => c.iso3 == "USA")
      if (selCountry)
        this.stateList = (selCountry.states || []);
    });
    this.regService.customerDetails.subscribe((_custDetails) => {
      this.customerDetails = _custDetails;
      if (this.customerDetails.storeDetails) {
        this.storeDetails = this.customerDetails.storeDetails;
      }
    });

    this.regService.timezoneList.subscribe((res)=>{
      if(res)
        this.timezoneList = res;
    })

    this.regService.imageUrl.subscribe((img) => {
      this.imageUrl = img;
    });
  }

  ngAfterViewInit() {
    this.mapInitializer();
  }

  createMap(error, response) {
    var location = response.results[0].locations[0];
    var latLng = location.displayLatLng;

    if(latLng){
      this.storeDetails.latitude = latLng.lat;
      this.storeDetails.longitude = latLng.lng;
    }
    this.LoadMapBylatlang(latLng);
    this.map.addControl(L.mapquest.control());
  }

  SubmitForm() {
    this.storeDetailsForm.onSubmit(undefined);
    if (this.storeDetailsForm.form.valid){
      this.storeDetails.latitude = parseFloat(this.storeDetails.latitude).toFixed(2);
      this.storeDetails.longitude = parseFloat(this.storeDetails.longitude).toFixed(2);
      this.customerDetails.storeDetails = this.storeDetails;
      this.regService.setCustomerDetails(this.customerDetails);
      this.formSubmitted.emit(this.storeDetails);
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

  allowOnlyNumbers(e){
    var inp = String.fromCharCode(e.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }

  uploadLogo(files) {
    this.regService.uploadLogo(files);
  }

  editLogo(){
    let inputElement: HTMLElement = this.logo.nativeElement as HTMLElement;
    inputElement.click();
  }

  removeLogo(){
    var  dt = new DataTransfer();
    this.logo.nativeElement.files = dt.files;
    this.imageUrl = null;
    this.regService.setCompanyLogo(null);
  }

  mapInitializer() {
    if (this.storeDetails.latitude || this.storeDetails.longitude) {
      let latLng = { lat: this.storeDetails.latitude, lng: this.storeDetails.longitude }
      this.LoadMapBylatlang(latLng);
      return;
    }

    setTimeout(()=>{
      L.mapquest.geocoding().geocode('USA', (error, response) => {
        let location = response.results[0].locations[0];
        let latLng = location.displayLatLng;
        if (this.map) {
          this.map.remove();
        }
        this.map = L.mapquest.map(this.gmap.nativeElement, {
          center: latLng,
          layers: L.mapquest.tileLayer('map'),
          zoom:1,
          bestFitMargin:0
        });
        this.map.addControl(L.mapquest.control());
      });
    },3000)
  }

  calGeoCode() {
    let address = [this.storeDetails.address1, this.storeDetails.address2,
    this.storeDetails.city, this.storeDetails.country, this.storeDetails.zipcode].join(',');
    if (address)
      L.mapquest.geocoding().geocode(address, this.createMap.bind(this));
  }

  latlangChanged() {
    let latLng = { lat: this.storeDetails.latitude, lng: this.storeDetails.longitude }
    this.LoadMapBylatlang(latLng)
  }

  LoadMapBylatlang(latLng: any) {
    if (this.map)
      this.map.remove();

    if(!latLng.lat)
      latLng.lat = 0;
    if(!latLng.lng)
      latLng.lng = 0;

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

}
