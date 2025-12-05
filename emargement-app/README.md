# 📋 Émargement Événements

Application web de gestion d'émargement pour événements (présentiel ou hybride), permettant la validation des présences par scan QR, recherche manuelle et ajout de participants.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fonctionnalités

### Gestion des événements
- ✅ Création et suivi d'événements
- ✅ Import de participants depuis fichiers Excel (.xlsx, .xls, .csv)
- ✅ Statistiques de participation en temps réel
- ✅ Filtrage par statut (à venir, en cours, terminé)

### Validation des présences
- 📷 Scan de QR codes (contenant l'ID participant)
- 🔍 Recherche manuelle par nom, prénom, email ou ID
- ➕ Ajout manuel de nouveaux participants
- ⏱️ Horodatage automatique des validations

### Export des données
- 📊 Export Excel de tous les inscrits
- ✅ Export des présents uniquement
- ❌ Export des absents uniquement
- 🆕 Export des ajoutés sur place

### Fonctionnalités techniques
- 📱 Interface responsive (mobile-first)
- 💾 Stockage local (localStorage)
- 🌐 Fonctionne hors-ligne (PWA ready)
- 🎨 Design moderne et intuitif

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

```bash
# Cloner le repository
git clone https://github.com/votre-username/emargement-app.git
cd emargement-app

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 📁 Structure du projet

```
emargement-app/
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── CreateEventModal.jsx
│   │   ├── EventDetailView.jsx
│   │   ├── ExportTab.jsx
│   │   ├── HomeView.jsx
│   │   ├── Notification.jsx
│   │   ├── ParticipantListTab.jsx
│   │   └── ScannerTab.jsx
│   ├── hooks/
│   │   ├── useEvents.js
│   │   └── useNotification.js
│   ├── utils/
│   │   ├── excelParser.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 📋 Format du fichier Excel d'import

Le fichier Excel doit contenir au minimum les colonnes suivantes :

| Colonne | Obligatoire | Description |
|---------|-------------|-------------|
| ID d'inscription | Non | Identifiant unique (généré auto si absent) |
| Nom / Nom complet | Oui | Nom du participant |
| Prénom | Non | Prénom (peut être dans "Nom complet") |
| Email | Oui | Adresse email |
| Contact | Non | Nom complet alternatif |

L'application détecte automatiquement les colonnes grâce à leurs noms.

## 🔧 Configuration

### Variables d'environnement

Aucune variable d'environnement requise pour le fonctionnement de base.

### Personnalisation

Les couleurs et styles peuvent être modifiés dans :
- `tailwind.config.js` - Configuration Tailwind CSS
- `src/index.css` - Styles globaux

## 📱 Utilisation mobile

L'application est optimisée pour une utilisation sur mobile/tablette :

1. Ouvrez l'application dans votre navigateur mobile
2. Ajoutez-la à l'écran d'accueil pour une expérience native
3. L'application fonctionne même sans connexion internet

## 🔒 Données et confidentialité

- Toutes les données sont stockées **localement** dans le navigateur
- Aucune donnée n'est envoyée à des serveurs externes
- Les données persistent entre les sessions
- Possibilité d'exporter/importer pour sauvegarder

## 🛠️ Technologies utilisées

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **XLSX** - Parsing Excel
- **@zxing/library** - Scan QR codes

## 📄 License

MIT License - Voir [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📧 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

Fait avec ❤️ pour simplifier la gestion d'événements
