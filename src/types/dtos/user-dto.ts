/**
 * Represents a user model returned from the API
 */
interface UserDto {
  _id: string;
  business_role?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  login_tokens: Array<{ last_used: number; token: string }>;
  organization: string;
  password: string;
  password_reset_token?: string;
  password_reset_token_expiry?: number;
  token?: string;
}

export type { UserDto };
