export interface AccessToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateAccessTokenDTO {
  token: string;
  userId: string;
  expiresAt: Date;
}
