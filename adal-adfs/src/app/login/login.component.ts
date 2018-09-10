import { Component, OnInit } from '@angular/core';
import { initialAnimation } from '../common/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [initialAnimation]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({});
  }

  login() {
    this.auth.startAuthentication();
  }
}
