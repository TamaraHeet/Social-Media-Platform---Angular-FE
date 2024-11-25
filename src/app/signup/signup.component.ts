import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUp } from 'src/DTOs/signup';
import { SignUpService } from '../services/signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  profilePictureUrl: any = '';

  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkForm();
  }

  checkForm() {
    this.signUpForm = this.fb.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roleName: ['User'],
    });
  }
  onFileSelected(file: any) {
    debugger;
    let reader = new FileReader();
    reader.readAsDataURL(file.target.files[0]);
    reader.onload = (_event) => {
      this.profilePictureUrl = reader.result;
    };
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const signUpData: SignUp = this.signUpForm.value;
      signUpData.profileImage = this.profilePictureUrl;

      this.signUpService.signUp(signUpData).subscribe({
        next: (data) => {
          console.log('User created successfully', data);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error during signup:', error);
        },
      });
    } else {
      console.error('Form is not valid');
    }
  }
}
