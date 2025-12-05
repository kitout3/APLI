import * as XLSX from 'xlsx';
import { generateId } from './helpers';

// Column name mappings (French to internal)
const COLUMN_MAPPINGS = {
  // ID fields
  'id': 'id',
  'id_client': 'id',
  "id d'inscription": 'id',
  'inscription': 'id',
  
  // Name fields  
  'nom': 'nom',
  'name': 'nom',
  'nom complet': 'fullName',
  'contact': 'fullName',
  
  // First name
  'prenom': 'prenom',
  'prénom': 'prenom',
  'firstname': 'prenom',
  
  // Email
  'email': 'email',
  'mail': 'email',
  'adresse email': 'email',
  'adresse email (contact) (relation)': 'email',
  'e-mail': 'email',
  
  // Company
  'societe': 'company',
  'société': 'company',
  'company': 'company',
  'entreprise': 'company',
  
  // Manager
  'gerant': 'manager',
  'gérant': 'manager',
  'gérant (contact) (relation)': 'manager',
  'manager': 'manager',
};

// Parse full name into first and last name
const parseFullName = (fullName) => {
  if (!fullName) return { nom: '', prenom: '' };
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { nom: parts[0], prenom: '' };
  }
  
  // Assume last word is surname, rest is first name
  const nom = parts[parts.length - 1];
  const prenom = parts.slice(0, -1).join(' ');
  
  return { nom, prenom };
};

// Normalize column name for matching
const normalizeColumnName = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s()]/g, '')
    .trim();
};

// Find matching internal field for a column
const findFieldMapping = (columnName) => {
  const normalized = normalizeColumnName(columnName);
  
  for (const [key, value] of Object.entries(COLUMN_MAPPINGS)) {
    if (normalized === normalizeColumnName(key)) {
      return value;
    }
    // Partial match
    if (normalized.includes(normalizeColumnName(key)) || normalizeColumnName(key).includes(normalized)) {
      return value;
    }
  }
  
  return null;
};

// Parse Excel file and extract participants
export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          reject(new Error('Le fichier est vide ou ne contient pas assez de données'));
          return;
        }
        
        // Get headers and map to internal fields
        const headers = jsonData[0].map(h => String(h || ''));
        const fieldMap = headers.map(h => findFieldMapping(h));
        
        // Parse rows
        const participants = [];
        const seen = new Set();
        let duplicates = 0;
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;
          
          const participant = {
            id: '',
            nom: '',
            prenom: '',
            email: '',
            company: '',
            manager: '',
            source: 'import',
            isPresent: false,
            presenceDate: null,
            validationMode: null
          };
          
          // Map row values to fields
          row.forEach((value, idx) => {
            const field = fieldMap[idx];
            if (field && value !== undefined && value !== null) {
              if (field === 'fullName') {
                const { nom, prenom } = parseFullName(String(value));
                participant.nom = nom;
                participant.prenom = prenom;
              } else {
                participant[field] = String(value).trim();
              }
            }
          });
          
          // Generate ID if not present
          if (!participant.id) {
            participant.id = generateId();
          }
          
          // Skip if no name or email
          if (!participant.nom && !participant.prenom && !participant.email) {
            continue;
          }
          
          // Check for duplicates by ID
          if (seen.has(participant.id)) {
            duplicates++;
            continue;
          }
          seen.add(participant.id);
          
          participants.push(participant);
        }
        
        resolve({
          participants,
          totalRows: jsonData.length - 1,
          imported: participants.length,
          duplicates,
          headers: headers
        });
        
      } catch (error) {
        reject(new Error('Erreur lors de la lecture du fichier: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Export participants to Excel
export const exportToExcel = (participants, eventName) => {
  const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Présent', 'Date validation', 'Mode validation', 'Source'];
  
  const data = participants.map(p => ([
    p.id,
    p.nom,
    p.prenom,
    p.email,
    p.isPresent ? 'Oui' : 'Non',
    p.presenceDate ? new Date(p.presenceDate).toLocaleString('fr-FR') : '',
    p.validationMode || '',
    p.source || 'import'
  ]));
  
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 30 }, // ID
    { wch: 20 }, // Nom
    { wch: 20 }, // Prénom
    { wch: 35 }, // Email
    { wch: 10 }, // Présent
    { wch: 20 }, // Date validation
    { wch: 15 }, // Mode
    { wch: 10 }, // Source
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Participants');
  
  const filename = `export_${eventName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
  
  return filename;
};
