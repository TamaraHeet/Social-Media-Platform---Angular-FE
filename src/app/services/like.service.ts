import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Like } from 'src/DTOs/like';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiUrl = 'http://localhost/SocialMedia/api/Like';

  constructor(private http: HttpClient) {}

  addLike(like: Like): Observable<any> {
    return this.http.post<Like>(this.apiUrl, like);
  }

  getLikesByPostId(postId: string): Observable<any> {
    return this.http.get<Like[]>(`${this.apiUrl}/Post/${postId}`);
  }

  countLikesByPostId(postId: string): Observable<any> {
    return this.http.get<number>(`${this.apiUrl}/Count/${postId}`);
  }

  removeLike(likeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${likeId}`);
  }
}
