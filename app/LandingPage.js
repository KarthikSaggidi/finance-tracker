"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 text-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        Welcome to Personal Finance Tracker! 💰
      </h1>
      <p className="text-lg text-gray-700 max-w-xl">
        Track your expenses, manage transactions, and stay on top of your financial health!
      </p>
      <button
        onClick={() => router.push("/tracker")}
        className="mt-6 bg-blue-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all"
      >
        Start Tracking 🚀
      </button>
    </div>
  );
}