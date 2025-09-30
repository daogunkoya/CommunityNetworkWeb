export enum AuthType {
  EMAIL = 1,
  GOOGLE = 2,
  FACEBOOK = 3,
  APPLE = 4,
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  location: string;
  gender?: string;
  date_of_birth?: string;
  phone?: string;
  bio?: string;
  interests?: string[];
  skill_level?: string;
}

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string;
  auth_provider?: string;
  auth_provider_id?: string;
  profile_picture?: string;
  is_active?: boolean;
}

export interface AuthToken {
  accessTokenId: string;
  tokenType: string;
  expiresIn: number;
  accessToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: AuthToken;
  message: string;
  requires_verification?: boolean;
}

export interface SocialAuthData {
  provider: 'facebook' | 'google' | 'apple';
  provider_id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  access_token: string;
}
