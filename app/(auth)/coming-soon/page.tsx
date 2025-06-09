"use client";

import { ClockIcon } from "@heroicons/react/24/outline";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto h-20 w-20 bg-[#ffc617] rounded-full flex items-center justify-center mb-8 shadow-lg">
            <ClockIcon className="h-10 w-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8">
            もうしばらくお待ちください。
          </p>
        </div>
      </main>
    </div>
  );
}
