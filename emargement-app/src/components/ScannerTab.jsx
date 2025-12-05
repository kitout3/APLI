import React, { useState, useRef, useEffect } from 'react';
import { Camera, Search, X, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';

const ScannerTab = ({ event, onUpdatePresence, onAddParticipant, showNotification }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [manualId, setManualId] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
      showNotification('info', 'Scanner activé - Positionnez le QR code');
    } catch (error) {
      showNotification('error', 'Impossible d\'accéder à la caméra');
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const processParticipantId = (id, mode = 'manual') => {
    const participant = event.participants.find(
      p => p.id.toLowerCase() === id.toLowerCase().trim()
    );
    
    if (participant) {
      if (participant.isPresent) {
        setScanResult({
          type: 'already',
          participant,
          message: 'Déjà émargé'
        });
        showNotification('warning', `${participant.prenom} ${participant.nom} est déjà présent`);
      } else {
        onUpdatePresence(participant.id, true, mode);
        // Update participant object for display
        const updatedParticipant = {
          ...participant,
          isPresent: true,
          presenceDate: new Date().toISOString()
        };
        setScanResult({
          type: 'success',
          participant: updatedParticipant,
          message: 'Présence validée !'
        });
        showNotification('success', `${participant.prenom} ${participant.nom} marqué présent`);
      }
    } else {
      setScanResult({
        type: 'unknown',
        id: id,
        message: 'ID non trouvé'
      });
      showNotification('error', 'Participant non trouvé');
    }
  };

  const handleManualSearch = () => {
    if (!manualId.trim()) return;
    processParticipantId(manualId, 'manual');
    setManualId('');
  };

  // Simulate QR scan for demo (since real QR scanning requires additional setup)
  const simulateScan = () => {
    const notPresentParticipants = event.participants.filter(p => !p.isPresent);
    if (notPresentParticipants.length > 0) {
      const randomParticipant = notPresentParticipants[Math.floor(Math.random() * notPresentParticipants.length)];
      processParticipantId(randomParticipant.id, 'qr');
    } else {
      showNotification('warning', 'Tous les participants sont déjà présents');
    }
  };

  const handleAddUnknown = () => {
    if (scanResult?.type === 'unknown' && scanResult.id) {
      // Pre-fill with the unknown ID
      onAddParticipant({ 
        id: scanResult.id,
        nom: '',
        prenom: '',
        email: ''
      }, true);
      setScanResult(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Scanner un code QR</h3>
      
      {/* Scanner Area */}
      <div className="relative bg-slate-100 rounded-2xl aspect-square mb-4 overflow-hidden">
        {isScanning ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            {/* Scan overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-2 border-indigo-500 rounded-xl">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />
                {/* Scan line */}
                <div className="absolute left-2 right-2 h-0.5 bg-indigo-500 animate-scan-line opacity-75" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-slate-500 text-center px-8">
              Positionnez le QR code devant la caméra
            </p>
          </div>
        )}
      </div>

      {/* Scanner Controls */}
      <div className="space-y-3">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Démarrer le scanner
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={stopScanner}
              className="flex-1 py-4 rounded-2xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-all"
            >
              Arrêter
            </button>
            <button
              onClick={simulateScan}
              className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all"
            >
              Simuler scan
            </button>
          </div>
        )}
      </div>

      {/* Manual ID Search */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <h4 className="font-medium text-slate-700 mb-3">Recherche par ID</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Entrez l'ID du participant"
            className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border-2 border-slate-100 focus:border-indigo-300 focus:outline-none transition-colors"
            onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
          />
          <button
            onClick={handleManualSearch}
            disabled={!manualId.trim()}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className={`mt-4 p-4 rounded-2xl ${
          scanResult.type === 'success' ? 'bg-emerald-50' :
          scanResult.type === 'already' ? 'bg-amber-50' :
          'bg-red-50'
        }`}>
          <div className="flex items-start gap-3">
            {scanResult.type === 'success' && <CheckCircle className="w-8 h-8 text-emerald-500 flex-shrink-0" />}
            {scanResult.type === 'already' && <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0" />}
            {scanResult.type === 'unknown' && <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />}
            <div className="flex-1">
              <div className={`font-bold ${
                scanResult.type === 'success' ? 'text-emerald-700' :
                scanResult.type === 'already' ? 'text-amber-700' :
                'text-red-700'
              }`}>
                {scanResult.message}
              </div>
              {scanResult.participant && (
                <div className="text-sm text-slate-600 mt-1">
                  {scanResult.participant.prenom} {scanResult.participant.nom}
                </div>
              )}
              {scanResult.type === 'already' && scanResult.participant?.presenceDate && (
                <div className="text-xs text-slate-500 mt-1">
                  Émargé le {formatDateTime(scanResult.participant.presenceDate)}
                </div>
              )}
              {scanResult.type === 'unknown' && (
                <div className="mt-3">
                  <p className="text-sm text-slate-600 mb-2">ID: {scanResult.id}</p>
                  <button
                    onClick={handleAddUnknown}
                    className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Ajouter ce participant
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => setScanResult(null)}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerTab;
