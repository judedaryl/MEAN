import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Technologies } from './../models/technologies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  technologies = Technologies;


  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  get displayname() {
    return this.userService.user['displayname'];
  }

  get userLoggedIn(): boolean {
    return this.userService.user['loggedin'];
  }
}
