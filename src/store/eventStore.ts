import { create } from 'zustand';
import { Event } from '../types';

interface EventState {
  events: Event[];
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  filterEvents: (search: string, category?: string) => Event[];
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  filterEvents: (search, category) => {
    const { events } = get();
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || event.category === category;
      return matchesSearch && matchesCategory;
    });
  },
}));