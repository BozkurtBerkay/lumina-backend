import { AccessToken, CreateAccessTokenDTO } from "../entities/AccessToken";

export interface IAccessTokenRepository {
  findByToken(token: string): Promise<AccessToken | null>;
  create(data: CreateAccessTokenDTO): Promise<AccessToken>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
