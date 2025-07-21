import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  department: string;
  isRequired: boolean;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await apiService.events.getAll();
      setEvents((response.data as any).events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, attending: boolean) => {
    try {
      await apiService.events.rsvp(eventId, attending);
      // Show success message or update UI
      alert(`RSVP recorded: ${attending ? 'attending' : 'not attending'}`);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Upcoming Events</h1>
        <p className="text-gray-300">
          Stay up to date with company events, meetings, and training sessions.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-gray-400">No upcoming events found.</p>
          </div>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
          ))
        )}
      </div>
    </div>
  );
};

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, attending: boolean) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRSVP }) => {
  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const isPast = eventDate < new Date();

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-white">{event.title}</h3>
            {event.isRequired && (
              <span className="px-2 py-1 text-xs font-medium bg-red-900 text-red-200 rounded-full">
                Required
              </span>
            )}
            {isToday && (
              <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-200 rounded-full">
                Today
              </span>
            )}
            {isPast && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                Past Event
              </span>
            )}
          </div>
          
          <p className="text-gray-300 mb-4">{event.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center text-gray-400">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{eventDate.toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center text-gray-400">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center text-gray-400">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-400">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 714 0z" />
              </svg>
              <span>{event.department}</span>
            </div>
          </div>
        </div>
        
        {!isPast && (
          <div className="ml-6 flex space-x-3">
            <button
              onClick={() => onRSVP(event.id, true)}
              className="btn btn-primary text-sm"
            >
              Attending
            </button>
            <button
              onClick={() => onRSVP(event.id, false)}
              className="btn btn-danger text-sm"
            >
              Not Attending
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;