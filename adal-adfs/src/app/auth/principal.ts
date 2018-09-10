import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { UserInfo } from './user-info';

@Injectable({ providedIn: 'root' })
export class Principal {

  constructor(private adalService: AdalService) {
  }

  isLoggedIn(): boolean {
    return this.adalService.userInfo && this.adalService.userInfo.authenticated;
  }

  userInfo(): UserInfo {
    return this.adalService.userInfo;
  }

  getToken() {
    return this.adalService.userInfo.token;
  }
}
