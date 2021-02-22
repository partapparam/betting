import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import * as moment from 'moment';
import {shareReplay} from "rxjs/operators";

const APIURL = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoginSubject$ = new BehaviorSubject<boolean>(this.getToken());

  constructor(
    private http: HttpClient
  ) { }

  getToken(): boolean {
    return !!localStorage.getItem('token');
  }
  getExpiration(): boolean {
    const expiration = localStorage.getItem('expiresIn');
    return JSON.parse(expiration) > Date.now();
  }

  setSession(tokenData): void {
    const expiresIn = moment().add(tokenData.expiresIn, 'second');
    localStorage.setItem('token', tokenData.data);
    localStorage.setItem('expriresIn', JSON.stringify(expiresIn.valueOf()));
    this.isLoggedIn();
  }

  isLoggedIn(): Observable<any> {
    if (this.getExpiration()) {
      console.log('valid token');
      this.isLoginSubject$.next(true);
    } else {
      console.log('invalid token');
      this.isLoginSubject$.next(false);
    }
    return this.isLoginSubject$.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    this.isLoginSubject$.next(false);
  }

  login(data): Observable<any> {
    return this.http.post<any>(APIURL + 'login', data)
      .pipe(
        shareReplay()
      );
  }

  signup(data): Observable<any> {
    return this.http.post<any>(APIURL + 'signup', data)
      .pipe(
        shareReplay()
      );
  }

}
