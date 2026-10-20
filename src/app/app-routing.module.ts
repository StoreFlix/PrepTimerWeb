import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';


const routes: Routes = [
  { path: '', component: AuthComponent, pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'registration', loadChildren: () => import('./module/registration/registration.module').then(m => m.RegistrationModule) },
  { path: 'preptimer', loadChildren: () => import('./module/preptimer/preptimer.module').then(m => m.PreptimerModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
