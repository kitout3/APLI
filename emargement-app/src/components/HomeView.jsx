import React, { useState } from 'react';
import { Calendar, Users, Check, MapPin, Search, Plus } from 'lucide-react';
import { formatDate, getStatusBadge } from '../utils/helpers';

const HomeView = ({ events, onSelectEvent, onCreateEvent, onDeleteEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📋</span>
          <h1 className="text-2xl font-bold text-slate-800">Émargement Événements</h1>
        </div>
        <p className="text-slate-500">Gestion multi-événements hors ligne</p>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Mes Événements</h2>
        <button 
          onClick={onCreateEvent}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Nouvel événement
        </button>
      </div>

      {/* Search and Filters */}
      {events.length > 0 && (
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'ongoing', label: 'En cours' },
              { key: 'upcoming', label: 'À venir' },
              { key: 'completed', label: 'Terminés' }
            ].map(status => (
              <button
                key={status.key}
                onClick={() => setStatusFilter(status.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === status.key 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="space-y-3">
          {filteredEvents.map(event => {
            const presentCount = event.participants.filter(p => p.isPresent).length;
            const totalCount = event.participants.length;
            const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
            const statusBadge = getStatusBadge(event.status);
            
            return (
              <div 
                key={event.id} 
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge.color}`}>
                    {statusBadge.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{totalCount} inscrits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600">{presentCount} présents</span>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${rate >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {rate}%
                  </div>
                </div>
                <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${rate >= 50 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-500 mb-6">Aucun événement créé</p>
          <button 
            onClick={onCreateEvent}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all"
          >
            Créer mon premier événement
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center">
          <p className="text-slate-500">Aucun événement trouvé</p>
        </div>
      )}
    </div>
  );
};

export default HomeView;
