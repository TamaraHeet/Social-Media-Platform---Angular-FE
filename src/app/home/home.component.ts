import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from 'src/DTOs/post';
import { Comment } from 'src/DTOs/comment';
import { CommentService } from '../services/comment.service';
import { LikeService } from '../services/like.service';
import { Like } from 'src/DTOs/like';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  createPostForm: FormGroup;

  postComments: { [postId: string]: Comment[] } = {};
  commentsVisible: { [postId: string]: boolean } = {};
  likeCounts: { [postId: string]: number } = {};
  likedPosts: { [postId: string]: boolean } = {};

  loggedInUser: any;
  commentForm: any;

  imagePreview: string | ArrayBuffer | null = '';
  selectedImage: string | null = null;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private likeService: LikeService,
    private fb: FormBuilder
  ) {
    this.createPostForm = this.fb.group({
      contentText: ['', Validators.required],
      contentImage: [''],
    });
    this.commentForm = this.fb.group({
      contentText: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userInfo = localStorage.getItem('EssenseUserInfo');
    if (userInfo) {
      this.loggedInUser = JSON.parse(userInfo);
      console.log('Logged-in user data:', this.loggedInUser);
    } else {
      console.log('User not logged in');
    }

    this.getPosts();
  }

  getPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        for (let post of this.posts) {
          this.loadCommentsForPosts(post.postId);
          this.loadLikeCountsForPosts(post);
          this.checkUserLikeStatus(post);
        }
      },
    });
  }

  loadCommentsForPosts(id: string): void {
    this.commentService.getCommentsByPostId(id).subscribe({
      next: (comm) => {
        this.postComments[id] = comm;
      },
    });
  }

  x(id: string) {
    this.loadCommentsForPosts(id);
    this.toggleComments(id);
  }

  loadLikeCountsForPosts(post: Post): void {
    this.likeService.countLikesByPostId(post.postId).subscribe({
      next: (count: number) => {
        this.likeCounts[post.postId] = count;
      },
    });
  }
  checkUserLikeStatus(post: Post): void {
    this.likeService.getLikesByPostId(post.postId).subscribe({
      next: (likes: Like[]) => {
        const userLiked = likes.some(
          (like) => like.userId === this.loggedInUser?.id
        );
        this.likedPosts[post.postId] = userLiked;
      },
      error: (err) => {
        console.error('Error fetching likes for post:', err);
      },
    });
  }

  toggleComments(postId: string): void {
    this.commentsVisible[postId] = !this.commentsVisible[postId];
  }

  onFileSelected(event: any): void {
    debugger;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.selectedImage = this.imagePreview as string;
      };
    }
  }

  createPost(): void {
    debugger;
    if (this.createPostForm.valid) {
      const newPost = new Post();
      newPost.contentText = this.createPostForm.value.contentText;
      newPost.contentImage = this.selectedImage || '';
      newPost.createdAt = new Date();
      newPost.userId = this.loggedInUser?.id;

      if (!newPost.userId) {
        console.error('User ID is missing or undefined');
        return;
      }

      console.log('Creating post for user:', this.loggedInUser);
      this.postService.createPost(newPost).subscribe({
        next: (createdPost: Post) => {
          console.log('Post created successfully', createdPost);
          this.posts.push(createdPost);
          this.createPostForm.reset();
          this.imagePreview = '';
          this.selectedImage = null;
        },
        error: (err) => {
          console.error('Error creating post', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  deletePost(postId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(postId).subscribe({
          next: () => {
            console.log('Post deleted successfully');
            this.posts = this.posts.filter((post) => post.postId !== postId);
            Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting post:', err);
            Swal.fire(
              'Error',
              'There was an error deleting your post.',
              'error'
            );
          },
        });
      } else {
        console.log('Post deletion canceled');
      }
    });
  }

  toggleLike(postId: string): void {
    const userLiked = this.likedPosts[postId];

    if (userLiked) {
      this.removeLike(postId);
    } else {
      this.addLike(postId);
    }
  }
  addLike(postId: string): void {
    const like = new Like();
    like.postId = postId;
    like.userId = this.loggedInUser?.id;

    this.likeService.addLike(like).subscribe({
      next: () => {
        this.likedPosts[postId] = true;
        this.likeCounts[postId]++;
      },
      error: (err) => {
        console.error('Error adding like:', err);
      },
    });
  }

  removeLike(postId: string): void {
    const like = new Like();
    like.postId = postId;
    like.userId = this.loggedInUser?.id;

    this.likeService.getLikesByPostId(postId).subscribe({
      next: (likes: Like[]) => {
        const likeToRemove = likes.find(
          (like) => like.userId === this.loggedInUser?.id
        );
        if (likeToRemove) {
          this.likeService.removeLike(likeToRemove.likeId).subscribe({
            next: () => {
              this.likedPosts[postId] = false;
              this.likeCounts[postId]--;
            },
            error: (err) => {
              console.error('Error removing like:', err);
            },
          });
        }
      },
    });
  }

  createComment(postId: string): void {
    if (this.commentForm.valid) {
      const newComment = new Comment();
      newComment.content = this.commentForm.value.contentText;
      newComment.userId = this.loggedInUser?.id;
      newComment.postId = postId;

      if (!newComment.userId) {
        console.error('User ID is missing or undefined');
        return;
      }

      this.commentService.addComment(newComment).subscribe({
        next: (createdComment: Comment) => {
          console.log('Comment created successfully', createdComment);

          this.loadCommentsForPosts(postId);
          this.commentForm.reset();
        },
        error: (err) => {
          console.error('Error creating comment', err);
        },
      });
    } else {
      console.log('Comment form is invalid');
    }
  }
}
