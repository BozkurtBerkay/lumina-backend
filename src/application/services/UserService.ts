import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, CreateUserDTO, UpdateUserDTO } from "../../domain/entities/User";
import { SecurityService } from "./SecurityService";

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly securityService: SecurityService
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.securityService.hashPassword(data.passwordHash);

    return this.userRepository.create({
      ...data,
      passwordHash: hashedPassword,
    });
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    await this.getUserById(id);
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already in use by another user");
      }
    }

    if (data.passwordHash) {
      data.passwordHash = await this.securityService.hashPassword(data.passwordHash);
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.getUserById(id);
    await this.userRepository.delete(id);
  }
}
