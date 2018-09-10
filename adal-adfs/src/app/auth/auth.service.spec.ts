import { inject, TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AdalService } from 'adal-angular4';
import { SessionStorageService } from 'ngx-webstorage';
import { AdalServiceStub } from './testing/adal.service.stub';
import Spy = jasmine.Spy;

describe('AuthService', () => {
  let auth: AuthService;
  let adal: AdalServiceStub;
  let session: SessionStorageService;
  let adalSpy: Spy;
  let sessionSpy: Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: AdalService, useClass: AdalServiceStub},
        SessionStorageService
      ]
    });


    adal = new AdalServiceStub();
    session = new SessionStorageService();
    auth = new AuthService(adal, session);
  });

  it('should be created', inject([], () => {
    expect(auth).toBeTruthy();
  }));

  it('should call login', inject([], () => {
    adalSpy = spyOn(adal, 'login');
    sessionSpy = spyOn(session, 'store');

    auth.startAuthentication();

    expect(adalSpy.calls.count()).toEqual(1);
    expect(sessionSpy.calls.count()).toEqual(1);
    expect(sessionSpy.calls.first().args).toEqual(['AUTH_MESSAGE', 'STARTED']);
  }));

  it('should handle login callback successfully', inject([], () => {
    adalSpy = spyOn(adal, 'handleWindowCallback');
    spyOn(auth, 'getAuthSessionToken').and.returnValue('STARTED');
    sessionSpy = spyOn(session, 'store');

    auth.handleWindowCallback().then(() => {
    });

    expect(adalSpy.calls.count()).toEqual(1);
    expect(sessionSpy.calls.first().args).toEqual(['AUTH_MESSAGE', 'COMPLETED']);
  }));

  it('should handle login callback unsuccessfully with error', inject([], () => {
    adalSpy = spyOn(adal, 'handleWindowCallback');
    spyOn(auth, 'loginError').and.returnValue('BAD TEST ERROR');
    spyOn(auth, 'getAuthSessionToken').and.returnValue('STARTED');
    sessionSpy = spyOn(session, 'store');

    auth.handleWindowCallback().catch((error) => {
      expect(error).toEqual('BAD TEST ERROR');
    });


    expect(adalSpy.calls.count()).toEqual(1);
    expect(sessionSpy.calls.count()).toEqual(0);
  }));

  it('should handle logout', inject([], () => {
    adalSpy = spyOn(adal, 'logOut');
    const adalCacheSpy = spyOn(adal, 'clearCache');
    sessionSpy = spyOn(session, 'clear');

    auth.logout();

    expect(adalSpy.calls.count()).toEqual(1);
    expect(adalCacheSpy.calls.count()).toEqual(1);
    expect(sessionSpy.calls.count()).toEqual(1);
  }));
});
