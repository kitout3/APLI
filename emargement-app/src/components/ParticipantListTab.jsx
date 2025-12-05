import React, { useState } from 'react';
import { Search, UserPlus, Clock } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';

const ParticipantListTab = ({ event, onUpdatePresence, onAddParticipant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ 
    nom: '', 
    prenom: '', 
    email: '', 
    id: '' 
  });

  const filteredParticipants = event.participants.filter(p => {
    const searchStr = `${p.nom} ${p.prenom} ${p.email} ${p.id}`.toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'present' ? p.isPresent :
      filter === 'absent' ? !p.isPresent :
      filter === 'manual' ? p.source === 'manual' : true;
    return matchesSearch && matchesFilter;
  });

  const handleAddParticipant = (markPresent) => {
    if (!newParticipant.nom || !newParticipant.prenom || !newParticipant.email) return;
    onAddParticipant(newParticipant, markPresent);
    setNewParticipant({ nom: '', prenom: '', email: '', id: '' });
    setShowAddForm(false);
  };

  const presentCount = event.participants.filter(p => p.isPresent).length;
  const absentCount = event.participants.filter(p => !p.isPresent).length;
  const manualCount = event.participants.filter(p => p.source === 'manual').length;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Liste des participants</h3>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tous ({event.participants.length})
        </button>
        <button
          onClick={() => setFilter('present')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'present' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          Présents ({presentCount})
        </button>
        <button
          onClick={() => setFilter('absent')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === 'absent' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          Absents ({absentCount})
        </button>
        {manualCount > 0 && (
          <button
            onClick={() => setFilter('manual')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === 'manual' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
          >
            Sur place ({manualCount})
          </button>
        )}
      </div>

      {/* Add Participant Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full mb-4 py-3 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Ajouter un participant
      </button>

      {/* Add Participant Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-2xl space-y-3">
          <input
            type="text"
            placeholder="Nom *"
            value={newParticipant.nom}
            onChange={(e) => setNewParticipant({...newParticipant, nom: e.target.value})}
            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
          />
          <input
            type="text"
            placeholder="Prénom *"
            value={newParticipant.prenom}
            onChange={(e) => setNewParticipant({...newParticipant, prenom: e.target.value})}
            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
          />
          <input
            type="email"
            placeholder="Email *"
            value={newParticipant.email}
            onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
          />
          <input
            type="text"
            placeholder="ID (optionnel - généré automatiquement)"
            value={newParticipant.id}
            onChange={(e) => setNewParticipant({...newParticipant, id: e.target.value})}
            className="w-full px-4 py-3 bg-white rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleAddParticipant(true)}
              disabled={!newParticipant.nom || !newParticipant.prenom || !newParticipant.email}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all text-sm disabled:opacity-50"
            >
              Ajouter et marquer présent
            </button>
            <button
              onClick={() => handleAddParticipant(false)}
              disabled={!newParticipant.nom || !newParticipant.prenom || !newParticipant.email}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all text-sm disabled:opacity-50"
            >
              Ajouter seulement
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(false)}
            className="w-full py-2 text-slate-500 text-sm hover:text-slate-700"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Participants List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map(participant => (
            <div 
              key={participant.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                participant.isPresent 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {participant.source === 'manual' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Manuel</span>
                    )}
                    {participant.validationMode === 'qr' && participant.isPresent && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">QR</span>
                    )}
                    <span className="font-semibold text-slate-800 truncate">
                      {participant.prenom} {participant.nom}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1 truncate">{participant.email}</div>
                  <div className="text-xs text-slate-400 mt-1">ID: {participant.id}</div>
                  {participant.isPresent && participant.presenceDate && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(participant.presenceDate)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onUpdatePresence(participant.id, !participant.isPresent, 'manual')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                    participant.isPresent
                      ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {participant.isPresent ? 'Annuler' : 'Marquer'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            {searchTerm || filter !== 'all' 
              ? 'Aucun participant trouvé' 
              : 'Aucun participant inscrit'}
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredParticipants.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-center text-sm text-slate-500">
          {filteredParticipants.length} participant{filteredParticipants.length > 1 ? 's' : ''} affiché{filteredParticipants.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default ParticipantListTab;
