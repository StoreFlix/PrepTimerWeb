import { Component, OnInit } from '@angular/core';
import { ViewSubscriptionsResponse } from '../../models/register-company';
import { RegistrationService } from '../../services/registration.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss']
})
export class MySubscriptionsComponent implements OnInit {

  reponseloading:boolean =false;
  userSubsc:ViewSubscriptionsResponse = new ViewSubscriptionsResponse();
  SSOurl:string="";
  fuseBillId=0;
  fuseBillEnable:boolean = false;
  constructor(private regService:RegistrationService,private router:Router) { }

  ngOnInit(): void {
   this.userSubsc.customerSubscriptions = [];
   this.reponseloading = true;
    this.regService.getCompanyFuseBillId().subscribe((res)=>{
     if(res){
      this.fuseBillId=res.fusebillID;
      this.fuseBillEnable = res.isFusebillEnable;
      this.regService.setFusebillId(this.fuseBillId);
      this.regService.setFranchise(res.franchaiseCode);
      localStorage.setItem('franchiseCode',res.franchaiseCode);
      this.regService.getSubscriptionDetails();
       this.regService.viewSubscriptions(this.fuseBillId).subscribe((subscres)=>{
         this.userSubsc= subscres;
         this.regService.setUserSubscriptions(subscres);
       })
     }
     this.reponseloading = false;

    })
  }

  openManageSubsc(){
    this.regService.manageSubscriptions(this.fuseBillId).subscribe((mngres)=>{
      this.SSOurl = mngres.ssoUrl;
      window.open(this.SSOurl);
   });
  }

  getDateFormat(date){
    return moment(date).format('MM-DD-YYYY');
  }

  getCouponCodes(subsc){
    if(subsc.couponDetail.length <= 0)
    return "";

    let couponslist = subsc.couponDetail.map((c)=>{return c.couponCode})
    return couponslist.join();
    // if(this.userSubsc.)
  }

  addSubsc(){
    this.regService.setInitialValues();
    this.regService.editSubscription = true;
    this.regService.setNextStep(1);
    this.router.navigate(['registration/addsubs'])
  }

}
