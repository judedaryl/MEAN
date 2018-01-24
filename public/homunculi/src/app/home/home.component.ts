import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  get displayname() {
    const temp = JSON.parse(localStorage.getItem('user'));
    return temp['displayname'];
  }

  get userLoggedIn(): boolean {
    return this.userService.userLoggedIn;
  }
}
