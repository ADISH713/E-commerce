import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-orange-600">404</h1>

        <h2 className="text-2xl font-semibold text-gray-900 mt-4">
          Page not found
        </h2>

        <p className="text-gray-500 mt-2">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;