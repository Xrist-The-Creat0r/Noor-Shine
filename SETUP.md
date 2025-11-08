# Guide de Configuration Rapide - Netlify + Google Sheets

## Configuration Google Sheets (5 minutes)

### 1. Créer le projet Google Cloud

1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet: **NOOR & SHINE Orders**
3. Activez l'API **Google Sheets API**

### 2. Créer le compte de service

1. **IAM & Admin** > **Service Accounts**
2. **Create Service Account**
3. Nom: `noor-shine-orders`
4. Rôle: **Editor**
5. **Done**

### 3. Télécharger la clé JSON

1. Cliquez sur le compte créé
2. **Keys** > **Add Key** > **Create new key**
3. Format: **JSON**
4. Téléchargez le fichier (gardez-le secret!)

### 4. Créer la feuille Google Sheets

1. Créez une nouvelle feuille: https://sheets.google.com
2. Partagez-la avec l'email du compte de service (dans le JSON: `client_email`)
3. Permissions: **Editor**
4. Copiez l'ID depuis l'URL:
   ```
   https://docs.google.com/spreadsheets/d/[VOICI_L_ID]/edit
   ```

### 5. Configurer Netlify

1. Allez sur https://app.netlify.com
2. Votre site > **Site settings** > **Environment variables**
3. Ajoutez:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = (email du compte de service)
GOOGLE_PRIVATE_KEY = (clé privée complète du JSON)
GOOGLE_SPREADSHEET_ID = (ID de votre feuille)
```

**Important pour GOOGLE_PRIVATE_KEY:**
- Copiez TOUT le contenu de la clé privée du JSON
- Incluez `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`
- Si vous copiez depuis Netlify UI, les `\n` seront automatiquement gérés

## Déploiement

### Option 1: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Option 2: GitHub

1. Poussez le code sur GitHub
2. Connectez le repo à Netlify
3. Netlify déploie automatiquement

## Test

1. Ajoutez des produits au panier
2. Passez une commande
3. Vérifiez que la commande apparaît dans votre Google Sheet!

## Dépannage

**Erreur: "Permission denied"**
- Vérifiez que la feuille est partagée avec l'email du compte de service

**Erreur: "Invalid credentials"**
- Vérifiez que GOOGLE_PRIVATE_KEY contient bien toute la clé (avec BEGIN/END)

**Erreur: "Spreadsheet not found"**
- Vérifiez que GOOGLE_SPREADSHEET_ID est correct

**Les commandes ne s'enregistrent pas**
- Vérifiez les logs Netlify Functions dans le dashboard

