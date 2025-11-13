import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin w-12 h-12 border-4 border-[#03fd1c] border-t-transparent rounded-full mb-4" />
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-[#252525] rounded w-3/4 mb-4" />
      <div className="h-4 bg-[#252525] rounded w-1/2 mb-2" />
      <div className="h-4 bg-[#252525] rounded w-2/3" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 py-4 border-b border-[#252525] last:border-0 animate-pulse">
          <div className="w-12 h-12 bg-[#252525] rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-[#252525] rounded w-1/3 mb-2" />
            <div className="h-3 bg-[#252525] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
