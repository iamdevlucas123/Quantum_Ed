import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { userService } from '../services/user_service';

const sanitizeUser = (user: User) => {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const getParam = (value: string | string[]): string => {
  return Array.isArray(value) ? value[0] : value;
};

const canReadUserResource = (req: Request, userId: string): boolean => {
  return req.user?.id === userId || req.user?.role === 'ADMIN';
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
    } catch {
      res.status(500).json({ message: 'Error creating user' });
    }
  },

  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAll();
      res.status(200).json(users.map(sanitizeUser));
    } catch {
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = getParam(req.params.id);

      if (!canReadUserResource(req, id)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const user = await userService.findById(id);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(sanitizeUser(user));
    } catch {
      res.status(500).json({ message: 'Error fetching user' });
    }
  },

  async findProgressByUserId(req: Request, res: Response): Promise<void> {
    try {
      const id = getParam(req.params.id);

      if (!canReadUserResource(req, id)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const progresses = await userService.findProgressByUserId(id);
      res.status(200).json(progresses);
    } catch {
      res.status(500).json({ message: 'Error fetching user progress' });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = getParam(req.params.id);

      if (!canReadUserResource(req, id)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      const { name, email, passwordHash, role, localStorageKey } = req.body;
      const user = await userService.update(id, {
        name,
        email,
        passwordHash,
        role,
        localStorageKey,
      });

      res.status(200).json(sanitizeUser(user));
    } catch {
      res.status(500).json({ message: 'Error updating user' });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = getParam(req.params.id);

      if (!canReadUserResource(req, id)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      await userService.delete(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: 'Error deleting user' });
    }
  },
};
