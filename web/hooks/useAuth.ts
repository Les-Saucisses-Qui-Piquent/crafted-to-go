import { useState, useEffect } from 'react';

type UserRole = 'customer' | 'brewery' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      // To test different scenarios, modify or comment out this mockUser
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        // Change this role to test different scenarios:
        // 'customer' | 'brewery' | 'admin' | null
        role: 'null' as any
      };

      setUser(mockUser);
      // Uncomment next line to test unauthenticated state:
      // setUser(null);
      
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { 
    user, 
    isLoading,
    // Add these methods for later use:
    signOut: () => setUser(null),
    signIn: (userData: User) => setUser(userData)
  };
}