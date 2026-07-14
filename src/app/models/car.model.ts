/**
 * Car Model
 * Represents a car listing in the car community platform
 */
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  description: string;
  image: string;
  owner: string;
  ownerId: string;
  ownerImage: string;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  reviews: string[];
  featured?: boolean;
}
