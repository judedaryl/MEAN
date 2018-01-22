
import { User } from './models/user';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const apiUrl = 'http://localhost:9090/users';


@Injectable()
export class HttpRequestService {

  doingsomething: boolean;
  result: Object[];
  constructor(private hc: HttpClient) {
    this.result = [];
    this.doingsomething = false;
  }

  postUser(params: HttpParams): any {
    this.hc.get<User[]>('http://localhost:9090/users').subscribe(data => {
      console.log(data);
      return data.toString();
    });
  }

  g

  post(params: HttpParams): any {

    this.hc.post('http://localhost:9090/users', params, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe( data => {
      return data.toString();
    });
  }

  async getUsers(): Promise<any> {
    try {
      let response = await this.hc.get(apiUrl).toPromise();
      return response;
    } catch (error) {

    }
  }




}
