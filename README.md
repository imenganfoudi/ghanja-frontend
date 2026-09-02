# Ghanja v2 — Frontend

Interface SPA (Single Page Application) du système de réservation Ghanja, développée avec **Vue.js 3** et **TypeScript**.

Cette version constitue une réécriture complète du frontend, consommant l'API REST Laravel via des appels HTTP authentifiés (Sanctum tokens).

🔗 **Démo live :** [ghanja-frontend.onrender.com](https://ghanja-frontend.onrender.com)
🔗 **API Backend :** [ghanja-v2-api.onrender.com](https://ghanja-v2-api.onrender.com)

## Stack technique

- **Vue 3** (Composition API) + **TypeScript**
- **Vite** — build tool
- **Vue Router** — navigation et routes protégées
- **Pinia** — gestion d'état (auth, appointments, services, staff)
- **Axios** — requêtes HTTP vers l'API
- **Tailwind CSS** — styling

## Fonctionnalités

- Authentification (login/logout) via tokens Sanctum
- Tableau de bord protégé (routes nécessitant une connexion)
- Gestion des rendez-vous : liste, création (avec vérification des créneaux disponibles en temps réel), changement de statut, suppression
- Gestion des services : CRUD complet
- Gestion des employés : CRUD complet

## Installation locale

```bash
npm install
npm run dev
```

L'application tourne par défaut sur `http://localhost:5173`.

## Build production

```bash
npm run build
```

## Projet lié

Ce frontend consomme l'API du backend Laravel disponible sur la branche [`ghanja-v2-api`](https://github.com/imenganfoudi/ghanja-booking-system/tree/ghanja-v2-api) du projet [Ghanja](https://github.com/imenganfoudi/ghanja-booking-system).