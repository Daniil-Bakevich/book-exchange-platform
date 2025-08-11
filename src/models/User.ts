export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  registrationDate: string;
  hashedPassword: string;
}

export interface CreateUser {
  name: string;
  email: string;
  avatar: string;
  registrationDate: string;
  hashedPassword: string;
}