import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  challenges$: Observable<any>;
  selectedId: number;
  displayedColumns: string[] = ['name', 'description', 'locationSearch', 'eventDate'];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.subscription = this.apiService.getHome()
      .subscribe(res => {
        console.log(res);
        this.challenges$ = res;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
