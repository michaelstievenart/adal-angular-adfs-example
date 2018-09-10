import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { SessionStorageService } from 'ngx-webstorage';
import { AdalServiceStub } from './adal.service.stub';

@Injectable({providedIn: 'root'})
export class AuthServiceStub extends AuthService {

  constructor() {
    super(new AdalServiceStub(), new SessionStorageService());
  }

  startAuthentication() {
  }

  handleWindowCallback(): Promise<any> {
    return new Promise((accept) => {
      accept(true);
    })
  }

  logout() {

  }
}
