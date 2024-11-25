import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from 'src/DTOs/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private client: HttpClient) {}
  login(login: Login): Observable<any> {
    return this.client.post<any>(
      'http://localhost/SocialMedia/api/Account/Login',
      login
    );
  }

  getUserInfo(username: string): Observable<any> {
    return this.client.get(
      `http://localhost/SocialMedia/api/Account/GetUserInfo/${username}`
    );
  }
}
