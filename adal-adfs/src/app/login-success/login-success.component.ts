import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { initialAnimation } from '../common/animations';
import { Principal } from '../auth/principal';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.scss'],
  animations: [initialAnimation]
})
export class LoginSuccessComponent implements OnInit {

  logoutForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private principal: Principal) {
  }

  ngOnInit() {
    this.logoutForm = this.formBuilder.group({});
    console.log(JSON.stringify(this.principal.userInfo(), null, 2));
  }

  logout() {
    this.auth.logout();
  }
}
