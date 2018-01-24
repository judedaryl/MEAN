import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../user.service';
import { Router } from '@angular/router';


declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {

  private response: Object = {
    mess: null,
    error: null,
    haserror: false
  };

  registrationForm: FormGroup;

  ngOnInit() {

  }
  constructor(private builder: FormBuilder, private userService: UserService, private router: Router) {
      this.generateForm();
  }

  generateForm() {
      this.registrationForm = this.builder.group({
        displayname: ['', [Validators.minLength(4), Validators.required]],
        email: ['', Validators.required ],
        password: ['', [Validators.minLength(6), Validators.required]]
      });
  }

  async onSubmit() {
    $('.ui.form').addClass('loading');
    this.handleResponse(await this.userService.register(this.registrationForm.value));
    $('.ui.form').removeClass('loading');
  }

  handleResponse(response: Object) {
    console.log(response);
    if (response['exists']) {
      let mess: string;
      switch (response['exists'] ) {
        case 'displayname':
          mess = 'Display name already exists.';
          break;
        case 'email':
          mess = 'Email address already exists.';
          break;
      }
      this.response['error'] = mess;
      this.response['haserror'] = true;
    }
    if (response['status'] === 'ok') {
      this.response['mess'] = 'Registration success';
      this.response['haserror'] = false;
      this.router.navigateByUrl('/login');
    }
  }

  get livedata() { return JSON.stringify(this.registrationForm.value); }
}

