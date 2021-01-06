import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient} from '@angular/common/http';

const URL = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<any> {
    return this.http.get<any>(URL + 'home');
  }

  getChallenges(): Observable<any> {
    return this.http.get<any>(URL + 'getChallenges');
  }

  getBets(): Observable<any> {
    return this.http.get<any>(URL + 'getBets');
  }
}
