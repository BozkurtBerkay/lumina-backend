import { Request, Response } from "express";
import { UserService } from "../../application/services/UserService";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error: any) {
      const status = error.message === "User not found" ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const user = await this.userService.updateUser(id, req.body);
      res.status(200).json(user);
    } catch (error: any) {
      const status = error.message === "User not found" ? 404 : 400;
      res.status(status).json({ message: error.message });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.userService.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      const status = error.message === "User not found" ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  };
}
