import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { CustomerDetails, RegisterCompany, RegisterStore } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

  constructor(private regService:RegistrationService) { }

  @ViewChild('detailsForm')companyDetailsForm:FormGroupDirective; 
  @ViewChild('logo')logo:any;
  @Output() formSubmitted = new EventEmitter<RegisterCompany>();
  
  companyDetails:RegisterCompany =new RegisterCompany();
  customerDetails:CustomerDetails;

  message:string;
  imageUrl:any;
  companyfrachise:any ="Others";
  countriesData:any=[];
  countriesList:any=[];
  stateList:any[] = [];
  franchises:any[];
  validName:boolean = true;
  
  ngOnInit(): void {
    this.companyDetails.logoFile = "Choose file";
    this.companyDetails.country = "United States";

    this.regService.countryStateList.subscribe((e) => {
      this.countriesData = (e || [])
      this.countriesList = this.countriesData;
      let selCountry = this.countriesData.find(c => c.iso3 == "USA")
      if (selCountry)
        this.stateList = (selCountry.states || [])
    })

    this.regService.franchiseList.subscribe((franchLst) => {
      this.franchises = franchLst;
    });

    this.regService.customerDetails.subscribe((_custDetails) => {
      this.customerDetails = _custDetails;
      if (this.customerDetails.companyDetails) {
        this.companyDetails = this.customerDetails.companyDetails;
      }
      else
        this.companyDetails = new RegisterCompany();
    });

    this.regService.imageUrl.subscribe((e) => {
      this.imageUrl = e;
    })
  }

  checkValidCompanyName() {
    this.regService.setLoader(true);
    this.regService.checkCustomerCompanyName(this.companyDetails.name).subscribe((res) => {
      this.validName = !res;
      this.regService.setLoader(false);
    })
  }

  uploadLogo(files) {
    this.regService.uploadLogo(files);
  }

  editLogo() {
    let inputElement: HTMLElement = this.logo.nativeElement as HTMLElement;
    inputElement.click();
  }

  removeLogo() {
    var dt = new DataTransfer();
    this.logo.nativeElement.files = dt.files;
    this.imageUrl = null;
    this.regService.setCompanyLogo(null);
  }

  SubmitForm() {
    this.companyDetailsForm.onSubmit(undefined);
    if (this.companyDetailsForm.form.valid ) {
          this.customerDetails.companyDetails = this.companyDetails;

      if (!this.customerDetails.storeDetails) {
        let storeDetails = new RegisterStore();
        storeDetails.address1 = this.companyDetails.address1;
        storeDetails.address2 = this.companyDetails.address2;
        storeDetails.city = this.companyDetails.city;
        storeDetails.country = this.companyDetails.country;
        storeDetails.state = this.companyDetails.state;
        storeDetails.zipcode = this.companyDetails.zipcode;
        storeDetails.phone = this.companyDetails.phone;

        this.customerDetails.storeDetails = storeDetails;
      }

          this.regService.getSubscriptionDetails();
          this.regService.setCustomerDetails(this.customerDetails);
          this.regService.setNextStep(3);
      // this.regService.setLoader(true);
      // this.regService.checkCustomerCompanyName(this.companyDetails.name).subscribe((res) => {
      //   this.validName = !res;
      //   if(this.validName){
      //     this.customerDetails.companyDetails = this.companyDetails;
      //     this.regService.getSubscriptionDetails();
      //     this.regService.setCustomerDetails(this.customerDetails);
      //     this.regService.setNextStep(2);
      //   }
      //   this.regService.setLoader(false);
      // })
     
    }
  }

  countryChanged(countryCode: string) {
    if (countryCode) {
      this.stateList = [];
      let selCountry = this.countriesData.find(c => c.iso3 == countryCode);
      if (selCountry)
        this.stateList = (selCountry.states || [])
    }
  }

  setFranchise() {
    this.regService.setFranchise(this.companyfrachise);
  }

  allowOnlyNumbers(e) {
    var inp = String.fromCharCode(e.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      e.preventDefault();
      return false;
    }
  }
}
