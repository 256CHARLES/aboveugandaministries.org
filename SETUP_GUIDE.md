# Above Uganda — Backend Setup Guide

Everything is **free**. No monthly costs. No server needed.

---

## Step 1 — Set up Firebase (10 minutes)

Firebase is Google's free database. It stores your contact messages and newsletter subscribers.

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → name it `above-uganda` → click through and hit **Create project**
3. In the left sidebar click **Firestore Database** → **Create database**
   - Choose **"Start in test mode"** (allows reading & writing)
   - Pick any region (e.g. `europe-west1`) → click **Enable**
4. Click the **gear icon ⚙** (top left) → **Project settings**
5. Scroll down to **"Your apps"** → click **</>** (Web icon)
   - Give it a nickname e.g. `above-uganda-web` → click **Register app**
   - You will see a `firebaseConfig` block like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "above-uganda.firebaseapp.com",
  projectId: "above-uganda",
  storageBucket: "above-uganda.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Open **`script.js`** and paste each value into the `FIREBASE_CONFIG` block at the top of the file.

---

## Step 2 — Connect the Admin Panel to Firebase

The admin panel (the one built in Claude chat) reads from the same Firebase project.

In the admin panel widget, at the top of the `<script>` tag, add your `projectId`:

```js
// Replace this line:
const db = null;

// With your actual Firebase config (same as above)
```

> **Tip:** For now the admin panel uses browser storage which is fine for testing. To connect it fully to Firebase, ask Claude to "update the admin panel to use Firebase with projectId: your-project-id".

---

## Step 3 — Host the website free on Netlify (5 minutes)

1. Go to **https://netlify.com** → Sign up free (use your Gmail)
2. Once logged in, click **"Add new site"** → **"Deploy manually"**
3. Drag and drop your **entire website folder** (containing `index.html`, `style.css`, `script.js`, `gallery.js`) onto the deploy box
4. Netlify gives you a free URL like `https://above-uganda.netlify.app` — you can customise this
5. Every time you update files, just drag and drop again to redeploy

---

## Step 4 — Test it works

1. Open your Netlify URL
2. Fill in the **Contact form** and submit
3. Fill in the **Newsletter** form and subscribe
4. Go to your Firebase Console → Firestore Database → you should see:
   - A `messages` collection with your test message
   - A `subscribers` collection with your test email
5. Open the **Admin Panel** (the one in Claude chat) → Inbox and Subscribers tabs should show the data

---

## Collections created automatically in Firestore

| Collection | What it stores |
|---|---|
| `messages` | Contact form submissions (name, email, message, date, read status) |
| `subscribers` | Newsletter signups (email, date) |

---

## Costs

| Service | Free tier | Limit |
|---|---|---|
| Firebase Firestore | Free forever | 1GB storage, 50K reads/day, 20K writes/day |
| Netlify Hosting | Free forever | 100GB bandwidth/month |

Both limits are far beyond what a small NGO website needs.

---

## Need help?

Email: aboveugandaministries@gmail.com  
Or ask Claude to help with any step!
