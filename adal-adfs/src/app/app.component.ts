import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { EventManagerService } from './common/event-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService,
              private router: Router,
              private eventManager: EventManagerService) {
  }

  ngOnInit(): void {
    const url = 'success';
    this.auth.handleWindowCallback().then((loggedIn) => {
      if (loggedIn) {
        this.router.navigate([url]).then(() => {
          this.showLoginMessage();
        });
      } else {
        this.showLogoutMessage();
      }
    }).catch(() => {
      this.error();
    });
  }

  showLoginMessage() {
    const showMessage = this.auth.getAuthSessionToken() === 'COMPLETED';
    if (showMessage) {
      this.eventManager.publishSuccess(
        'Authenticated',
        'You have successfully logged in'
      );
      this.auth.updateAuthSessionToken();
    }
  }

  showLogoutMessage() {
    const showMessage = this.auth.getAuthSessionToken() === 'LOGOUT';
    if (showMessage) {
      this.eventManager.publishSuccess(
        'Logout',
        'You have successfully logged out'
      );
      this.auth.updateAuthSessionToken();
    }
  }

  error() {
    this.eventManager.publishError(
      'Authentication Failed',
      'You have not been authorised to use this application'
    );
  }
}
