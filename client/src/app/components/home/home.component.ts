import { Component, OnInit } from '@angular/core';
import {HomeService} from "../../home.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  users = [];
  challenges = [];
  bets = [];

  constructor(
    private hs: HomeService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.hs.getUsers()
      .subscribe((data) => {
        console.log(data);
        this.users = data.data;
      });
  }
  loadChallenges(): void {
    this.hs.getChallenges()
      .subscribe(data => {
        console.log(data);
        this.challenges = data.data;
      });
  }

}
