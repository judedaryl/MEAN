import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../user.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private response: Object = {
    mess: null,
    error: null,
    haserror: false
  };

  loginForm: FormGroup;

  constructor(private builder: FormBuilder, private userService: UserService, private router: Router) {
    this.checkLogin();
    this.generateForm();
  }

  generateForm() {
    this.loginForm = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  ngOnInit() {
  }

  async onSubmit() {
    $('.ui.form').addClass('loading');
    this.handleResponse(await this.userService.login(this.loginForm.value));
    $('.ui.form').removeClass('loading');
  }

  handleResponse(response: Object) {
    if (response['data']) {
      this.response['haserror'] = false;
      this.checkLogin();
    } else {
      this.response['error'] = 'Invalid email address or password';
      this.response['haserror'] = true;
    }
  }

  checkLogin() {
    if (this.userService.userLoggedIn === true) { this.router.navigateByUrl('/home'); }
  }

  get test() { return JSON.stringify(this.loginForm.value); }
}
