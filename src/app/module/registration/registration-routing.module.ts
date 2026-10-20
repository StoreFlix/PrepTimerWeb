import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationShellComponent } from './components/registration-shell/registration-shell.component';
import { CompanyRegistrationComponent } from './components/company-registration/company-registration.component';
import { EditSubscriptionsComponent } from './components/edit-subscriptions/edit-subscriptions.component';
import { MySubscriptionsComponent } from './components/my-subscriptions/my-subscriptions.component';

const routes: Routes = [
  // Public registration flow — wrapped in branded shell (navbar + footer)
  {
    path: '',
    component: RegistrationShellComponent,
    children: [
      { path: '', component: CompanyRegistrationComponent, pathMatch: 'full' }
    ]
  },
  // Post-login pages — rendered inside the main app shell (nav-menu + breadcrumb)
  { path: 'mysubscriptions', component: MySubscriptionsComponent },
  { path: 'addsubs',         component: EditSubscriptionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
