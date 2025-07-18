import React from 'react';
import { Zap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        {/* App Logo/Title */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
            <Zap className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-light text-gray-800 tracking-wide">
            Padel
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-light">
            Tournament Manager
          </p>
        </div>

        {/* Create Tournament Button */}
        <button className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-medium text-lg hover:bg-gray-800 transition-colors duration-200 active:scale-95 transform">
          Create Tournament
        </button>

        {/* Subtle footer */}
        <div className="mt-16">
          <p className="text-xs text-gray-400 font-light">
            Simple. Fast. Efficient.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;