        -Identifiants de démonstration-

 Email : admin@russell.fr // Mot de passe : motdepasse123
        
        


        
        -API Port de Plaisance Russell-

Application web de gestion des réservations de catways pour le port de plaisance de Russell : API REST + interface d'administration server-rendue.

        -Fonctionnalités-

- Authentification par session (connexion / déconnexion)
- Gestion des catways (CRUD)
- Gestion des réservations, rattachées à un catway (CRUD)
- Gestion des utilisateurs, identifiés par email (CRUD)
- Interface web (tableau de bord, listes et formulaires) protégée par authentification
- Documentation interactive de l'API (Swagger)

        -Stack technique-

- Node.js / Express
- MongoDB (Mongoose) — hébergé sur MongoDB Atlas
- EJS pour le rendu des vues côté serveur
- express-session pour l'authentification
- bcryptjs pour le hachage des mots de passe
- swagger-jsdoc / swagger-ui-express pour la documentation de l'API
- Déploiement : Render

        -Application déployée-

- URL : https://devoir-port-plaisance-russel.onrender.com
- Documentation API (Swagger) : https://devoir-port-plaisance-russel.onrender.com/api-docs

        


        -Installation et lancement en local

            -Prérequis-

- Node.js (v18 ou supérieur)
- Un accès à une base MongoDB (locale ou Atlas)

            -Étapes-

```bash
git clone https://github.com/gi31000/devoir-port-plaisance-russel.git
cd devoir-port-plaisance-russel
npm install
```

Créer un fichier `.env` à la racine du projet avec les variables suivantes :


MONGODB_URI=mongodb+srv://ginocrespin_db_user:motdepasse123@cluster0.uspzxe5.mongodb.net/port-plaisance-v2?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
SESSION_SECRET=ma_phrase_secrete_ici



Importer les données fournies (catways et réservations) :

```bash
node src/scripts/importData.js
```

Créer un compte administrateur initial :

```bash
node src/scripts/createAdmin.js
```

Lancer le serveur :

```bash
npm run dev
```

L'application est accessible sur `http://localhost:3000`.



La documentation complète et interactive de chaque route est disponible sur `/api-docs`.

