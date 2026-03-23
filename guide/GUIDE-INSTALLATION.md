# InstaGrid — Guide d'installation complet

> **Temps estimé : 15 minutes**
> Aucune compétence technique requise.

---

## Ce dont tu as besoin

- Un compte **Notion** gratuit → [notion.so](https://notion.so)
- Un compte **Vercel** gratuit → [vercel.com](https://vercel.com)
- Un compte **GitHub** gratuit → [github.com](https://github.com)

---

## Étape 1 — Créer ton intégration Notion

L'intégration permet à ton site de lire ta base de données Notion.

1. Va sur [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique sur **"+ New integration"**

   > 📸 *[Insérer capture : bouton New integration]*

3. Remplis le formulaire :
   - **Name** : `instagrid` (ou ce que tu veux)
   - **Associated workspace** : sélectionne ton workspace
   - Laisse le reste par défaut

4. Clique **"Save"**

5. Sur la page suivante, copie le **"Internal Integration Secret"**
   - Il ressemble à : `secret_AbCdEfGhIjKlMnOpQrStUvWxYz`
   - ⚠️ **Garde-le bien, tu en auras besoin à l'étape 4**

   > 📸 *[Insérer capture : copier le token]*

---

## Étape 2 — Créer ta base de données Notion

1. Ouvre **Notion** et crée une nouvelle page
2. Tape `/database` et sélectionne **"Database - Full page"**

   > 📸 *[Insérer capture : créer database]*

3. Nomme-la comme tu veux (ex: `Mon Feed Instagram`)

4. Configure les colonnes exactement comme ci-dessous :

   | Nom de la colonne | Type à choisir |
   |-------------------|----------------|
   | `Name` | Title (déjà présent) |
   | `Caption` | Text |
   | `Date` | Date |
   | `Image` | Files & media |
   | `Type` | Select |

   > 📸 *[Insérer capture : colonnes configurées]*

5. Pour la colonne **Type**, ajoute ces options :
   - `post`
   - `reel`
   - `carousel`

---

## Étape 3 — Connecter l'intégration à ta base de données

Sans cette étape, le site ne pourra pas lire tes données.

1. Ouvre ta base de données en pleine page
2. Clique sur **`...`** (trois points) en haut à droite
3. Clique sur **"Connections"**
4. Cherche ton intégration **`instagrid`** et clique dessus

   > 📸 *[Insérer capture : ajouter connexion]*

5. Confirme en cliquant **"Confirm"**

---

## Étape 4 — Récupérer l'ID de ta base de données

1. Ouvre ta base de données en pleine page dans le navigateur
2. Regarde l'URL dans la barre d'adresse :
   ```
   https://www.notion.so/monworkspace/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX?v=...
   ```
3. Copie la partie en **X** (32 caractères, sans tirets)
   - ⚠️ **Prends bien l'ID avant le `?v=`**

   > 📸 *[Insérer capture : URL avec ID surligné]*

---

## Étape 5 — Déployer sur Vercel

1. Va sur le lien de déploiement fourni avec ton achat
2. Connecte ton compte **GitHub** si ce n'est pas déjà fait
3. Clique **"Deploy"**

   > 📸 *[Insérer capture : page Vercel deploy]*

4. Vercel va te demander de remplir ces champs :

   | Champ | Valeur à entrer |
   |-------|----------------|
   | `NOTION_TOKEN` | Le token copié à l'étape 1 |
   | `NOTION_DATABASE_ID` | L'ID copié à l'étape 4 |
   | `PROFILE_NAME` | Ton nom d'utilisateur |
   | `PROFILE_IMAGE_URL` | URL de ta photo de profil |
   | `PROFILE_BIO` | Ta bio (texte libre) |
   | `PROFILE_FOLLOWERS` | Nombre de followers (ex: `1.2k`) |
   | `PROFILE_FOLLOWING` | Nombre de following (ex: `420`) |

   > 💡 Seuls `NOTION_TOKEN` et `NOTION_DATABASE_ID` sont obligatoires.

5. Clique **"Deploy"** et attends ~2 minutes

   > 📸 *[Insérer capture : déploiement en cours]*

6. Ton site est en ligne ! Vercel te donne une URL du type :
   `https://instagrid-xxx.vercel.app`

---

## Étape 6 — Ajouter tes premiers posts

1. Retourne dans ta base de données Notion
2. Clique **"+ New"** pour créer une entrée
3. Remplis les champs :
   - **Name** : titre du post
   - **Caption** : description / légende
   - **Date** : date de publication
   - **Image** : glisse-dépose ton image
   - **Type** : sélectionne `post`, `reel` ou `carousel`

4. Retourne sur ton site → les posts apparaissent automatiquement !

   > 💡 Le site se met à jour toutes les **60 secondes**.

---

## Modifier ton profil

Pour changer ton nom, bio ou photo de profil :

1. Va sur [vercel.com](https://vercel.com) → ton projet
2. **Settings** → **Environment Variables**
3. Modifie les valeurs souhaitées
4. Va dans **Deployments** → clique **"Redeploy"**

---

## Problèmes fréquents

### ❌ "Could not find database"
→ Tu as oublié l'étape 3 (connecter l'intégration). Recommence l'étape 3.

### ❌ "Missing NOTION_TOKEN or NOTION_DATABASE_ID"
→ Les variables ne sont pas bien enregistrées sur Vercel. Vérifie l'étape 5 et redéploie.

### ❌ Les images ne s'affichent pas
→ Les images uploadées directement dans Notion expirent après 1 heure. Utilise des images hébergées en ligne (Imgur, Cloudinary, etc.) et entre leur URL dans le champ Image.

### ❌ Les posts n'apparaissent pas
→ Attends 60 secondes et recharge la page. Si toujours rien, vérifie que les colonnes de ta base de données ont exactement les mêmes noms qu'à l'étape 2.

---

## Support

Un problème ? Contacte-moi via Etsy et je t'aide dans les 24h. 🙌
