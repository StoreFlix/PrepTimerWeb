import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { CustomerDetails, RegisterSubscription, SubscriptionRequest } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {
  
  @Output() formSubmitted = new EventEmitter<RegisterSubscription[]>();
  subscriptionData:any[] = [];
  customerDetails:CustomerDetails;

  constructor(private regService:RegistrationService) { 
  }

  ngOnInit(): void {
    this.regService.subscriptionList.subscribe((e)=>{
      this.subscriptionData = ( e|| []);
      this.subscriptionData.map((e)=>{
        e.plans.map((p)=>{
          p.actPrice = Number(p.price).toFixed(2);
          if(!p.quantity)
            p.quantity = 0;
        })
      });

      if (this.subscriptionData.length > 0 && !this.subscriptionData.some((s) => s.selected == true)){
        this.subscriptionData[0].selected = true;
        this.subscriptionData[0].plans[0].isSelected = true;
        this.subscriptionData[0].plans[0].quantity = 1;

      }
      
    });

    this.regService.customerDetails.subscribe((_custDetails)=>{
      this.customerDetails = _custDetails;
    });

    this.subscriptionData.map((sub) => {
      if (sub.plans.some((pln) => pln.isSelected == true))
        sub.selected = true;
    });

    //if prodcut is not selected, by default expand first product.
    if (this.subscriptionData.length > 0 && !this.subscriptionData.some((s) => s.selected == true)){
      this.subscriptionData[0].selected = true;
      this.subscriptionData[0].plans[0].isSelected = true;
      this.subscriptionData[0].plans[0].quantity = 1;

    }
  }

  SubmitForm() {
    //if(!this.subscriptionData[0].plans.some((pln)=> pln.isSelected == true))
      // this.subscriptionData[0].selected = false;
      this.setSelSubscriptions();
      if (this.regService.subscriptionDetails.length > 0){
        this.regService.setCustomerDetails(this.customerDetails);
        this.formSubmitted.emit(this.regService.subscriptionDetails);
      }
      else
        Swal.fire({ text: "Please select subscription with valid quantity.", icon:"warning"});
  }

  subscriptionSelected(susb: any,plan:any, isSelected:any) {
    (susb.plans || []).map((pln) => {
      //de-selected
      if (isSelected == true) {
        if (pln.planId == plan.planId) {
          pln.isSelected = false;
          pln.quantity = 0;
        }

      }
      //selected
      else {
        if (pln.planId == plan.planId) {
          pln.isSelected = true;
          if (!pln.quantity)
            pln.quantity = 1;
        }
        else {
          pln.isSelected = false;
          pln.quantity = 0;
        }
      }
    })
  }

  setSelSubscriptions(){
    this.regService.subscriptionDetails = [];
    this.customerDetails.subscDetails = [];
    this.subscriptionData.map((prod)=>{
      let plan = prod.plans.find((p)=>p.isSelected == true)
      if(plan && plan.quantity && plan.quantity > 0){
        let subscriptionId = prod.subscriptionId;
        let productDetails:any = {};
        productDetails.planDetails = plan;
        productDetails.Name = prod.productName;
        productDetails.Id = prod.productId;
    
        this.regService.subscriptionDetails.push({subscriptionId: Number(subscriptionId), subDetails:productDetails});
        this.customerDetails.subscDetails.push({ subscriptionId: Number(subscriptionId)})
      }
    })
  }

  increase(plan: any) {
  plan.quantity = (plan.quantity || 0) + 1; // initialize if undefined
}

decrease(plan: any) {
  if (plan.quantity && plan.quantity > 0) {
    plan.quantity--;
  }
}

}
