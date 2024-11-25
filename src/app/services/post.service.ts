import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/DTOs/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost/SocialMedia/api/Post';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<any> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostsByUser(userId: string): Observable<any> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`);
  }

  createPost(post: Post): Observable<any> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(postId: string, post: Post): Observable<any> {
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, post);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }
}
