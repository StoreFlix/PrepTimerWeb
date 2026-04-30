import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import Swal from 'sweetalert2';
import { CustomerDetails, RegisterUser } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @ViewChild('detailsForm')userDetailsForm:FormGroupDirective;
  @ViewChild('logo')logo:any;

  @Output() formSubmitted = new EventEmitter<RegisterUser>();
  userDetails:RegisterUser =new RegisterUser();
  customerDetails:CustomerDetails;
  imageUrl:any;
  showLogo:boolean = false;
  cnfmpassword:string="";
  validEmail:boolean = true;
  validUserName:boolean = true;

  constructor(private regService:RegistrationService) { }

  ngOnInit(): void {

    this.regService.customerDetails.subscribe((_custDetails)=>{
      this.customerDetails = _custDetails;
      if(this.customerDetails.userDetails){
        this.userDetails = this.customerDetails.userDetails;
      }
      if(this.customerDetails.companyDetails)
        this.showLogo = this.customerDetails.companyDetails.isCommercial == 1 ? true :false;
  });
  this.regService.imageUrl.subscribe((img)=>{
    this.imageUrl = img;
  })
  }

  checkValidUserName(){
    this.regService.setLoader(true);
    this.regService.checkCustomerLoginName(this.userDetails.name).subscribe((res)=>{
      this.validUserName = !res;
      this.regService.setLoader(false);
    })
  }

  SubmitForm() {
    this.userDetailsForm.onSubmit(undefined);
    if (this.userDetailsForm.form.valid && this.validEmail && this.validUserName){
      
      if(!this.userDetails.name)
        this.userDetails.name =  this.userDetails.email

      if(this.cnfmpassword != this.userDetails.password){
        Swal.fire({text:"Confirm password is not matched",icon:"error"})
        return;
      }
      this.customerDetails.userDetails = this.userDetails;
      this.regService.setCustomerDetails(this.customerDetails);
      this.formSubmitted.emit(this.userDetails);
    }
  }

  allowOnlyAlphaNumeric(e){
    var inp = String.fromCharCode(e.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      e.preventDefault();
      return false;
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

  emailAddressChanged(){
  
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.validEmail = this.userDetails.email.match(mailformat) ? true : false;
  }

}
