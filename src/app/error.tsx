"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your analytics or console
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 text-center gap-6"
      style={{ background: "#FAF9F6" }}
    >
      {/* Brand Logo */}
      <Image
        src="/logo.png"
        alt="Champion Nexus"
        width={100}
        height={100}
        priority
        style={{ objectFit: "contain" }}
      />

      {/* Error Message */}
      <div className="flex flex-col gap-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-sans">
          Something went wrong!
        </h2>
        <p className="text-sm text-gray-600 font-sans">
          An error occurred while loading this page. Please try again or go back to the homepage.
        </p>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#E95516" }}
        >
          Try again
        </button>
        
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white transition-all hover:bg-gray-50 active:scale-95"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
