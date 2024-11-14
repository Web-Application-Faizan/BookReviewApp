import React, { useState, useEffect } from 'react';
import { Star, Pencil } from 'lucide-react';
import { api } from '../services/api';
import { Review } from '../types';
import BookFormatBadge from '../components/BookFormatBadge';

const MyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    rating: 0,
    comment: '',
    format: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await api.getUserReviews();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (reviewId: number) => {
    try {
      await api.updateReview(reviewId, editData);
      await fetchReviews();
      setEditingReview(null);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review.reviewId);
    setEditData({
      rating: review.rating,
      comment: review.comment,
      format: review.format
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          You haven't written any reviews yet.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.reviewId} className="bg-white rounded-lg shadow-md p-6">
              {editingReview === review.reviewId ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setEditData({ ...editData, rating: value })}
                          className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            editData.rating >= value ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Format</label>
                    <select
                      value={editData.format}
                      onChange={(e) => setEditData({ ...editData, format: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="paperback">Paperback</option>
                      <option value="hardcover">Hardcover</option>
                      <option value="kindle">Kindle</option>
                      <option value="ebook">E-book</option>
                      <option value="audiobook">Audiobook</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={editData.comment}
                      onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateReview(review.reviewId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {review.book?.title}
                      </h3>
                      <p className="text-gray-600">{review.book?.author}</p>
                    </div>
                    <button
                      onClick={() => startEditing(review)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
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
                    <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <BookFormatBadge
                      format={review.format}
                      className="bg-blue-100 text-blue-800"
                    />
                  </div>
                  
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;