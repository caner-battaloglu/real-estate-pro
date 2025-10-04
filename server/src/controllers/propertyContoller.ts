import { Agent } from "./../models/Agent";
import { Request, Response } from "express";
import { Property } from "../models/Property";
import { isNumberObject } from "util/types";
import mongoose from 'mongoose';

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

    if (
      !title ||
      typeof price !== "number" ||
      !address?.line1 ||
      !address?.city ||
      !address?.country
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: title, price, address.line1, address.city, address.country",
      });
    }

    if (typeof bedrooms !== "number" || typeof bathrooms !== "number") {
      return res
        .status(400)
        .json({ error: "bedrooms and bathrooms must be numbers" });
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
      agent,
    });

    return res.status(201).json({ message: "Property created", property: doc });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("createProperty error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listProperties = async (req: Request, res: Response) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      isActive,
      page = "1",
      limit = "10",
      sort = "-createdAt",
    } = req.query as Record<string, string | undefined>;

    // --- helpers ---
    const toNum = (v?: string) => {
      if (v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const pageNum = Math.max(1, toNum(page) ?? 1);
    const limitNum = Math.min(100, Math.max(1, toNum(limit) ?? 10));
    const skip = (pageNum - 1) * limitNum;

    // --- build filter ---
    const filter: any = {};

    if (city) filter["address.city"] = city;

    if (isActive === "true" || isActive === "false") {
      filter.isActive = isActive === "true";
    }

    const priceMin = toNum(minPrice);
    const priceMax = toNum(maxPrice);
    if (
      priceMin !== undefined &&
      priceMax !== undefined &&
      priceMin > priceMax
    ) {
      return res
        .status(400)
        .json({ error: "minPrice cannot be greater than maxPrice" });
    }
    const price: any = {};
    if (priceMin !== undefined) price.$gte = priceMin;
    if (priceMax !== undefined) price.$lte = priceMax;
    if (Object.keys(price).length) filter.price = price;

    const minBeds = toNum(bedrooms);
    if (minBeds !== undefined) filter.bedrooms = { $gte: minBeds };

    const minBaths = toNum(bathrooms);
    if (minBaths !== undefined) filter.bathrooms = { $gte: minBaths };

    // --- sort whitelist ---
    const allowedSort = new Set([
      "createdAt",
      "-createdAt",
      "price",
      "-price",
      "bedrooms",
      "-bedrooms",
      "bathrooms",
      "-bathrooms",
      "listedAt",
      "-listedAt",
    ]);
    const sortField = allowedSort.has(String(sort))
      ? String(sort)
      : "-createdAt";

    // --- query + count ---
    const [data, total] = await Promise.all([
      Property.find(filter)
        .populate("agent", "firstName lastName email")
        .sort(sortField)
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(filter),
    ]);

    return res.json({ data, page: pageNum, limit: limitNum, total });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("listProperties error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).populate(
      "agent",
      "firstName lastName email"
    );

    if (!property) {
      return res.status(404).json({ error: "property not found" });
    }

    return res.json({ property });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  // 1) id
  const { id } = req.params;

  // 2) validate id
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid property id' });
  }

  // 3) whitelist fields to update
  const allowed = new Set([
    'title','description','price',
    'address','bedrooms','bathrooms','sqft',
    'images','listedAt','isActive','agent'
  ]);

  const update: any = {};
  for (const [k, v] of Object.entries(req.body ?? {})) {
    if (allowed.has(k)) update[k] = v;
  }

  // optional: if agent present, validate its form (ObjectId)
  // optional: if address present, allow partial nested update (see Stage C)

  if (update.address && typeof update.address === 'object') {
  const addr = update.address;
  delete update.address;

  for (const [k, v] of Object.entries(addr)) {
    // only map known keys to avoid junk
    if (['line1', 'line2', 'city', 'state', 'country', 'postalCode'].includes(k)) {
      update[`address.${k}`] = v;
    }
  }
}

  // 4) update with validators
  const doc = await Property.findByIdAndUpdate(id,  {$set: update}, {
    new: true,
    runValidators: true,context: 'query'
  }).populate('agent', 'firstName lastName email');

  if (!doc) return res.status(404).json({ error: 'Property not found' });

  // 5) return
  return res.json({ property: doc });
};
