import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ShowModal(): void {
    $('.ui.modal').modal('show');
  }

  DismissMessage(): void {
      $('.message').closest('.message').transition('fade');
  }


  ngOnInit() {
  }

}
