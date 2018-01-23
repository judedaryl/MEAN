import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;

  ngOnInit() {

  }
  constructor(private builder: FormBuilder) {
      this.generateForm();
  }

  generateForm() {
    this.registrationForm = this.builder.group({
      displayname: ['', [Validators.minLength(4) , Validators.required] ],
      email: '',
      password: ['', [Validators.minLength(8) , Validators.required] ]
    });
}


  get livedata() { return this.registrationForm.value; }
}

