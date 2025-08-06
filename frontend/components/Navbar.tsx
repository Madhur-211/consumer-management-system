'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // const token = localStorage.getItem('token');
    // setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // localStorage.removeItem('token');
    window.location.href = '/login'; // or use router.push
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link href="/" className="mr-4">Home</Link>
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="mr-4">Dashboard</Link>
          </>
        ) : (
          <>
            <Link href="/login" className="mr-4">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
