import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class SecurityService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || "default_secret";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: object): { token: string; expiresAt: Date } {
    const token = jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
    const decoded = jwt.decode(token) as any;
    
    // JWT exp is in seconds, need to convert to milliseconds for Date
    const expiresAt = new Date(decoded.exp * 1000);
    
    return { token, expiresAt };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      return null;
    }
  }
}
