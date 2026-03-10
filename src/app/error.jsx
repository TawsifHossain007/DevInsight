"use client";
import React from "react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center bg-white shadow-lg rounded-2xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold">
            !
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Something Went Wrong
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          An unexpected error occurred while processing your request.
          Our team has been notified and is working to resolve the issue.
          Please try again or return to a safe page.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-white font-medium hover:bg-red-700 transition"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Go to Home
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

export default ErrorPage;