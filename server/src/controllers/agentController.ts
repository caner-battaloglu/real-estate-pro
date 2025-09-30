import { Request, Response } from 'express';
import { Agent } from '../models/Agent';

export const createAgent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, agency, licenseNumber, avatarUrl, role, isActive } = req.body ?? {};

    if (!firstName || !lastName|| !email ) {
      return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email' });
    }

    const doc = await Agent.create({
      firstName,
      lastName,
      email,
      phone,
      agency,
      licenseNumber,
      avatarUrl,
      role,
      isActive,
    });

    return res.status(201).json({ message: 'Agent created', agent: doc });
  } catch (err: any) {
    if (err?.code === 11000 && err?.keyPattern?.email) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    if (err?.code === 11000 && err?.keyPattern?.licenseNumber) {
      return res.status(409).json({ error: 'License number already exists' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAgentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    return res.json({ agent });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
