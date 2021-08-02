import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title:string = 'Asignar Becas'
  is_aspirante: boolean = true;

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.location.onUrlChange(this.onRouteChange);
  }

  onRouteChange = ()=> {
    this.is_aspirante = this.location.path().includes('aspirante');
  }

}
