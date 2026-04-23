import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IAccessTokenRepository } from "../../domain/repositories/IAccessTokenRepository";
import { SecurityService } from "./SecurityService";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly accessTokenRepository: IAccessTokenRepository,
    private readonly securityService: SecurityService
  ) {}

  async login(email: string, passwordHash: string): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await this.securityService.comparePassword(
      passwordHash,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const { token, expiresAt } = this.securityService.generateToken({
      userId: user.id,
      role: user.role,
    });

    // Token'ı DB'ye kaydet
    await this.accessTokenRepository.create({
      token,
      userId: user.id,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }
}
