import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { SessionStorageService } from 'ngx-webstorage';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {

  private _config = {
    tenant: environment.config.tenant,
    clientId: environment.config.clientId,
    redirectUri: environment.config.redirectUri,
    postLogoutRedirectUri: environment.config.postLogoutRedirectUri,
    cacheLocation: environment.config.cacheLocation
  };

  private AUTH_CONSTANT = 'AUTH_MESSAGE';

  constructor(private adalService: AdalService,
              private session: SessionStorageService) {
    this.init();
  }

  init() {
    this.adalService.init(this._config);
  }

  startAuthentication() {
    this.adalService.login();
    this.session.store(this.AUTH_CONSTANT, 'STARTED');
  }

  handleWindowCallback(): Promise<any> {
    return new Promise((accept, reject) => {
      this.adalService.handleWindowCallback();

      if (this.loginError()) {
        reject(this.loginError());
      } else {
        this.updateAuthTokenToCompleted();
        accept(this.adalService.userInfo.authenticated);
      }
    });
  }

  updateAuthSessionToken() {
    this.session.store(this.AUTH_CONSTANT, 'DISPLAYED');
  }

  getAuthSessionToken() {
    return this.session.retrieve(this.AUTH_CONSTANT);
  }

  loginError(): any {
    return this.adalService.userInfo.error;
  }

  logout() {
    this.adalService.logOut();
    this.adalService.clearCache();
    this.session.clear();
    this.session.store(this.AUTH_CONSTANT, 'LOGOUT');
  }

  private updateAuthTokenToCompleted() {
    this.getAuthSessionToken() === 'STARTED' ? this.session.store(this.AUTH_CONSTANT, 'COMPLETED') : '';
  }
}

