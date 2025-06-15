
# Backend - Système de Gestion de Tickets

## Installation

1. Naviguez vers le dossier server :
```bash
cd server
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

4. Modifiez le fichier `.env` avec vos configurations :
   - `MONGODB_URI` : URL de connexion MongoDB
   - `OPENAI_API_KEY` : Clé API OpenAI pour la génération de solutions
   - `PORT` : Port du serveur (défaut: 5000)

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## API Endpoints

### Tickets
- `GET /api/tickets` - Récupérer tous les tickets (avec filtres)
- `GET /api/tickets/:id` - Récupérer un ticket par ID
- `POST /api/tickets` - Créer un nouveau ticket
- `PUT /api/tickets/:id` - Mettre à jour un ticket
- `DELETE /api/tickets/:id` - Supprimer un ticket
- `PUT /api/tickets/:id/solutions` - Ajouter des solutions à un ticket

### IA (Solutions)
- `POST /api/ai/generate-solutions/:ticketId` - Générer des solutions pour un ticket
- `POST /api/ai/preview-solutions` - Prévisualiser des solutions
- `GET /api/ai/solutions/stats` - Statistiques des solutions IA

### Health Check
- `GET /api/health` - Vérifier l'état du serveur

## Structure des données

### Ticket
```javascript
{
  title: String,
  description: String,
  type: 'panne' | 'equipement',
  status: 'nouveau' | 'en-cours' | 'resolu' | 'ferme',
  priority: 'faible' | 'normale' | 'haute' | 'critique',
  assignedTo: String,
  solutions: [AISolution],
  equipment: EquipmentRequest,
  createdAt: Date,
  updatedAt: Date
}
```

### Solution IA
```javascript
{
  solution: String,
  confidence: Number (0-100),
  steps: [String],
  estimatedTime: String
}
```

## Prérequis

- Node.js >= 18
- MongoDB (local ou cloud)
- Clé API OpenAI (pour les solutions IA)
