import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, PlusCircle, Search, BookOpen, Library } from 'lucide-react';
import { api } from '../services/api';
import { Book as BookType } from '../types';

const BookList = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.getBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Search and Add Book */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <Library className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Discover Books</h1>
            <p className="text-gray-600 text-sm mt-1">Explore new stories and share your thoughts</p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-4">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => navigate('/add-book')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or add a new book</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Link
              key={book.bookId}
              to={`/book/${book.bookId}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {book.title}
                </h2>
                <p className="text-gray-600 mb-4">{book.author}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className={`h-5 w-5 ${book.averageRating > 0 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    <span className="text-gray-700 font-medium">
                      {book.averageRating?.toFixed(1) || 'No ratings'}
                    </span>
                    {book.reviewCount > 0 && (
                      <span className="text-gray-500 text-sm">
                        ({book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'Unknown'}</span>
                  {book.isbn && <span>ISBN: {book.isbn}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;