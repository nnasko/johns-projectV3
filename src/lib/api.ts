import { Event, User } from '../types';

const API_URL = 'http://localhost:5000/api';

async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  
  return data;
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/events`);
  return handleResponse(response);
}

export async function registerForEvent(eventId: string, token: string): Promise<Event> {
  const response = await fetch(`${API_URL}/events/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
}

export async function register(userData: { email: string; password: string; name: string }): Promise<{ user: User; token: string }> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
}

export async function createEvent(eventData: Omit<Event, 'id' | 'registeredUsers'>, token: string): Promise<Event> {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });
  return handleResponse(response);
}