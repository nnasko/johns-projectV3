import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export function BecomeHost() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    // In a real app, this would submit to the backend
    setTimeout(() => {
      toast.success('Application submitted successfully!');
      setLoading(false);
      navigate('/events');
    }, 1000);
  };

  const benefits = [
    'Create and manage your own events',
    'Access to professional event tools',
    'Priority support from our team',
    'Analytics and insights',
    'Verified host badge',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Award className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Become an Event Host</h1>
        <p className="text-xl text-gray-600">
          Join our community of event creators and start hosting amazing events
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Host Benefits</h2>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-6 bg-indigo-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Valid government ID</li>
              <li>Professional experience (optional)</li>
              <li>Clean background check</li>
              <li>Complete profile information</li>
            </ul>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Why do you want to become a host?
              </label>
              <textarea
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event experience (optional)
              </label>
              <textarea
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload ID (optional)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}