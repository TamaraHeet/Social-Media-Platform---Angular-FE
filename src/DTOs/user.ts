export class User {
  id!: string; // Optional property (corresponding to public string? Id in C#)
  userName!: string; // Required property (corresponding to public string userName in C#)
  firstName!: string; // Required property
  lastName!: string; // Required property
  dob!: string; // You can use string or Date (string here for simplicity)
  gender!: string; // Required property
  profileImage!: string; // Optional property
  coverImage!: string;
}
