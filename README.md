# NOOR & SHINE - Site E-commerce de Bijoux

Site e-commerce élégant pour la vente de bijoux en ligne avec intégration Google Sheets via Netlify Functions.

## Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration Google Sheets

#### Étape 1: Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Sheets pour votre projet

#### Étape 2: Créer un compte de service

1. Dans Google Cloud Console, allez dans **IAM & Admin** > **Service Accounts**
2. Cliquez sur **Create Service Account**
3. Donnez un nom (ex: "noor-shine-orders")
4. Cliquez sur **Create and Continue**
5. Accordez le rôle **Editor** (ou créez un rôle personnalisé avec accès Sheets)
6. Cliquez sur **Done**

#### Étape 3: Créer une clé JSON

1. Cliquez sur le compte de service créé
2. Allez dans l'onglet **Keys**
3. Cliquez sur **Add Key** > **Create new key**
4. Sélectionnez **JSON** et téléchargez le fichier

#### Étape 4: Créer une feuille Google Sheets

1. Créez une nouvelle feuille Google Sheets
2. Partagez-la avec l'email du compte de service (trouvé dans le fichier JSON: `client_email`)
3. Donnez les permissions **Editor** au compte de service
4. Copiez l'ID de la feuille depuis l'URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

#### Étape 5: Configurer les variables d'environnement sur Netlify

1. Allez sur votre site Netlify
2. Allez dans **Site settings** > **Environment variables**
3. Ajoutez les variables suivantes:

   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: L'email du compte de service (du fichier JSON)
   - `GOOGLE_PRIVATE_KEY`: La clé privée du fichier JSON (copiez tout le contenu, y compris `-----BEGIN PRIVATE KEY-----` et `-----END PRIVATE KEY-----`)
   - `GOOGLE_SPREADSHEET_ID`: L'ID de votre feuille Google Sheets

### 3. Déployer sur Netlify

#### Option 1: Via Netlify CLI

```bash
# Installer Netlify CLI globalement
npm install -g netlify-cli

# Se connecter à Netlify
netlify login

# Déployer
netlify deploy --prod
```

#### Option 2: Via GitHub

1. Poussez votre code sur GitHub
2. Connectez votre repository à Netlify
3. Netlify déploiera automatiquement

### 4. Tester localement (optionnel)

```bash
npm run dev
```

Cela démarre un serveur local avec Netlify Dev qui simule l'environnement Netlify.

## Structure du projet

- `index.html` - Page d'accueil
- `panier.html` - Page du panier
- `commande.html` - Page de commande
- `bagues.html`, `bracelets.html`, `colliers.html`, `boucles-oreilles.html` - Pages de catégories
- `netlify/functions/submit-order.js` - Fonction Netlify pour enregistrer les commandes
- `netlify.toml` - Configuration Netlify

## Fonctionnalités

- ✅ Affichage de produits par catégorie
- ✅ Panier avec gestion des quantités
- ✅ Calcul automatique de la livraison (gratuite si > 200 DH)
- ✅ Enregistrement des commandes dans Google Sheets via Netlify Functions
- ✅ Interface en français
- ✅ Prix en dirhams marocains (DH)

## API Endpoint

**POST** `/.netlify/functions/submit-order`

Envoie les données de commande au serveur pour enregistrement dans Google Sheets.

### Format de la requête

```json
{
  "firstName": "Prénom",
  "lastName": "Nom",
  "email": "email@example.com",
  "phone": "0612345678",
  "address": "Adresse",
  "city": "Ville",
  "postalCode": "12345",
  "country": "MA",
  "items": [
    {
      "name": "Bague Or Classique",
      "category": "Bagues",
      "price": 89.99,
      "quantity": 1
    }
  ],
  "subtotal": 89.99,
  "shipping": 30,
  "total": 119.99
}
```

## Notes importantes

- Les commandes sont enregistrées dans Google Sheets en temps réel
- Chaque commande reçoit un numéro unique (format: NOOR-{timestamp}-{random})
- Le fichier Google Sheets reste privé et accessible uniquement via votre compte Google
- Assurez-vous que les variables d'environnement sont correctement configurées sur Netlify

## Support

Pour toute question ou problème, vérifiez:
1. Que les variables d'environnement sont correctement configurées
2. Que le compte de service a accès à la feuille Google Sheets
3. Les logs Netlify Functions pour les erreurs

