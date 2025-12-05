import React, { useState } from 'react';
import { Calendar, Users, Camera, Download, ArrowLeft } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import ScannerTab from './ScannerTab';
import ParticipantListTab from './ParticipantListTab';
import ExportTab from './ExportTab';

const EventDetailView = ({ 
  event, 
  onBack, 
  onUpdatePresence, 
  onAddParticipant, 
  showNotification 
}) => {
  const [activeTab, setActiveTab] = useState('scanner');
  
  const presentCount = event.participants.filter(p => p.isPresent).length;
  const totalCount = event.participants.length;
  const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        
        <h1 className="text-xl font-bold text-slate-800 mb-2">{event.name}</h1>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.date)}</span>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-500">{presentCount}</div>
            <div className="text-sm text-slate-600">Présents</div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-slate-700">{totalCount}</div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-4 text-center">
            <div className={`text-3xl font-bold ${rate >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>{rate}%</div>
            <div className="text-sm text-slate-600">Taux</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'scanner' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Camera className="w-5 h-5" />
          Scanner
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'list' 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-5 h-5" />
          Liste ({presentCount}/{totalCount})
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className="py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 bg-emerald-500 text-white hover:bg-emerald-600 transition-all"
        >
          <Download className="w-5 h-5" />
          Exporter
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'scanner' && (
        <ScannerTab 
          event={event}
          onUpdatePresence={onUpdatePresence}
          onAddParticipant={onAddParticipant}
          showNotification={showNotification}
        />
      )}
      
      {activeTab === 'list' && (
        <ParticipantListTab 
          event={event}
          onUpdatePresence={onUpdatePresence}
          onAddParticipant={onAddParticipant}
        />
      )}
      
      {activeTab === 'export' && (
        <ExportTab event={event} showNotification={showNotification} />
      )}
    </div>
  );
};

export default EventDetailView;
