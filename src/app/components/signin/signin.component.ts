import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(public auth: AuthService, public snackBar: MatSnackBar, public router: Router) { }

  ngOnInit() {
  }
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    if (this.checkFormValid()) {
      const user = {
        email: this.email.value,
        password: btoa(this.password.value)
      };
      this.auth.login(user).subscribe(res => {
        if (res.status) {
          this.snackBar.open(res.message, 'OK', {
            duration: 3000,
          });
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open(res.message, 'OK', {
            duration: 3000,
          });
        }
      });
    }
  }

  checkFormValid(): boolean {
    // tslint:disable-next-line:max-line-length
    return this.email.valid && this.password.valid;
  }

}
