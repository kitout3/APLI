import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, XCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';

const CreateEventModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [participants, setParticipants] = useState([]);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportStatus({ loading: true, message: 'Importation en cours...' });

    try {
      const result = await parseExcelFile(file);
      setParticipants(result.participants);
      setImportStatus({ 
        success: true, 
        message: `${result.imported} participants importés avec succès !${result.duplicates > 0 ? ` (${result.duplicates} doublons ignorés)` : ''}` 
      });
    } catch (error) {
      setImportStatus({ error: true, message: error.message || 'Erreur lors de l\'importation' });
    }
  };

  const handleSubmit = () => {
    if (!name || !date) return;
    
    onCreate({
      name,
      date,
      location,
      capacity: capacity ? parseInt(capacity) : null,
      description,
      participants
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-slate-800">Créer un nouvel événement</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nom de l'événement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Formation Azure 2025"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date de l'événement <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Lieu</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Salle de conférence A"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Capacité maximale</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Ex: 100"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'événement..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Excel Import */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Importer les participants
            </label>
            <div 
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 mb-2">Importez votre fichier Excel avec les colonnes :</p>
              <p className="text-indigo-600 font-medium text-sm">
                ID d'inscription, Nom complet, Email, Invité, Raison du statut, Gérant
              </p>
              <button 
                type="button"
                className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                Choisir un fichier Excel
              </button>
            </div>
            
            {importStatus && (
              <div className={`mt-3 p-3 rounded-xl flex items-center gap-2 ${
                importStatus.loading ? 'bg-blue-50 text-blue-700' :
                importStatus.success ? 'bg-emerald-50 text-emerald-700' :
                'bg-red-50 text-red-700'
              }`}>
                {importStatus.loading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                {importStatus.success && <CheckCircle className="w-4 h-4" />}
                {importStatus.error && <XCircle className="w-4 h-4" />}
                <span className="text-sm font-medium">{importStatus.message}</span>
              </div>
            )}
          </div>

          {/* Participants Preview */}
          {participants.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-700">Participants importés</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {participants.length}
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {participants.slice(0, 5).map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{p.prenom} {p.nom}</span>
                    <span className="text-slate-400 text-xs truncate ml-2">{p.email}</span>
                  </div>
                ))}
                {participants.length > 5 && (
                  <p className="text-center text-slate-400 text-sm pt-2">
                    ... et {participants.length - 5} autres
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!name || !date}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Créer l'événement
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
