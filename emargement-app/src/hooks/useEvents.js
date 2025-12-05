import { useState, useEffect, useCallback } from 'react';
import { generateId, getEventStatus, saveEventsToStorage, loadEventsFromStorage } from '../utils/helpers';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = loadEventsFromStorage();
    // Update status for all events
    const updatedEvents = storedEvents.map(event => ({
      ...event,
      status: getEventStatus(event.date)
    }));
    setEvents(updatedEvents);
    setLoading(false);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveEventsToStorage(events);
    }
  }, [events, loading]);

  // Create new event
  const createEvent = useCallback((eventData) => {
    const newEvent = {
      id: generateId(),
      ...eventData,
      participants: eventData.participants || [],
      createdAt: new Date().toISOString(),
      status: getEventStatus(eventData.date)
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  // Update event
  const updateEvent = useCallback((eventId, updates) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const updated = { ...event, ...updates };
        if (updates.date) {
          updated.status = getEventStatus(updates.date);
        }
        return updated;
      }
      return event;
    }));
  }, []);

  // Delete event
  const deleteEvent = useCallback((eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  // Get single event
  const getEvent = useCallback((eventId) => {
    return events.find(e => e.id === eventId);
  }, [events]);

  // Update participant presence
  const updatePresence = useCallback((eventId, participantId, isPresent, mode = 'manual') => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          participants: event.participants.map(p => {
            if (p.id === participantId) {
              return {
                ...p,
                isPresent,
                presenceDate: isPresent ? new Date().toISOString() : null,
                validationMode: isPresent ? mode : null
              };
            }
            return p;
          })
        };
      }
      return event;
    }));
  }, []);

  // Add participant to event
  const addParticipant = useCallback((eventId, participant, markPresent = false) => {
    const newParticipant = {
      ...participant,
      id: participant.id || generateId(),
      source: 'manual',
      isPresent: markPresent,
      presenceDate: markPresent ? new Date().toISOString() : null,
      validationMode: markPresent ? 'manual' : null
    };
    
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          participants: [...event.participants, newParticipant]
        };
      }
      return event;
    }));
    
    return newParticipant;
  }, []);

  // Remove participant from event
  const removeParticipant = useCallback((eventId, participantId) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          participants: event.participants.filter(p => p.id !== participantId)
        };
      }
      return event;
    }));
  }, []);

  // Find participant by ID in an event
  const findParticipant = useCallback((eventId, participantId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return null;
    return event.participants.find(p => 
      p.id.toLowerCase() === participantId.toLowerCase()
    );
  }, [events]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    updatePresence,
    addParticipant,
    removeParticipant,
    findParticipant
  };
};
