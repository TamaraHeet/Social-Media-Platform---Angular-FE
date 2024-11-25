import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { LikeService } from '../services/like.service';
import { Post } from 'src/DTOs/post';
import { Comment } from 'src/DTOs/comment';
import { Like } from 'src/DTOs/like';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ChangePasswordDTO } from 'src/DTOs/changePassword';
import { UpdateProfileImage } from 'src/DTOs/UpdateProfileImage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  loggedInUser: any;
  userProfile: any;
  userPosts: Post[] = [];
  postComments: { [postId: string]: Comment[] } = {};
  commentsVisible: { [postId: string]: boolean } = {};
  likeCounts: { [postId: string]: number } = {};
  likedPosts: { [postId: string]: boolean } = {};
  commentForm: FormGroup;
  changePasswordForm: FormGroup;
  isModalOpen: boolean = false;
  profilePictureUrl: any = '';

  constructor(
    private profileService: ProfileService,
    private postService: PostService,
    private commentService: CommentService,
    private likeService: LikeService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      contentText: ['', Validators.required],
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  ngOnInit(): void {
    const userInfo = localStorage.getItem('EssenseUserInfo');
    if (userInfo) {
      this.loggedInUser = JSON.parse(userInfo);
      console.log('Logged-in user data:', this.loggedInUser);

      this.loadUserProfile(this.loggedInUser.userName);
      this.getUserPosts();
    } else {
      console.log('No user is logged in');
    }
  }

  loadUserProfile(username: string): void {
    this.profileService.getUserInfo(username).subscribe({
      next: (data) => {
        this.userProfile = data;
        console.log('User profile fetched:', this.userProfile);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }

  onChangePassword(): void {
    debugger;
    if (this.changePasswordForm.invalid) return;

    const { oldPassword, newPassword, confirmPassword } =
      this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      Swal.fire('Error', 'New passwords do not match', 'error');
      return;
    }

    const changePasswordDTO = new ChangePasswordDTO();
    changePasswordDTO.currentPassword = oldPassword;
    changePasswordDTO.newPassword = newPassword;
    changePasswordDTO.confirmNewPassword = confirmPassword;

    this.profileService
      .changePassword(this.loggedInUser.userName, changePasswordDTO)
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Password changed successfully', 'success');
        },
        error: (err) => {
          console.error('Error changing password:', err);
          Swal.fire('Error', 'Failed to change password', 'error');
        },
      });
  }

  onFileSelected(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file.target.files[0]);
    reader.onload = (_event) => {
      this.profilePictureUrl = reader.result;
    };
  }

  onSubmit(): void {
    // debugger;
    if (this.profilePictureUrl) {
      const updatedProfile: UpdateProfileImage = {
        userName: this.loggedInUser.userName,
        profileImage: this.profilePictureUrl,
      };
      this.profileService.updateProfileImage(updatedProfile).subscribe({
        next: () => {
          // debugger;
          Swal.fire(
            'Success',
            'Profile image updated successfully!',
            'success'
          );
          this.loadUserProfile(this.loggedInUser.userName);
        },
        error: (err) => {
          console.error('Error updating profile image:', err);
          Swal.fire('Error', 'Failed to update profile image', 'error');
        },
      });
    }
  }

  getUserPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data: Post[]) => {
        this.userPosts = data.filter(
          (post) => post.userId === this.loggedInUser?.id
        );
        for (let post of this.userPosts) {
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
            this.userPosts = this.userPosts.filter(
              (post) => post.postId !== postId
            );
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
