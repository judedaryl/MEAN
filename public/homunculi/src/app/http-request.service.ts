import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../config/app';

declare var $: any;

@Injectable()
export class HttpRequestService {

    result: Object[];
    constructor(private hc: HttpClient) {
    }

    async post(params, ext): Promise<any> {
        let body = new HttpParams();
        $.each(params, function(k, v) {
        body = body.append(k, v);
        });
        try {
        return await this.hc.post(Config.api + ext, body).toPromise();
        } catch (error) {}
    }

}
