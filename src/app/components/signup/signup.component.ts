import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  confirmPassword = new FormControl('', [Validators.required]);
  terms = new FormControl(false, [Validators.required]);


  constructor(public auth: AuthService, public snackBar: MatSnackBar,  public router: Router) { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    console.log(this.checkFormValid());
    if (this.checkFormValid()) {
      const user = {
        username: this.username.value,
        email: this.email.value,
        password: btoa(this.password.value)
      };
      this.auth.registerUser(user).subscribe(res => {
        console.log(res);
        if (res.status) {
          this.snackBar.open(res.message, 'OK', {
            duration: 3000,
          });
          this.router.navigate(['/signin']);
        } else {
          this.snackBar.open(res.message, 'OK', {
            duration: 3000,
          });
        }
      });
    }
  }

  checkConfirmPassword(): boolean {
    return this.confirmPassword.value === this.password.value;
  }

  checkFormValid(): boolean {
    // tslint:disable-next-line:max-line-length
    return this.username.valid && this.email.valid && this.password.valid && this.terms.valid && this.checkConfirmPassword() && this.confirmPassword.valid;
  }

}
