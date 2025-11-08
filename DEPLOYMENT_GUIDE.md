# Guide de Déploiement Complet - NOOR & SHINE

## 📋 Table des matières
1. [Configuration Google Sheets API](#1-configuration-google-sheets-api)
2. [Ajout des variables d'environnement sur Netlify](#2-ajout-des-variables-denvironnement-sur-netlify)
3. [Déploiement sur Netlify](#3-déploiement-sur-netlify)

---

## 1. Configuration Google Sheets API

### Étape 1.1: Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquez sur le sélecteur de projet en haut (à côté de "Google Cloud")
3. Cliquez sur **"NEW PROJECT"**
4. Nommez votre projet: `NOOR & SHINE Orders`
5. Cliquez sur **"CREATE"**
6. Attendez quelques secondes, puis sélectionnez le projet créé

### Étape 1.2: Activer l'API Google Sheets

1. Dans le menu latéral, allez dans **"APIs & Services"** > **"Library"**
2. Dans la barre de recherche, tapez: `Google Sheets API`
3. Cliquez sur **"Google Sheets API"**
4. Cliquez sur le bouton **"ENABLE"**
5. Attendez que l'activation soit terminée

### Étape 1.3: Créer un compte de service

1. Dans le menu latéral, allez dans **"APIs & Services"** > **"Credentials"**
2. Cliquez sur **"CREATE CREDENTIALS"** en haut
3. Sélectionnez **"Service account"**
4. Remplissez le formulaire:
   - **Service account name**: `noor-shine-orders`
   - **Service account ID**: (généré automatiquement)
   - **Description**: `Service account pour enregistrer les commandes NOOR & SHINE`
5. Cliquez sur **"CREATE AND CONTINUE"**
6. Pour "Grant this service account access to project":
   - Rôle: Sélectionnez **"Editor"** (ou créez un rôle personnalisé)
7. Cliquez sur **"CONTINUE"**
8. Cliquez sur **"DONE"** (vous pouvez ignorer l'étape suivante)

### Étape 1.4: Créer et télécharger la clé JSON

1. Dans la liste des comptes de service, cliquez sur celui que vous venez de créer (`noor-shine-orders@...`)
2. Allez dans l'onglet **"KEYS"**
3. Cliquez sur **"ADD KEY"** > **"Create new key"**
4. Sélectionnez **"JSON"**
5. Cliquez sur **"CREATE"**
6. Un fichier JSON sera téléchargé automatiquement - **GARDEZ-LE SECRET!**

**Important:** Notez l'email du compte de service (format: `noor-shine-orders@votre-projet.iam.gserviceaccount.com`)

### Étape 1.5: Créer une feuille Google Sheets

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Cliquez sur **"Blank"** pour créer une nouvelle feuille
3. Nommez-la: `NOOR & SHINE - Commandes`
4. **Partagez la feuille** avec l'email du compte de service:
   - Cliquez sur le bouton **"Share"** en haut à droite
   - Dans le champ, collez l'email du compte de service (celui que vous avez noté à l'étape 1.4)
   - Donnez les permissions **"Editor"**
   - Cliquez sur **"Send"** (vous pouvez décocher "Notify people")
5. **Copiez l'ID de la feuille** depuis l'URL:
   ```
   https://docs.google.com/spreadsheets/d/[VOICI_L_ID_A_COPIER]/edit
   ```
   L'ID est la longue chaîne de caractères entre `/d/` et `/edit`

**Exemple:** Si l'URL est:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
```
L'ID est: `1a2b3c4d5e6f7g8h9i0j`

---

## 2. Ajout des variables d'environnement sur Netlify

### Étape 2.1: Ouvrir le fichier JSON téléchargé

1. Ouvrez le fichier JSON que vous avez téléchargé (ex: `votre-projet-xxxxx.json`)
2. Vous verrez quelque chose comme:
```json
{
  "type": "service_account",
  "project_id": "votre-projet",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "noor-shine-orders@votre-projet.iam.gserviceaccount.com",
  ...
}
```

### Étape 2.2: Se connecter à Netlify

1. Allez sur [Netlify](https://app.netlify.com)
2. Connectez-vous ou créez un compte
3. Si c'est votre premier site, vous verrez le dashboard

### Étape 2.3: Créer un nouveau site (si nécessaire)

**Option A: Via GitHub (Recommandé)**
1. Cliquez sur **"Add new site"** > **"Import an existing project"**
2. Connectez votre compte GitHub
3. Sélectionnez le repository contenant votre code
4. Cliquez sur **"Deploy site"**

**Option B: Via Netlify CLI**
1. Installez Netlify CLI: `npm install -g netlify-cli`
2. Dans votre dossier projet: `netlify init`
3. Suivez les instructions

**Option C: Drag & Drop**
1. Cliquez sur **"Add new site"** > **"Deploy manually"**
2. Glissez-déposez votre dossier (sans `node_modules`)

### Étape 2.4: Ajouter les variables d'environnement

1. Dans votre site Netlify, allez dans **"Site settings"** (en haut)
2. Dans le menu latéral, cliquez sur **"Environment variables"**
3. Cliquez sur **"Add a variable"**

#### Variable 1: GOOGLE_SERVICE_ACCOUNT_EMAIL
- **Key:** `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value:** Copiez la valeur de `client_email` du fichier JSON
  - Exemple: `noor-shine-orders@votre-projet.iam.gserviceaccount.com`
- Cliquez sur **"Save"**

#### Variable 2: GOOGLE_PRIVATE_KEY
- **Key:** `GOOGLE_PRIVATE_KEY`
- **Value:** Copiez TOUTE la valeur de `private_key` du fichier JSON
  - **Important:** Copiez tout, y compris `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`
  - Les `\n` dans le JSON seront automatiquement convertis en retours à la ligne par Netlify
  - Exemple complet:
    ```
    -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
    ```
- Cliquez sur **"Save"**

#### Variable 3: GOOGLE_SPREADSHEET_ID
- **Key:** `GOOGLE_SPREADSHEET_ID`
- **Value:** L'ID de votre feuille Google Sheets (celui que vous avez copié à l'étape 1.5)
  - Exemple: `1a2b3c4d5e6f7g8h9i0j`
- Cliquez sur **"Save"**

### Vérification

Vous devriez maintenant avoir 3 variables d'environnement:
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- ✅ `GOOGLE_PRIVATE_KEY`
- ✅ `GOOGLE_SPREADSHEET_ID`

---

## 3. Déploiement sur Netlify

### Option A: Déploiement via GitHub (Recommandé)

#### Étape 3.1: Préparer votre code

1. Créez un repository GitHub (si vous ne l'avez pas déjà)
2. Assurez-vous que tous vos fichiers sont commités:
   ```bash
   git add .
   git commit -m "Initial commit - NOOR & SHINE"
   git push origin main
   ```

#### Étape 3.2: Connecter à Netlify

1. Sur Netlify, cliquez sur **"Add new site"** > **"Import an existing project"**
2. Sélectionnez **"GitHub"** (ou GitLab/Bitbucket)
3. Autorisez Netlify à accéder à votre compte
4. Sélectionnez votre repository
5. Configurez les paramètres de build:
   - **Build command:** (laissez vide - pas de build nécessaire)
   - **Publish directory:** `.` (point)
6. Cliquez sur **"Deploy site"**

#### Étape 3.3: Vérifier le déploiement

1. Attendez que le déploiement se termine (environ 1-2 minutes)
2. Vous verrez un message "Site is live"
3. Cliquez sur l'URL pour voir votre site

### Option B: Déploiement via Netlify CLI

#### Étape 3.1: Installer Netlify CLI

```bash
npm install -g netlify-cli
```

#### Étape 3.2: Se connecter

```bash
netlify login
```
Cela ouvrira votre navigateur pour vous connecter.

#### Étape 3.3: Initialiser le site

```bash
cd "NOOR AND SHINE"  # Votre dossier projet
netlify init
```

Répondez aux questions:
- **Create & configure a new site:** Oui
- **Team:** Sélectionnez votre équipe
- **Site name:** (laissez vide pour un nom aléatoire, ou donnez un nom)
- **Build command:** (appuyez sur Entrée - pas de build)
- **Directory to deploy:** `.` (point)

#### Étape 3.4: Déployer

```bash
netlify deploy --prod
```

### Option C: Déploiement manuel (Drag & Drop)

1. Sur Netlify, cliquez sur **"Add new site"** > **"Deploy manually"**
2. Créez un fichier ZIP de votre projet (sans `node_modules`)
3. Glissez-déposez le fichier ZIP
4. Attendez le déploiement

**Note:** Cette méthode nécessite de redéployer manuellement à chaque changement.

---

## ✅ Vérification finale

### Tester votre déploiement

1. Visitez votre site Netlify (URL fournie après le déploiement)
2. Ajoutez des produits au panier
3. Passez une commande test
4. Vérifiez que la commande apparaît dans votre Google Sheet

### Vérifier les logs

Si quelque chose ne fonctionne pas:

1. Sur Netlify, allez dans **"Functions"** (menu latéral)
2. Cliquez sur **"submit-order"**
3. Allez dans l'onglet **"Logs"**
4. Vérifiez les erreurs éventuelles

### Problèmes courants

**Erreur: "Permission denied"**
- Vérifiez que la feuille Google Sheets est bien partagée avec l'email du compte de service
- Vérifiez que les permissions sont "Editor"

**Erreur: "Invalid credentials"**
- Vérifiez que `GOOGLE_PRIVATE_KEY` contient bien toute la clé (avec BEGIN/END)
- Vérifiez qu'il n'y a pas d'espaces supplémentaires

**Erreur: "Spreadsheet not found"**
- Vérifiez que `GOOGLE_SPREADSHEET_ID` est correct
- Vérifiez que la feuille existe toujours

**Les fonctions ne se déploient pas**
- Vérifiez que le dossier `netlify/functions/` est bien dans votre repository
- Vérifiez que `netlify.toml` est présent

---

## 🎉 Félicitations!

Votre site est maintenant déployé et les commandes seront automatiquement enregistrées dans Google Sheets!

### Prochaines étapes

- Personnalisez votre Google Sheet (formats, couleurs, etc.)
- Configurez des notifications par email (optionnel)
- Ajoutez d'autres fonctionnalités selon vos besoins

