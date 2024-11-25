// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordDTO } from 'src/DTOs/changePassword';
import { UpdateProfileImage } from 'src/DTOs/UpdateProfileImage';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost/SocialMedia/api/Account';

  constructor(private http: HttpClient) {}

  getUserInfo(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUserInfo/${username}`);
  }

  changePassword(
    username: string,
    changePasswordDTO: ChangePasswordDTO
  ): Observable<any> {
    debugger;
    return this.http.post(
      `${this.apiUrl}/ChangePassword?username=${username}`,
      changePasswordDTO
    );
  }

  updateProfileImage(
    updateProfileImageDTO: UpdateProfileImage
  ): Observable<any> {
    //debugger;
    return this.http.post(
      `${this.apiUrl}/UpdateProfileImage`,
      updateProfileImageDTO
    );
  }
}
