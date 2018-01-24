import { HttpRequestService } from './http-request.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  public userdetail: Object = {
    displayname: null,
    email: null,
    loggedin: false
  };

  constructor(private request: HttpRequestService) {
  }

  async register(params): Promise<any> {
    try {
        return await this.request.post(params, '/users');
    } catch (error) {}
}

  async login(params): Promise<any> {
    const response =  await this.request.post(params, '/users/login');
    if (response['status'] === 'ok' ) {
      console.log(response['data']);
      if (response['data'] !== null) {
        this.userdetail['displayname'] = response['data']['displayname'];
        this.userdetail['email'] = response['data']['email'];
        this.userdetail['loggedin'] = true;
        localStorage.setItem('user', JSON.stringify(this.userdetail));
      }
    }

    return response;
  }

  get userLoggedIn(): boolean {
    const temp = JSON.parse(localStorage.getItem('user'));
    if (temp === null) { return false;
    } else { return true; }
  }

}
