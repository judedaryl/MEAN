import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

const apiUrl = 'http://localhost:9090';
declare var $: any;

@Injectable()
export class HttpRequestService {

    doingsomething: boolean;
    result: Object[];
    constructor(private hc: HttpClient) {
        this.result = [];
        this.doingsomething = false;
    }

    // Login service
    async loginUser(params): Promise<any> {
        try {
            return await this.post(params, '/users/login');
        } catch (error) {}
    }

    // Registration service
    async registerUser(params): Promise<any> {
        try {
            return await this.post(params, '/users');
        } catch (error) {}
    }

    async post(params, api): Promise<any> {
        let body = new HttpParams();
        $.each(params, function(k, v) {
        body = body.append(k, v);
        });
        try {
        return await this.hc.post(apiUrl + api, body).toPromise();
        } catch (error) {}
    }

}
