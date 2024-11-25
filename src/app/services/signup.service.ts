import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignUp } from 'src/DTOs/signup';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiUrl = 'http://localhost/SocialMedia/api/Account/SignUp';

  constructor(private http: HttpClient) {}

  signUp(signUpData: SignUp): Observable<any> {
    return this.http.post<any>(this.apiUrl, signUpData);
  }
}
