import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  login(): void {
    const values = this.loginForm.value;
    this.subscription = this.authService.login(values)
      .subscribe(response => {
        if (response.status === 'success') {
          this.authService.setSession(response);
          return this.router.navigateByUrl('/');
        }
        console.log('error loggin in');
        return this.loginForm.reset();
      }, error => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
