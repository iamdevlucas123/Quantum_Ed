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

const BIO_MAX_LENGTH = 280;
const AVATAR_URL_MAX_LENGTH = 120_000;
const AVATAR_DATA_URL_PATTERN = /^data:image\/(png|jpeg|jpg|webp|gif);base64,/;

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

  async updateCurrentUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      const { bio, avatarUrl } = req.body as {
        bio?: unknown;
        avatarUrl?: unknown;
      };

      if (typeof bio !== 'undefined' && bio !== null && typeof bio !== 'string') {
        res.status(400).json({ message: 'bio must be a string' });
        return;
      }

      if (typeof avatarUrl !== 'undefined' && avatarUrl !== null && typeof avatarUrl !== 'string') {
        res.status(400).json({ message: 'avatarUrl must be a string' });
        return;
      }

      const trimmedBio = typeof bio === 'string' ? bio.trim() : bio;

      if (typeof trimmedBio === 'string' && trimmedBio.length > BIO_MAX_LENGTH) {
        res.status(400).json({ message: `bio must be ${BIO_MAX_LENGTH} characters or fewer` });
        return;
      }

      if (typeof avatarUrl === 'string') {
        if (avatarUrl.length > AVATAR_URL_MAX_LENGTH) {
          res.status(400).json({ message: 'avatarUrl is too large' });
          return;
        }

        if (avatarUrl !== '' && !AVATAR_DATA_URL_PATTERN.test(avatarUrl)) {
          res.status(400).json({ message: 'avatarUrl must be an image data URL' });
          return;
        }
      }

      const user = await userService.updateProfile(userId, {
        bio: typeof trimmedBio === 'string' ? trimmedBio : trimmedBio ?? undefined,
        avatarUrl: typeof avatarUrl === 'string' ? avatarUrl : avatarUrl ?? undefined,
      });

      res.status(200).json(sanitizeUser(user));
    } catch {
      res.status(500).json({ message: 'Error updating profile' });
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
