import { User } from './models/user';
import { HttpRequestService } from './http-request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  user = User;

  constructor(private request: HttpRequestService) {
    const temp = JSON.parse(localStorage.getItem('user'));
    if (temp !== null) {
      this.user = temp;
    }
  }


  async login(params): Promise<any> {
    const response =  await this.request.post(params, '/users/login');
    if (response['status'] === 'ok' ) {
      console.log(response['data']);
      if (response['data'] !== null) {
        this.user['displayname'] = response['data']['displayname'];
        this.user['email'] = response['data']['email'];
        this.user['loggedin'] = true;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    }
    return response;
  }

  async register(params): Promise<any> {
    try {
        return await this.request.post(params, '/users');
    } catch (error) {}
  }

  signout(): void {
    localStorage.removeItem('user');
    this.user['loggedin'] = false;
  }

}
