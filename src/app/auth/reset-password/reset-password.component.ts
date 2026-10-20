import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import Swal from 'sweetalert2';
import { CoreService } from '../../core/service/core.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.component.scss', '../forgot-password/forgot-password.component.scss', './reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('resetForm') resetForm: NgForm;

  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword = false;
  showConfirm = false;
  reponseloading = false;
  submitted = false;
  done = false;
  tokenMissing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.tokenMissing = !this.token;
  }

  passwordsMatch(): boolean {
    return !!this.newPassword && this.newPassword === this.confirmPassword;
  }

  submit() {
    this.submitted = true;
    if (!this.resetForm || this.resetForm.invalid) return;
    if (!this.passwordsMatch()) return;
    if (this.tokenMissing) return;

    this.reponseloading = true;
    this._coreService.resetPassword(this.token, this.newPassword)
      .pipe(
        catchError(err => {
          Swal.fire({
            title: 'Could not reset password',
            text: err?.error?.message || 'The link may have expired or already been used.',
            icon: 'error'
          });
          return of(null);
        }),
        finalize(() => this.reponseloading = false)
      )
      .subscribe(res => {
        if (res) {
          this.done = true;
        }
      });
  }

  goToLogin() {
    this.router.navigate(['']);
  }
}
