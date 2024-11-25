import { User } from './user';

export class Comment {
  commentId!: string;
  content!: string;
  userId!: string;
  postId!: string;
  user!: User;
}
