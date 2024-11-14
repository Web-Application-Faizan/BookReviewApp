export interface User {
  userId: number;
  email: string;
  name: string;
  bio?: string;
  location?: string;
  favGenre?: string;
  favoriteQuote?: string;
  readingGoal?: number;
  createdAt?: string;
}

export interface Review {
  reviewId: number;  // Changed from id
  bookId: number;
  userId: number;    // Changed from string to number
  userName: string;  // Added to match backend
  rating: number;
  comment: string;
  format: 'kindle' | 'ebook' | 'paperback' | 'hardcover' | 'audiobook';
  createdAt: string;
  book?: Book;      // Added to match backend
}

export interface Book {
  bookId: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  publishedDate?: string;
  averageRating: number;
  reviewCount: number;
}

export interface UserBook {
  userBookId: number;  // Changed from id
  bookId: number;
  userId: number;      // Changed from string to number
  status: 'Currently Reading' | 'Completed' | 'Want to Read';  // Updated to match backend
  format: 'kindle' | 'ebook' | 'paperback' | 'hardcover' | 'audiobook';
  addedAt: string;
  title: string;      // Added to match backend
  author: string;     // Added to match backend
}