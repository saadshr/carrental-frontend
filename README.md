# 🚗 Car Rental · Frontend

![React 19](https://img.shields.io/badge/React-19-087EA4?style=for-the-badge&logo=react&logoColor=white)
![React Router 7](https://img.shields.io/badge/React%20Router-7-B52A40?style=for-the-badge&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-036982?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-306B32?style=for-the-badge&logo=nodedotjs&logoColor=white)

[Démarrage](#lancer-en-local) · [Pages](#pages) · [Tests et build](#vérification-et-build)

---

Interface React pour parcourir un catalogue de voitures, créer et gérer des réservations, et administrer la flotte. L'interface utilise React 19, React Router 7, Tailwind CSS et Axios.

- Les visiteurs peuvent consulter le catalogue et la fiche de chaque voiture.
- Les utilisateurs connectés peuvent réserver une voiture, suivre leurs réservations et annuler celles qui le permettent.
- Les administrateurs peuvent gérer les voitures, confirmer des réservations et consulter les indicateurs globaux.

## Lancer en local

Installer Node.js 20 ou plus récent avec npm, puis démarrer l'API Laravel. [Instructions du backend](https://github.com/saadshr/carrental-backend)

Depuis le dossier qui contient les dépôts, cloner le frontend si nécessaire, puis lancer les commandes suivantes.

```powershell
git clone https://github.com/saadshr/carrental-frontend.git
Set-Location carrental-frontend
npm ci
npm start
```

Ouvrir [localhost:3000](http://localhost:3000). Le frontend utilise par défaut `http://127.0.0.1:8000/api`. Pour changer cette adresse, créer un fichier `.env.local` à la racine du frontend avec la valeur voulue, puis redémarrer `npm start`.

```dotenv
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

Si le frontend est hébergé sur un autre domaine, ajouter son origine à la configuration CORS de l'API Laravel. Le client Axios joint le JWT aux requêtes authentifiées sous la forme `Authorization: Bearer <token>`.

## Pages

- Catalogue et fiches des voitures · `/` et `/cars/:id`
- Connexion et inscription · `/login` et `/register`
- Tableau de bord et réservations personnelles · `/dashboard` et `/reservations`
- Administration de la flotte et des réservations · `/admin`

Les écrans se trouvent dans `src/pages/` et les appels HTTP dans `src/services/`.

## Vérification et build

- `npm run build` génère les fichiers statiques dans `build/`. Configurer l'hébergement pour servir `index.html` lors de l'ouverture directe d'une route React.
- `npm test` lance Jest. Le test actuellement versionné dans `src/App.test.js` cible encore l'écran d'exemple de Create React App et doit être adapté à l'application.
