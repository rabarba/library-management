import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json([{ id: 1, name: 'John Doe' }]);
};