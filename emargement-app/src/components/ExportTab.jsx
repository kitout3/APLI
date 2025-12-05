import React, { useState } from 'react';
import { Users, Check, X, UserPlus, Download } from 'lucide-react';
import { exportToExcel } from '../utils/excelParser';

const ExportTab = ({ event, showNotification }) => {
  const [exportType, setExportType] = useState('all');

  const getFilteredData = () => {
    switch(exportType) {
      case 'present': return event.participants.filter(p => p.isPresent);
      case 'absent': return event.participants.filter(p => !p.isPresent);
      case 'manual': return event.participants.filter(p => p.source === 'manual');
      default: return event.participants;
    }
  };

  const handleExport = () => {
    const data = getFilteredData();
    
    if (data.length === 0) {
      showNotification('warning', 'Aucune donnée à exporter');
      return;
    }
    
    try {
      const filename = exportToExcel(data, event.name);
      showNotification('success', `${data.length} participants exportés !`);
    } catch (error) {
      showNotification('error', 'Erreur lors de l\'export');
    }
  };

  const counts = {
    all: event.participants.length,
    present: event.participants.filter(p => p.isPresent).length,
    absent: event.participants.filter(p => !p.isPresent).length,
    manual: event.participants.filter(p => p.source === 'manual').length
  };

  const options = [
    { key: 'all', label: 'Tous les inscrits', icon: Users, description: 'Liste complète des participants' },
    { key: 'present', label: 'Uniquement les présents', icon: Check, description: 'Participants émargés' },
    { key: 'absent', label: 'Uniquement les absents', icon: X, description: 'Participants non émargés' },
    { key: 'manual', label: 'Ajoutés sur place', icon: UserPlus, description: 'Inscriptions manuelles' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Exporter les données</h3>
      
      <p className="text-slate-500 text-sm mb-6">
        Sélectionnez le type de données à exporter au format Excel
      </p>
      
      <div className="space-y-3 mb-6">
        {options.map(option => (
          <button
            key={option.key}
            onClick={() => setExportType(option.key)}
            disabled={counts[option.key] === 0}
            className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
              exportType === option.key 
                ? 'bg-indigo-50 border-2 border-indigo-300' 
                : counts[option.key] === 0
                  ? 'bg-slate-50 border-2 border-transparent opacity-50 cursor-not-allowed'
                  : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                exportType === option.key ? 'bg-indigo-200' : 'bg-slate-200'
              }`}>
                <option.icon className={`w-5 h-5 ${
                  exportType === option.key ? 'text-indigo-600' : 'text-slate-500'
                }`} />
              </div>
              <div className="text-left">
                <span className={`font-medium block ${
                  exportType === option.key ? 'text-indigo-700' : 'text-slate-700'
                }`}>
                  {option.label}
                </span>
                <span className="text-xs text-slate-400">{option.description}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              exportType === option.key 
                ? 'bg-indigo-200 text-indigo-700' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {counts[option.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Export Summary */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Lignes à exporter</span>
          <span className="font-bold text-slate-800">{counts[exportType]}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-600">Format</span>
          <span className="font-medium text-slate-800">Excel (.xlsx)</span>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={counts[exportType] === 0}
        className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        Exporter ({counts[exportType]} lignes)
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Le fichier sera téléchargé automatiquement
      </p>
    </div>
  );
};

export default ExportTab;
