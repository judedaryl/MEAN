import { UserService } from './user.service';
import { Component } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Homunculi';
  constructor(private userService: UserService) {

  }

  get userLoggedIn(): boolean {
    return this.userService.user['loggedin'];
  }

  signOut(): void {
    this.userService.signout();
  }
}
