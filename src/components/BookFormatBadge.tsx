import React from 'react';
import { Book, Smartphone, Headphones, Monitor } from 'lucide-react';

interface BookFormatBadgeProps {
  format: string;
  className?: string;
}

const BookFormatBadge: React.FC<BookFormatBadgeProps> = ({ format, className = '' }) => {
  const getFormatIcon = () => {
    switch (format) {
      case 'paperback':
      case 'hardcover':
        return <Book className="h-4 w-4" />;
      case 'kindle':
      case 'ebook':
        return <Smartphone className="h-4 w-4" />;
      case 'audiobook':
        return <Headphones className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${className}`}>
      {getFormatIcon()}
      <span className="capitalize">{format}</span>
    </span>
  );
};

export default BookFormatBadge;