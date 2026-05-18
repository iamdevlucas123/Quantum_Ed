import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { userService } from '../services/user_service';

// Its pull the variable passwordHash out of the user and pack everything else into safeUser
// Distruturing with the rest Syntax (Verify if this is really safe)
const sanitizeUser = (user:User) => {
  const {passwordHash, ...safeUser} = user;
  return safeUser
}
//This handle the inconsistent URL query parameters type
const getParam = (value: string | string[]): string => {
  return Array.isArray(value) ? value[0] : value;
};

export const userController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, passwordHash, role, localStorageKey } = req.body;
      if (!email || !passwordHash) {
        res.status(400).json({ message: 'email and passwordHash are required' });
        return;
      }
      const user = await userService.create({
        name,
        email,
        passwordHash,
        role,
        localStorageKey,
      });
      res.status(201).json(sanitizeUser(user));
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  },

  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAll();
      res.status(200).json(users.map(sanitizeUser));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  },
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = getParam(req.params.id);
      const user = await userService.findById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(sanitizeUser(user));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  },
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = getParam(req.params.id);
      const { name, email, passwordHash, role, localStorageKey } = req.body;
      const user = await userService.update(id, {
        name,
        email,
        passwordHash,
        role,
        localStorageKey,
      });
      res.status(200).json(sanitizeUser(user));
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  },
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = getParam(req.params.id);
      await userService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  },
};
