import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-edit-subscriptions',
  templateUrl: './edit-subscriptions.component.html',
  styleUrls: ['./edit-subscriptions.component.scss']
})
export class EditSubscriptionsComponent implements OnInit {
  currentStep:number =1;
  reponseloading:boolean = false;
  @ViewChild('subscription')  subscriptionForm: any;
  @ViewChild('checkout')  checkoutForm: any;
  @ViewChild('billingAddressForm')  billingAddressForm: any;
  selectedSubscriptionDetails:any=[];

  constructor(private regService:RegistrationService) { }

  ngOnInit(): void {
    this.regService.currentStep.subscribe((step)=>{
      this.currentStep = step;
    });

    this.regService.reponseloading.subscribe((res)=>{
      this.reponseloading = res;
    })
  }
  onSubmit(){
    if(this.currentStep == 1){
      this.subscriptionForm.SubmitForm();
    }
    else if(this.currentStep == 2){
      this.billingAddressForm.SubmitForm();
    }
    else if(this.currentStep == 3){
      this.checkoutForm.SubmitForm();
    }
   
  }
  gotoPrevStep(){
    this.regService.setNextStep(this.currentStep- 1);
  }
  
  step4Completed(subscriptionDetails:any){
    this.selectedSubscriptionDetails = subscriptionDetails;
    this.regService.setNextStep(this.currentStep+ 1);
  }
  step5Completed(fusebillPaymentRequest:any){
    this.regService.setNextStep(this.currentStep+ 1);
  }

}
