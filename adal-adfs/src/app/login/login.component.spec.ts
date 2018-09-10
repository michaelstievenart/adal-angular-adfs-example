import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdalServiceStub } from '../auth/testing/adal.service.stub';
import { AdalService } from 'adal-angular4';
import { SessionStorageService } from 'ngx-webstorage';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AdalService, useClass: AdalServiceStub},
        SessionStorageService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking login should start the authentication process', inject([AuthService], (auth: AuthService) => {
    const loginSpy = spyOn(auth, 'startAuthentication');
    component.login();

    expect(loginSpy.calls.count()).toEqual(1);
  }));
});
