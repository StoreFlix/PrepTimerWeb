import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationRoutingModule } from './registration-routing.module';
import { CompanyRegistrationComponent } from './components/company-registration/company-registration.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RecaptchaModule,RecaptchaFormsModule } from "ng-recaptcha";
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { StoreDetailsComponent } from './components/store-details/store-details.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { SubscriptionDetailsComponent } from './components/subscription-details/subscription-details.component';
import { SubscriptionCheckoutComponent } from './components/subscription-checkout/subscription-checkout.component';
import { MySubscriptionsComponent } from './components/my-subscriptions/my-subscriptions.component';
import { HomeDetailsComponent } from './components/home-details/home-details.component';
import { EditSubscriptionsComponent } from './components/edit-subscriptions/edit-subscriptions.component';
import { BillingAddressComponent } from "./components/billing-address/billing-address.component";
import { RegistrationShellComponent } from './components/registration-shell/registration-shell.component';

@NgModule({
  declarations: [RegistrationShellComponent, CompanyRegistrationComponent, CompanyDetailsComponent, StoreDetailsComponent, UserDetailsComponent, SubscriptionDetailsComponent, SubscriptionCheckoutComponent, MySubscriptionsComponent, HomeDetailsComponent, EditSubscriptionsComponent, BillingAddressComponent],
  imports: [
    CommonModule,
    SharedModule,
    RegistrationRoutingModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    SharedModule
]
})
export class RegistrationModule { }
