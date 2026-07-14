/**
 * User Model
 * Represents a user in the car community platform
 */
export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  profileImage: string;
  bio: string;
  carsOwned: number;
  postsCount: number;
  eventsAttended: number;
  joinDate: Date;
  isVerified: boolean;
  rating: number;
  followers?: number;
  following?: number;
}
