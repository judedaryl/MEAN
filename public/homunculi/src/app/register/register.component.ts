import { HttpParams } from '@angular/common/http';
import { HttpRequestService } from './../http-request.service';
import { User } from './../models/user';
import { Component, OnInit, style, state, animate, transition, trigger } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var $: any;
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  user = new User('', '', '');
  submitted = false;
  registerForm: FormGroup;
  response: string[];

  constructor(private builder: FormBuilder, private hrs: HttpRequestService, private http: HttpClient) {
    this.createForm();
  }
  createForm() {
    this.registerForm = this.builder.group({
      displayname: ['', [Validators.minLength(4) , Validators.required] ],
      email: '',
      password: ['', [Validators.minLength(8) , Validators.required] ]
    });
  }



  ngOnInit() {

  }

  get diagnostic() { return JSON.stringify(this.user); }

  onSubmit() { this.submitted = true; }


  onMessage(): void {
      $('.message').closest('.message').transition('fade');
  }

  async onRegister() {
    
    const body = new HttpParams()
      .set('displayname', this.registerForm.get('displayname').value)
      .set('email', this.registerForm.get('email').value)
      .set('password', this.registerForm.get('password').value);
    console.log(await this.hrs.getUsers());
    /*
    //console.log(this.hrs.post(this.registerForm.value));
    
    console.log('here');

    this.http.post('http://localhost:9090/users', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe(data => {
      console.log(data);
    });
    */

  }

}

