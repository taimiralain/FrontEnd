import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {
  public href = 'Reservation System';
  images = [436].map((n) => `https://image.freepik.com/foto-gratis/fondo-borroso-tienda-blur-fondo-claro-bokeh-banner-negocios_7190-${n}.jpg`);
  constructor() { }
  ngOnInit(): void {

  }
}

