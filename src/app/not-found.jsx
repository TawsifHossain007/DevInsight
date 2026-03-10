import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center bg-white shadow-lg rounded-2xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            404
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-primary mb-2">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for doesn’t exist or may have been
          moved. Please check the URL or return to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Go to Home
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            View Services
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-gray-500">
          DevInsight — Your Developer Companion
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;