# Configuration de Déploiement - PROP CANADA

Ce fichier centralise les informations critiques sur l'hébergement et le déploiement du site pour s'assurer que le contexte n'est jamais perdu lors des prochaines mises à jour.

## 📁 Dépôt Source (Code)
- **URL du dépôt GitHub :** https://github.com/PROPCANADA/PROPCANADA
- **Branche de production :** `master`
- **Notes d'accès (Important) :** Pour faire un `git push`, il faut utiliser un **Personal Access Token (Classic)** avec la case `repo` cochée. Les tokens de type "Fine-grained" causent des problèmes d'accès (erreur 403) avec l'organisation.

## 🌐 Serveur et Hébergement (Production)
- **Plateforme :** Cloudflare Workers
- **Nom du projet Cloudflare :** `propcanada`
- **Nom de domaine :** https://propcanada.com
- **Fichier de configuration :** `wrangler.jsonc` (Gère l'upload des fichiers statiques)

## 🚀 Procédure de Déploiement

🚨 **Attention :** Le simple fait de pousser le code sur GitHub (git push) **ne met pas à jour le site en direct**, car le système de build automatique de Cloudflare bloque sur l'initialisation. 

Pour mettre le site en ligne, il faut toujours utiliser **Wrangler** (l'outil CLI de Cloudflare) directement depuis ce dossier :

1. **S'authentifier (si nécessaire) :**
   ```powershell
   npx wrangler login
   ```
2. **Envoyer les fichiers sur Cloudflare :**
   ```powershell
   npx wrangler versions upload
   ```
3. **Mettre en production (Live à 100%) :**
   ```powershell
   npx wrangler versions deploy
   ```
   *(Suivre les instructions à l'écran pour sélectionner la dernière version et lui attribuer 100% du trafic).*

---

## 📝 Journal des Versions et Déploiements

| Date | Version / Action | Description des changements | Auteur / Méthode |
|------|-----------------|-----------------------------|------------------|
| 2026-07-02 | **Mise à jour Contact** | Remplacement de l'adresse courriel (`rasplimon@gmail.com` -> `ghostlimon@outlook.com`) dans `config.js` et `script.js`. | Poussé sur GitHub + Déployé manuellement via Wrangler 4.107.0 |
| *2 mois avant* | **Final V9 Deployment** | Optimisation SEO et compression des vidéos. Ajout logo cash. | Déployé via Wrangler (Historique Cloudflare) |
