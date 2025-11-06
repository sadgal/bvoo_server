# --- Étape 1 : Construction (Builder Stage) ---
# Utilise une image Node.js complète pour installer les dépendances et compiler
FROM node:20-alpine AS builder

WORKDIR /app

# Copie les fichiers de configuration (package.json et package-lock.json) en premier
# pour tirer parti de la mise en cache de Docker.
COPY package*.json ./

# Installe toutes les dépendances (y compris les devDependencies)
RUN npm install

# Copie le reste du code source
COPY . .

# Compile le code TypeScript en JavaScript (assurez-vous d'avoir un script 'build' dans package.json)
RUN npm run build

# --- Étape 2 : Production (Production Stage) ---
# Utilise une image Node.js légère et propre pour l'exécution finale
FROM node:20-alpine AS production

WORKDIR /app

# Copie uniquement les fichiers nécessaires à l'exécution depuis l'étape 'builder'
# Copie uniquement les fichiers package*.json (pour les dépendances de production)
COPY package*.json ./

# Installe seulement les dépendances de production (ignorer les devDependencies)
RUN npm install --only=production

# Copie les fichiers JavaScript compilés (situés dans le dossier 'dist' ou 'build' après compilation)
COPY --from=builder /app/dist ./dist 
# Remplacez /app/dist par le chemin de sortie configuré dans votre tsconfig.json

# Expose le port sur lequel votre application Express écoute (le plus souvent 3000)
EXPOSE 3000

# Définit la commande pour démarrer l'application Node.js compilée
#CMD ["node", "dist/index.js"]
# Remplacez dist/index.js par le chemin de votre fichier d'entrée JS compilé
CMD ["npm", "start"]
