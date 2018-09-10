import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular4';

@Injectable()
export class AdalServiceStub extends AdalService {

  constructor() {
    super();
  }

  init(configOptions: adal.Config) {
  }

  login() {
  }

  handleWindowCallback() {
  }

  logOut() {
  }

  clearCache() {
  }
}
