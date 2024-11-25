import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/DTOs/login';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    debugger;
    var login = new Login();
    login.usernameOrEmail = this.loginForm.value['usernameOrEmail'];
    login.password = this.loginForm.value['password'];

    this.loginService.login(login).subscribe({
      next: (data) => {
        localStorage.setItem('mySecurityKey', data.token);
        this.loginService
          .getUserInfo(
            encodeURIComponent(this.loginForm.value['usernameOrEmail'])
          )
          .subscribe({
            next: (userData) => {
              localStorage.setItem('EssenseUserInfo', JSON.stringify(userData));
              console.log('User info saved to localStorage:', userData);
              this.router.navigate(['/dashboard/home']);
            },
            error: (err) => {
              console.error('Failed to fetch the user info', err);
            },
          });
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
