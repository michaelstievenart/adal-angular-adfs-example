import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import Spy = jasmine.Spy;
import { AuthService } from './auth/auth.service';
import { EventManagerService } from './common/event-manager.service';
import { MaterialModule } from './common/material.module';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AdalService } from 'adal-angular4';
import { AdalServiceStub } from './auth/testing/adal.service.stub';
import { SessionStorageService } from 'ngx-webstorage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let authSpy: Spy;
  let eventManagerSpy: Spy;
  let routerSpy: Spy;

  let router: Router;
  let eventManager: EventManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginSuccessComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterTestingModule.withRoutes([{path: 'success', component: LoginSuccessComponent}]),
      ],
      providers: [
        {provide: AdalService, useClass: AdalServiceStub},
        SessionStorageService
      ]
    }).compileComponents();

    router = TestBed.get(Router);
    eventManager = TestBed.get(EventManagerService);

    router.initialNavigation();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe('on successful login', () => {
    it('should redirect user to success', inject([AuthService], (auth: AuthService) => {
      authSpy = spyOn(auth, 'handleWindowCallback').and.returnValue(Promise.resolve(true));
      spyOn(auth, 'getAuthSessionToken').and.returnValue('COMPLETED');
      routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(routerSpy.calls.first().args[0]).toEqual(['success']);
      });
    }));

    it('should publish login message', inject([AuthService], (auth: AuthService) => {
      spyOn(auth, 'handleWindowCallback').and.returnValue(Promise.resolve(true));
      spyOn(auth, 'getAuthSessionToken').and.returnValue('COMPLETED');
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      eventManagerSpy = spyOn(eventManager, 'publishSuccess');

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(eventManagerSpy.calls.count()).toEqual(1);
      });
    }));

    it('should update auth token to DISPLAYED', inject([AuthService], (auth: AuthService) => {
      spyOn(auth, 'handleWindowCallback').and.returnValue(Promise.resolve(true));
      spyOn(auth, 'getAuthSessionToken').and.returnValue('COMPLETED');
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
      spyOn(eventManager, 'publishSuccess');
      const authToken = spyOn(auth, 'updateAuthSessionToken');

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(authToken.calls.count()).toEqual(1);
      });
    }));
  });

  describe('on unsuccessful login', () => {
    it('should publish error message', inject([AuthService], (auth: AuthService) => {
      spyOn(auth, 'handleWindowCallback').and.returnValue(Promise.reject('Login Error'));
      eventManagerSpy = spyOn(eventManager, 'publishError');

      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(eventManagerSpy.calls.count()).toEqual(1);
        expect(eventManagerSpy.calls.first().args).toEqual([
          'Authentication Failed',
          'You have not been authorised to use this application'
        ]);
      });
    }));
  });

  describe('on successful logout', () => {
    it('should publish logout message', inject([AuthService], (auth: AuthService) => {
      spyOn(auth, 'handleWindowCallback').and.returnValue(Promise.resolve(false));
      spyOn(auth, 'getAuthSessionToken').and.returnValue('LOGOUT');
      eventManagerSpy = spyOn(eventManager, 'publishSuccess');

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(eventManagerSpy.calls.count()).toEqual(1);
        expect(eventManagerSpy.calls.first().args).toEqual([
          'Logout',
          'You have successfully logged out'
        ]);
      });
    }));

    it('should update auth token to DISPLAYED', inject([AuthService], (auth: AuthService) => {
      spyOn(auth, 'handleWindowCallback').and.returnValue(Promise.resolve(false));
      spyOn(auth, 'getAuthSessionToken').and.returnValue('LOGOUT');
      const authToken = spyOn(auth, 'updateAuthSessionToken');

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(authToken.calls.count()).toEqual(1);
      });
    }));
  });
});
