import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './no.view.html',
  styleUrls: ['./no.view.css']
})

export class NoViewComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit() {
    // this.router.navigate(['../']);
  }

}
