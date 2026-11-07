export interface AuthUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
}

export interface RegistrationData extends AuthUser {
  emailVerified: false
  verificationEmailSent: boolean
}

export interface AccessTokenData {
  accessToken: string
  /** Access token lifetime in seconds. */
  expiresIn: number
  user: AuthUser
}

export interface VerifyEmailData {
  emailVerified: true
  message: string
}

export interface AuthMessageData {
  message: string
}

export interface VerifyResetPasswordData {
  resetToken: string
}
