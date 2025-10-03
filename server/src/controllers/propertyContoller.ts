import { Agent } from './../models/Agent';
import { Request, Response } from 'express';
import { Property } from '../models/Property';

export const createProperty = async (req: Request, res: Response) => {
  try {
    // Minimal input sanity check; rely on Mongoose required fields as well
    const {
      title,
      price,
      address,
      bedrooms,
      bathrooms,
      description,
      sqft,
      images,
      listedAt,
      isActive,
      agent,
    } = req.body ?? {};

    if (!title || typeof price !== 'number' || !address?.line1 || !address?.city || !address?.country) {
      return res.status(400).json({ error: 'Missing required fields: title, price, address.line1, address.city, address.country' });
    }

    if (typeof bedrooms !== 'number' || typeof bathrooms !== 'number') {
      return res.status(400).json({ error: 'bedrooms and bathrooms must be numbers' });
    }

    const doc = await Property.create({
      title,
      description,
      price,
      address,
      bedrooms,
      bathrooms,
      sqft,
      images,
      listedAt,
      isActive,
      agent
    });

    return res.status(201).json({ message: 'Property created', property: doc });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('createProperty error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }


};

  export const getPropertyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      const property = await Property.findById(id).populate('agent','firstName lastName email');
    
      if (!property) {
        return res.status(404).json({ error: 'property not found' });
      }
  
      return res.json({ property });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  };
