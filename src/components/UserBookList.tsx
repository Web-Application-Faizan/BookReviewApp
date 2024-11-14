import React from 'react';
import { Book } from '../types';
import BookFormatBadge from './BookFormatBadge';

interface UserBookListProps {
  books: any[];
  title: string;
}

const UserBookList: React.FC<UserBookListProps> = ({ books, title }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((book) => (
          <div key={book.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{book.title}</h4>
                <p className="text-sm text-gray-600">{book.author}</p>
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
    </div>
  );
};

export default UserBookList;