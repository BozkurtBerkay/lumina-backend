import { Request, Response } from "express";
import { AuthService } from "../../application/services/AuthService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.message === "Invalid email or password" ? 401 : 500;
      res.status(status).json({ message: error.message });
    }
  };
}
