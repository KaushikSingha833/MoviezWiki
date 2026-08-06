"use client";

import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, user } = useWishlist();

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center border-l-4 border-[#F5C518] pl-3">
          My Wishlist
        </h1>
        
        {!user ? (
          <div className="text-center text-neutral-400 py-20 bg-neutral-900/50 rounded-xl border border-neutral-800">
            <p className="text-xl mb-4">Please log in to view and manage your wishlist.</p>
            <Link href="/login">
              <button className="bg-[#F5C518] text-black font-bold py-2 px-6 rounded-md hover:bg-yellow-500 transition-colors">
                Log In
              </button>
            </Link>
          </div>
        ) : wishlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-12 pb-24">
            {wishlist.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-400 py-20 bg-neutral-900/50 rounded-xl border border-neutral-800">
            <p className="text-xl">Your wishlist is currently empty.</p>
            <p className="mt-2 text-sm">Explore the homepage and click the heart icon to save movies here.</p>
          </div>
        )}
      </main>
    </div>
  );
}