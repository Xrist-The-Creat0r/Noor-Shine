# 🚀 Guide Rapide - 10 Minutes

## Étape 1: Google Sheets API (5 min)

### 1.1 Créer le projet
1. https://console.cloud.google.com/
2. Nouveau projet → "NOOR & SHINE Orders"

### 1.2 Activer l'API
1. APIs & Services → Library
2. Chercher "Google Sheets API" → Enable

### 1.3 Créer le compte de service
1. APIs & Services → Credentials
2. Create Credentials → Service account
3. Nom: `noor-shine-orders`
4. Rôle: Editor
5. Create → Done

### 1.4 Télécharger la clé
1. Cliquez sur le compte créé
2. Keys → Add Key → Create new key → JSON
3. Téléchargez le fichier

### 1.5 Créer la feuille
1. https://sheets.google.com → Nouvelle feuille
2. Share → Email du compte de service → Editor
3. Copiez l'ID depuis l'URL:
   ```
   .../spreadsheets/d/[ID_ICI]/edit
   ```

---

## Étape 2: Variables Netlify (2 min)

1. https://app.netlify.com → Votre site → Site settings
2. Environment variables → Add a variable

**Variable 1:**
- Key: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- Value: `client_email` du JSON

**Variable 2:**
- Key: `GOOGLE_PRIVATE_KEY`
- Value: `private_key` du JSON (TOUT, avec BEGIN/END)

**Variable 3:**
- Key: `GOOGLE_SPREADSHEET_ID`
- Value: ID de votre feuille

---

## Étape 3: Déployer (3 min)

### Via GitHub (Recommandé)
```bash
git add .
git commit -m "Deploy to Netlify"
git push
```
Puis sur Netlify: Add new site → Import from Git → GitHub → Sélectionnez votre repo

### Via CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## ✅ Test

1. Visitez votre site Netlify
2. Ajoutez un produit au panier
3. Passez une commande
4. Vérifiez votre Google Sheet!

---

## 🆘 Problème?

**Erreur de permissions?**
→ Vérifiez que la feuille est partagée avec l'email du compte de service

**Erreur de credentials?**
→ Vérifiez que GOOGLE_PRIVATE_KEY contient toute la clé

**Fonction ne fonctionne pas?**
→ Vérifiez les logs: Netlify → Functions → submit-order → Logs

