import { User } from './user';

export class Post {
  postId!: string;
  createdAt!: Date;
  contentText!: string;
  contentImage!: string;
  userId!: string;
  user!: User;
}
