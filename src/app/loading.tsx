import React from "react";

export default function Loading() {
  return (
    <div className="container-custom py-10 animate-pulse">
      <div className="max-w-2xl mb-8">
        <div className="h-8 bg-slate-200 rounded w-64 mb-3" />
        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-slate-200 rounded w-full mb-2" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
