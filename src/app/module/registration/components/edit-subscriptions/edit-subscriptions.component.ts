import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-edit-subscriptions',
  templateUrl: './edit-subscriptions.component.html',
  styleUrls: ['./edit-subscriptions.component.scss']
})
export class EditSubscriptionsComponent implements OnInit {
  currentStep:   number  = 1;
  reponseloading: boolean = false;
  checkoutTotal:  number  = 0;
  @ViewChild('subscription')  subscriptionForm: any;
  @ViewChild('checkout')  checkoutForm: any;
  @ViewChild('billingAddressForm')  billingAddressForm: any;
  selectedSubscriptionDetails:any=[];

  constructor(private regService: RegistrationService) { }

  ngOnInit(): void {
    this.regService.currentStep.subscribe(step    => { this.currentStep    = step; });
    this.regService.reponseloading.subscribe(res   => { this.reponseloading = res; });
    this.regService.paymentAmount.subscribe(amount => { this.checkoutTotal  = amount; });

    // Always mark as edit-subscription flow
    this.regService.editSubscription = true;

    // If coming from My Subscriptions, the service already has franchise + step set.
    // On a direct reload (franchiseCode missing or fusebillId = 0), fetch company
    // details first, then load subscription options — same as mySubscriptions.addSubsc().
    const alreadyInitialised = this.regService.customerId.getValue() > 0;

    if (alreadyInitialised) {
      // Normal navigation path — data is already in the service
      this.regService.getSubscriptionDetails();
    } else {
      // Direct reload — bootstrap the service state before loading subs
      this.regService.setInitialValues();
      this.regService.setNextStep(1);

      this.regService.getCompanyFuseBillId().subscribe(res => {
        if (res) {
          this.regService.setFusebillId(res.fusebillID);
          this.regService.setFranchise(res.franchaiseCode);
          localStorage.setItem('franchiseCode', res.franchaiseCode);
        }
        this.regService.getSubscriptionDetails();
      });
    }
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
