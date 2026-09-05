"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ImageGridSkeleton } from '@/components/ImageGridSkeleton';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Is Creator:</strong> {profile?.is_creator ? 'Yes' : 'No'}</p>
          <p><strong>Points Balance:</strong> {profile?.points_balance ?? 0}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Social Handles</h2>
            {/* Real data fetching will be implemented here */}
            <p className="text-gray-500">Loading handles...</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Verification Status</h2>
            <p className="text-gray-500">Loading status...</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Uploaded Assets</h2>
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
              Upload New Asset
            </button>
          </div>
          {/* Use ImageGridSkeleton here while loading */}
          <ImageGridSkeleton />
        </div>
      </div>
    </main>
  );
}
