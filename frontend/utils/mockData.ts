import { User, UserRole } from '@/types/auth';

export function createMockUser(phone: string, role: UserRole = 'user'): User {
  const id = `user_${Math.random().toString(36).substr(2, 9)}`;
  const name = `User ${phone.slice(-4)}`; // Use last 4 digits of phone as part of the name
  const email = `user${phone}@example.com`;
  
  // Base user object
  const user: User = {
    id,
    name,
    email,
    phone,
    role,
    verified: true,
    isProfileComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add role-specific fields
  if (role === 'owner') {
    user.restaurantName = `${name}'s Restaurant`;
    user.address = '123 Main St, Addis Ababa, Ethiopia';
    user.website = 'https://example.com';
  }

  // Add some mock data for the user
  user.avatar = `https://i.pravatar.cc/150?u=${id}`;
  user.bio = 'Food enthusiast and recipe collector';
  user.location = 'Addis Ababa, Ethiopia';
  user.followers = Math.floor(Math.random() * 1000);
  user.following = Math.floor(Math.random() * 500);
  user.recipes = Math.floor(Math.random() * 50);
  user.reviews = Math.floor(Math.random() * 100);
  
  // Add preferences
  user.preferences = {
    darkMode: true,
    notifications: {
      orders: true,
      promotions: true,
      messages: true,
    },
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
    favoriteCategories: ['Ethiopian', 'Breakfast', 'Desserts']
  };

  return user;
}

// You can add more mock data generators here if needed
