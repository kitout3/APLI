import React, { useState } from 'react';
import { useEvents } from './hooks/useEvents';
import { useNotification } from './hooks/useNotification';
import Notification from './components/Notification';
import HomeView from './components/HomeView';
import EventDetailView from './components/EventDetailView';
import CreateEventModal from './components/CreateEventModal';

function App() {
  const { 
    events, 
    loading, 
    createEvent, 
    deleteEvent, 
    updatePresence, 
    addParticipant,
    getEvent 
  } = useEvents();
  
  const { notification, showNotification } = useNotification();
  
  const [currentView, setCurrentView] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Get the currently selected event
  const selectedEvent = selectedEventId ? getEvent(selectedEventId) : null;

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEventId(event.id);
    setCurrentView('detail');
  };

  // Handle create event
  const handleCreateEvent = (eventData) => {
    const newEvent = createEvent(eventData);
    setShowCreateModal(false);
    showNotification('success', 'Événement créé avec succès !');
    // Optionally navigate to the new event
    handleSelectEvent(newEvent);
  };

  // Handle delete event
  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
      setCurrentView('home');
    }
    showNotification('success', 'Événement supprimé');
  };

  // Handle back navigation
  const handleBack = () => {
    setCurrentView('home');
    setSelectedEventId(null);
  };

  // Handle presence update
  const handleUpdatePresence = (participantId, isPresent, mode) => {
    if (selectedEventId) {
      updatePresence(selectedEventId, participantId, isPresent, mode);
    }
  };

  // Handle add participant
  const handleAddParticipant = (participant, markPresent) => {
    if (selectedEventId) {
      addParticipant(selectedEventId, participant, markPresent);
      showNotification(
        'success', 
        markPresent ? 'Participant ajouté et marqué présent !' : 'Participant ajouté !'
      );
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Notification */}
      <Notification notification={notification} />

      {/* Main Content */}
      {currentView === 'home' && (
        <HomeView 
          events={events}
          onSelectEvent={handleSelectEvent}
          onCreateEvent={() => setShowCreateModal(true)}
          onDeleteEvent={handleDeleteEvent}
        />
      )}

      {currentView === 'detail' && selectedEvent && (
        <EventDetailView
          event={selectedEvent}
          onBack={handleBack}
          onUpdatePresence={handleUpdatePresence}
          onAddParticipant={handleAddParticipant}
          showNotification={showNotification}
        />
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </div>
  );
}

export default App;
