export interface IUser {
  UserId: Number
  userName: String
  password: String
  email: String
  IsAdmin: Number
  user: {
    userName: string
    IsAdmin: number
  }
}

export interface IUserAuth {
  email: string
  password: string
}

export interface IChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
