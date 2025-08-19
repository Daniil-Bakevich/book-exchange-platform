export interface CreateUser {
  name: string;
  email: string;
  avatar: string;
  registrationDate: string;
  hashedPassword: string;
}

export interface User extends CreateUser {
  id: string;
}
