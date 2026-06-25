import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-main-home',
  standalone: true,
  imports: [HomeComponent],
  template: `<app-home></app-home>`
})
export class MainHomeComponent {}
