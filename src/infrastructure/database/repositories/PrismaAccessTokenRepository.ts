import { AccessToken, CreateAccessTokenDTO } from "../../../domain/entities/AccessToken";
import { IAccessTokenRepository } from "../../../domain/repositories/IAccessTokenRepository";

export class PrismaAccessTokenRepository implements IAccessTokenRepository {
  constructor(private readonly prisma: any) {}

  async findByToken(token: string): Promise<AccessToken | null> {
    return this.prisma.accessToken.findUnique({
      where: { token },
    });
  }

  async create(data: CreateAccessTokenDTO): Promise<AccessToken> {
    return this.prisma.accessToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.prisma.accessToken.delete({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.accessToken.deleteMany({
      where: { userId },
    });
  }
}
