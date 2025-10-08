export type Address = {
  line1: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
};

export type Property = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  propertyType?: "house" | "apartment" | "condo" | "land" | "other";
  listed?: boolean;
  // coverImage is not in backend schema; derive from images[0]
  images?: string[];
  address: Address;
  createdAt?: string;
  updatedAt?: string;
};
