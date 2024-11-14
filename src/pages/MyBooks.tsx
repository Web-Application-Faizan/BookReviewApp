import React, { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import { api } from '../services/api';
import { UserBook } from '../types';

const MyBooks = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBooks();
  }, []);

  const fetchUserBooks = async () => {
    try {
      const data = await api.getUserBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookId: number, status: string, format: string) => {
    try {
      await api.updateBookStatus(bookId, status, format);
      await fetchUserBooks(); // Refresh the list
    } catch (err) {
      setError('Failed to update book status');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedBooks = {
    reading: filteredBooks.filter(b => b.status === 'Currently Reading'),
    wantToRead: filteredBooks.filter(b => b.status === 'Want to Read'),
    completed: filteredBooks.filter(b => b.status === 'Completed')
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Books</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {Object.entries({
          'Currently Reading': groupedBooks.reading,
          'Want to Read': groupedBooks.wantToRead,
          'Completed': groupedBooks.completed
        }).map(([status, books]) => (
          <div key={status}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{status}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.bookId} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
                      <p className="text-gray-600 mb-4">{book.author}</p>
                      <div className="space-y-2">
                        <select
                          value={book.status}
                          onChange={(e) => handleStatusUpdate(book.bookId, e.target.value, book.format)}
                          className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Currently Reading">Currently Reading</option>
                          <option value="Want to Read">Want to Read</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <select
                          value={book.format}
                          onChange={(e) => handleStatusUpdate(book.bookId, book.status, e.target.value)}
                          className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="paperback">Paperback</option>
                          <option value="hardcover">Hardcover</option>
                          <option value="kindle">Kindle</option>
                          <option value="ebook">E-book</option>
                          <option value="audiobook">Audiobook</option>
                        </select>
                      </div>
                    </div>
                    <Book className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooks;