import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from 'src/DTOs/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost/SocialMedia/api/Comment';

  constructor(private http: HttpClient) {}

  getCommentsByPostId(postId: string): Observable<any> {
    return this.http.get<Comment[]>(`${this.apiUrl}/post/${postId}`);
  }

  addComment(comment: Comment): Observable<any> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }
}
