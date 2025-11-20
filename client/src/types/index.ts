export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'villa' | 'commercial'
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  address: {
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode?: string
    country: string
  }
  location: string
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  agent: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  features: string[]
  amenities: string[]
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  specialties: string[]
  experience: number
  rating: number
  propertiesSold: number
  isActive: boolean
  marketCountry?: "USA" | "UK" | "Turkey"
  socialMedia?: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
}

export interface SearchFilters {
  type?: string[]
  priceRange?: [number, number]
  bedrooms?: number
  bathrooms?: number
  area?: [number, number]
  location?: string
  features?: string[]
  amenities?: string[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}



