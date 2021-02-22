import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.signupForm = fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  signup(): void {
    const values = this.signupForm.value;
    // to do when the values are empty.
    // if (!values) ;
    this.subscription = this.authService.signup(values)
      .subscribe(response => {
        if (response.status === 'success') {
          console.log(response);
          this.authService.setSession(response);
          return this.router.navigateByUrl('/home');
        }
        // do this if it fails
        // todo add notifcation service
        console.log(response);
        return this.signupForm.reset();
      }, (err) => {
        console.log('didnt work, error', err);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}
