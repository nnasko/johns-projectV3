import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { registerForEvent } from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useEventStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const event = events.find(e => e.id === id);

  useEffect(() => {
    if (!event) {
      navigate('/events');
    }
  }, [event, navigate]);

  if (!event) return null;

  const isRegistered = event.registeredUsers.includes(user?.id || '');
  const isFull = event.registeredUsers.length >= event.capacity;

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please login to register for events');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      await registerForEvent(event.id, token);
      toast.success('Successfully registered for event!');
    } catch (error) {
      toast.error('Failed to register for event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-96 object-cover"
        />
        
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <div className="flex items-center text-gray-500">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{format(new Date(event.date), 'PPP')}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold text-indigo-600">${event.price}</p>
              <p className="text-sm text-gray-500">per person</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {format(new Date(event.date), 'p')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">
                  {event.registeredUsers.length} / {event.capacity} spots filled
                </p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">About this event</h2>
            <p className="text-gray-600">{event.description}</p>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading || isRegistered || isFull}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isRegistered
              ? 'Already Registered'
              : isFull
              ? 'Event Full'
              : loading
              ? 'Registering...'
              : 'Register for Event'}
          </button>
        </div>
      </div>
    </div>
  );
}