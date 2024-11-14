const BASE_URL = 'http://localhost:5182/api';

const headers = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token')
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {}),
});

export const api = {
  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return { token: data.token, user: data };
  },

  async register(userData: { email: string; password: string; name: string }) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  },

  async getBooks() {
    const response = await fetch(`${BASE_URL}/books`, {
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  },

  async getBookById(id: number) {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }

    return await response.json();
  },

  async addReview(review: { bookId: number; rating: number; comment: string; format: string }) {
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      throw new Error('Failed to add review');
    }

    return await response.json();
  },

  async getUserProfile() {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;
    const response = await fetch(`${BASE_URL}/user/profile/${userId}`, {
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  },

  async getUserReviews() {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;
    const response = await fetch(`${BASE_URL}/reviews/user/${userId}`, {
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return await response.json();
  },

  async getUserBooks() {
    const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;
    const response = await fetch(`${BASE_URL}/user/${userId}/books`, {
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user books');
    }

    return await response.json();
  },

  async updateUserProfile(data: Partial<User>) {
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
  },

  async updateBookStatus(bookId: number, status: string, format: string) {
    const response = await fetch(`${BASE_URL}/user/books/${bookId}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ status, format }),
    });

    if (!response.ok) {
      throw new Error('Failed to update book status');
    }

    return await response.json();
  },

  async getBookReviews(bookId: number) {
    const response = await fetch(`${BASE_URL}/reviews/book/${bookId}`, {
      headers: headers(),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch book reviews');
    }
  
    return await response.json();
  },

  async updateReview(reviewId: number, data: { rating: number; comment: string; format: string }) {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update review');
    }
  
    return await response.json();
  },

  async addBook(bookData: {
    title: string;
    author: string;
    isbn?: string;
    description?: string;
    coverUrl?: string;
    publishedDate: string;
  }) {
    const response = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(bookData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
  
    return await response.json();
  },

  async addUserBook(data: { bookId: number; status: string; format: string }) {
    const response = await fetch(`${BASE_URL}/user/books`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      throw new Error('Failed to add book to list');
    }
  
    return await response.json();
  }
};