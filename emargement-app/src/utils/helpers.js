// Generate unique ID
export const generateId = () => 'ID-' + Math.random().toString(36).substr(2, 9).toUpperCase();

// Format date for display (French locale)
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Get event status based on date
export const getEventStatus = (eventDate) => {
  const now = new Date();
  const date = new Date(eventDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (eventDay > today) return 'upcoming';
  if (eventDay.getTime() === today.getTime()) return 'ongoing';
  return 'completed';
};

// Get status badge styling
export const getStatusBadge = (status) => {
  switch(status) {
    case 'upcoming': 
      return { label: 'À venir', color: 'bg-blue-100 text-blue-700' };
    case 'ongoing': 
      return { label: 'En cours', color: 'bg-emerald-100 text-emerald-700' };
    case 'completed': 
      return { label: 'Terminé', color: 'bg-slate-100 text-slate-600' };
    default: 
      return { label: status, color: 'bg-slate-100 text-slate-600' };
  }
};

// Local storage helpers
const STORAGE_KEY = 'emargement_events';

export const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events to localStorage', e);
  }
};

export const loadEventsFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load events from localStorage', e);
    return [];
  }
};

// Export to CSV
export const exportToCSV = (data, filename) => {
  const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Présent', 'Date validation', 'Mode', 'Source'];
  const rows = data.map(p => [
    p.id,
    p.nom,
    p.prenom,
    p.email,
    p.isPresent ? 'Oui' : 'Non',
    p.presenceDate ? formatDateTime(p.presenceDate) : '',
    p.validationMode || '',
    p.source || 'import'
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
