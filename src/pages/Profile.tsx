import React, { useEffect, useState } from 'react';
import { User, Review, UserBook } from '../types';
import { api } from '../services/api';
import { Pencil, Save, X, Book as BookIcon, BookOpen, Calendar } from 'lucide-react';
import BookFormatBadge from '../components/BookFormatBadge';

interface ProfileFormData {
  name: string;
  bio: string;
  location: string;
  favGenre: string;
  favoriteQuote: string;
  readingGoal: number;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    location: '',
    favGenre: '',
    favoriteQuote: '',
    readingGoal: 0
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userProfile, userReviews, userBooks] = await Promise.all([
          api.getUserProfile(),
          api.getUserReviews(),
          api.getUserBooks()
        ]);
        setUser(userProfile);
        setReviews(userReviews);
        setBooks(userBooks);
        setFormData({
          name: userProfile.name,
          bio: userProfile.bio || '',
          location: userProfile.location || '',
          favGenre: userProfile.favGenre || '',
          favoriteQuote: userProfile.favoriteQuote || '',
          readingGoal: userProfile.readingGoal || 12
        });
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // const handleSaveBio = async () => {
  //   if (!user) return;
  //   try {
  //     const updatedUser = await api.updateUserProfile({ ...user, bio: editedBio });
  //     setUser(updatedUser);
  //     setEditing(false);
  //   } catch (error) {
  //     console.error('Failed to update bio:', error);
  //   }
  // };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const updatedUser = await api.updateUserProfile({ 
        ...user,
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        favGenre: formData.favGenre,
        favoriteQuote: formData.favoriteQuote,
        readingGoal: formData.readingGoal
      });
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleStatusUpdate = async (bookId: number, status: string, format: string) => {
    try {
      await api.updateBookStatus(bookId, status, format);
      const updatedBooks = await api.getUserBooks();
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Failed to update book status:', error);
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

  const readingStats = {
    totalBooks: books.length,
    booksThisYear: books.filter(book => 
      new Date(book.addedAt).getFullYear() === new Date().getFullYear()
    ).length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
      : 'N/A',
    progressToGoal: ((books.filter(book => 
      new Date(book.addedAt).getFullYear() === new Date().getFullYear() &&
      book.status === 'Completed'
    ).length / (formData.readingGoal || 1)) * 100).toFixed(0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {editing ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center space-x-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Genre
                </label>
                <input
                  type="text"
                  value={formData.favGenre}
                  onChange={(e) => setFormData({ ...formData, favGenre: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Goal (books/year)
                </label>
                <input
                  type="number"
                  value={formData.readingGoal}
                  onChange={(e) => setFormData({ ...formData, readingGoal: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Quote
                </label>
                <input
                  type="text"
                  value={formData.favoriteQuote}
                  onChange={(e) => setFormData({ ...formData, favoriteQuote: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Your favorite book quote"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself and your reading interests"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-500">{user.email}</p>
                {formData.location && (
                  <p className="text-gray-600 mt-1">
                    📍 {formData.location}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-medium text-gray-700">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 mb-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold">Reading Stats</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Books Read: {readingStats.totalBooks}</p>
                  <p>Books This Year: {readingStats.booksThisYear}</p>
                  <p>Average Rating: {readingStats.averageRating}⭐</p>
                  <p>Yearly Goal Progress: {readingStats.progressToGoal}%</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-purple-800 mb-2">
                  <BookIcon className="h-5 w-5" />
                  <span className="font-semibold">Reading Preferences</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Favorite Genre: {formData.favGenre || 'Not specified'}</p>
                  <p>Reading Goal: {formData.readingGoal} books/year</p>
                  <p>Total Reviews: {reviews.length}</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Current Activity</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>Currently Reading: {groupedBooks.reading.length}</p>
                  <p>Want to Read: {groupedBooks.wantToRead.length}</p>
                  <p>Completed: {groupedBooks.completed.length}</p>
                </div>
              </div>
            </div>

            {formData.favoriteQuote && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 italic">"{formData.favoriteQuote}"</p>
              </div>
            )}

            {formData.bio && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                <p className="text-gray-600">{formData.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reading Status / My Books */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Books</h2>
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-8">
          {Object.entries({
            'Currently Reading': groupedBooks.reading,
            'Want to Read': groupedBooks.wantToRead,
            'Completed': groupedBooks.completed
          }).map(([status, books]) => (
            <div key={status}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{status}</h3>
              {books.length === 0 ? (
                <p className="text-gray-500 italic">No books in this category</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((book) => (
                    <div key={book.bookId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{book.title}</h4>
                          <p className="text-sm text-gray-600">{book.author}</p>
                          <div className="mt-2 space-y-2">
                            <select
                              value={book.status}
                              onChange={(e) => handleStatusUpdate(book.bookId, e.target.value, book.format)}
                              className="block w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Currently Reading">Currently Reading</option>
                              <option value="Want to Read">Want to Read</option>
                              <option value="Completed">Completed</option>
                            </select>
                            <select
                              value={book.format}
                              onChange={(e) => handleStatusUpdate(book.bookId, book.status, e.target.value)}
                              className="block w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="paperback">Paperback</option>
                              <option value="hardcover">Hardcover</option>
                              <option value="kindle">Kindle</option>
                              <option value="ebook">E-book</option>
                              <option value="audiobook">Audiobook</option>
                            </select>
                          </div>
                        </div>
                        <BookFormatBadge
                          format={book.format}
                          className="bg-blue-100 text-blue-800"
                        />
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Added: {new Date(book.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.reviewId} className="border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{review.book?.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-${
                            i < review.rating ? 'yellow' : 'gray'
                          }-400`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <BookFormatBadge
                  format={review.format}
                  className="bg-blue-100 text-blue-800"
                />
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;