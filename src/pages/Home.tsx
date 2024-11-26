import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award } from 'lucide-react';

export function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Discover Amazing Events Near You
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of event enthusiasts and experience unforgettable moments.
          Find, create, and participate in events that matter to you.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/events"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </Link>
          <Link
            to="/become-host"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Become a Host
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Find Events</h3>
          <p className="text-gray-600">
            Discover and join events that match your interests
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect</h3>
          <p className="text-gray-600">
            Meet like-minded people and build lasting connections
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Award className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Host Events</h3>
          <p className="text-gray-600">
            Create and manage your own events as a verified host
          </p>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured events would be dynamically loaded here */}
        </div>
      </section>
    </div>
  );
}