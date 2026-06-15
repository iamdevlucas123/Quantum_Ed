import { Request, Response } from 'express';
import { publicStatsService } from '../services/public_stats_service';

export const publicController = {
  getStats(_req: Request, res: Response): void {
    res.status(200).json({
      developerCount: publicStatsService.getDeveloperCount(),
    });
  },
};
