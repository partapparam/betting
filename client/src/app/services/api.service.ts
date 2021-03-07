import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

const URL = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getHome(): Observable<any> {
    return this.http.get<any>(URL + 'home');
  }

  getChallenge(challengeId): Observable<any> {
    console.log('making request');
    return this.http.get<any>(URL + 'getChallenge?id=' + challengeId);
      // .pipe(
      //   map(response => {
      //     console.log('got a call');
      //     if (response.status === 'success') {
      //       console.log('here');
      //       return response.data;
      //     } else {
      //       return 'Error';
      //     }
      //   })
      // );
  }

  getBets(): Observable<any> {
    return this.http.get<any>(URL + 'getBets');
  }
}
