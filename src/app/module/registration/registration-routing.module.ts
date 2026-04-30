import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyRegistrationComponent } from './components/company-registration/company-registration.component';
import { EditSubscriptionsComponent } from './components/edit-subscriptions/edit-subscriptions.component';
import { MySubscriptionsComponent } from './components/my-subscriptions/my-subscriptions.component';


const routes: Routes = [
  {path:'',component:CompanyRegistrationComponent},
  {path:'mysubscriptions',component:MySubscriptionsComponent},
  {path:'addsubs',component:EditSubscriptionsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
