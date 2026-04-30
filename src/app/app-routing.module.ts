import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';


const routes: Routes = [
  { path: '', component: AuthComponent , pathMatch: 'prefix'},
  { path: 'registration', loadChildren: () => import('./module/registration/registration.module').then(m => m.RegistrationModule) },
  { path: 'preptimer', loadChildren: () => import('./module/preptimer/preptimer.module').then(m => m.PreptimerModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
