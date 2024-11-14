import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Book as BookIcon } from 'lucide-react';
import { api } from '../services/api';
import { Book, Review } from '../types';
import BookFormatBadge from '../components/BookFormatBadge';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [userBookStatus, setUserBookStatus] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [format, setFormat] = useState('paperback');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchBookAndStatus = async () => {
      try {
        const [bookData, reviewsData, userBooksData] = await Promise.all([
          api.getBookById(Number(id)),
          api.getBookReviews(Number(id)),
          api.getUserBooks()
        ]);
        setBook(bookData);
        setReviews(reviewsData);
        
        // Find if user has this book in their list
        const userBook = userBooksData.find(ub => ub.bookId === Number(id));
        if (userBook) {
          setUserBookStatus(userBook.status);
          setFormat(userBook.format);
        }
      } catch (error) {
        console.error('Failed to fetch book data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookAndStatus();
    }
  }, [id]);

  const handleAddToList = async (status: string) => {
    if (!id || !book) return;
    
    try {
      await api.addUserBook({
        bookId: Number(id),
        status,
        format
      });
      setUserBookStatus(status);
      // Optionally refresh the page or show a success message
    } catch (error) {
      console.error('Failed to add book to list:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSubmitting(true);
    try {
      await api.addReview({
        bookId: Number(id),
        rating,
        comment,
        format
      });

      // If user submits a review without adding to any list, add to completed
      if (!userBookStatus) {
        await handleAddToList('Completed');
      }

      // Refresh book details and reviews
      const [updatedBook, updatedReviews] = await Promise.all([
        api.getBookById(Number(id)),
        api.getBookReviews(Number(id))
      ]);
      setBook(updatedBook);
      setReviews(updatedReviews);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      {/* Book Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{book.author}</p>
        <div className="flex items-center space-x-2 mb-6">
          <Star className="h-6 w-6 text-yellow-400 fill-current" />
          <span className="text-xl font-semibold">{book.averageRating?.toFixed(1) || 'No ratings'}</span>
          <span className="text-gray-500">({book.reviewCount} reviews)</span>
        </div>
        {book.description && (
          <p className="mt-4 text-gray-700">{book.description}</p>
        )}
      </div>

      {/* Reading Status Buttons */}
      <div className="border-t border-b py-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add to My Books</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleAddToList('Currently Reading')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              userBookStatus === 'Currently Reading'
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-800'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <BookIcon className="h-5 w-5" />
            <span>Currently Reading</span>
          </button>
          <button
            onClick={() => handleAddToList('Want to Read')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              userBookStatus === 'Want to Read'
                ? 'bg-green-100 text-green-800 border-2 border-green-800'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <BookIcon className="h-5 w-5" />
            <span>Want to Read</span>
          </button>
          <button
            onClick={() => handleAddToList('Completed')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              userBookStatus === 'Completed'
                ? 'bg-purple-100 text-purple-800 border-2 border-purple-800'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <BookIcon className="h-5 w-5" />
            <span>Completed</span>
          </button>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="paperback">Paperback</option>
            <option value="hardcover">Hardcover</option>
            <option value="kindle">Kindle</option>
            <option value="ebook">E-book</option>
            <option value="audiobook">Audiobook</option>
          </select>
        </div>
      </div>

      {/* Review Form */}
      <div className="border-b pb-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Write a Review</h2>
        <form onSubmit={handleSubmitReview} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    rating >= value ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.reviewId} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`h-5 w-5 ${
                            value <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">{review.userName}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <BookFormatBadge
                    format={review.format}
                    className="bg-blue-100 text-blue-800"
                  />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;