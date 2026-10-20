import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import Swal from 'sweetalert2';
import { CoreService } from '../../core/service/core.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../auth.component.scss', './forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  @ViewChild('forgotForm') forgotForm: NgForm;
  email: string = '';
  reponseloading = false;
  submitted = false;
  successMessage = '';

  constructor(private _coreService: CoreService, private router: Router) {}

  submit() {
    this.submitted = true;
    if (!this.forgotForm || this.forgotForm.invalid) return;

    this.reponseloading = true;
    this._coreService.forgotPassword(this.email)
      .pipe(
        catchError(err => {
          Swal.fire({
            title: 'Unable to send reset link',
            text: err?.error?.message || 'Please try again later.',
            icon: 'error'
          });
          return of(null);
        }),
        finalize(() => this.reponseloading = false)
      )
      .subscribe(res => {
        if (res) {
          this.successMessage = res.message ||
            'If an account with that email exists, a reset link has been sent.';
        }
      });
  }

  backToLogin() {
    this.router.navigate(['']);
  }
}
