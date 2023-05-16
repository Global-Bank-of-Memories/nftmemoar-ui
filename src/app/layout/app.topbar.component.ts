import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../core/services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];
  isAuthenicated: boolean = false;

  constructor(
    public layoutService: LayoutService,
    public authService: AuthService,
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.isAuthenicated = true;
    }
  }

  logout() {
      this.authService
        .logout()
        .subscribe();
    }
  }
