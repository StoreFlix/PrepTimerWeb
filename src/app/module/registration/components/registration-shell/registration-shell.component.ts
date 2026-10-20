import { Component } from '@angular/core';

@Component({
  selector: 'app-registration-shell',
  templateUrl: './registration-shell.component.html',
  styleUrls: ['./registration-shell.component.scss']
})
export class RegistrationShellComponent {
  currentYear = new Date().getFullYear();
}
