# 🚀 Deployment Guide for Sticky Discipline

## Step 1: Firebase Setup
1. Go to https://console.firebase.google.com/
2. Create a new project or use existing
3. Enable **Authentication** → **Email/Password** and **Google**
4. Enable **Firestore Database** (start in test mode for development)
5. Go to **Project Settings** → **General** → **Your apps** → **Web app**
6. Copy the Firebase config object

## Step 2: Vercel Environment Variables
Go to your Vercel dashboard:
- Project → **Settings** → **Environment Variables**

Add ALL of these (with `NEXT_PUBLIC_` prefix):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-from-firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 3: Deploy to Vercel
```bash
# Link your GitHub repo
npx vercel@latest

# Or use the Vercel CLI
vercel --prod
```

## Step 4: Verify
After deployment, check:
1. `https://your-project.vercel.app` loads correctly
2. Sign up / login works
3. Firestore database receives data

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
→ Your Firebase API key is wrong or not set in Vercel env vars

### Build succeeds but runtime errors
→ Make sure `NEXT_PUBLIC_` prefix is used for all Firebase vars in Vercel

### CORS errors
→ Add your Vercel URL to Firebase Auth → Authorized domains

### Firestore permission denied
→ Update Firestore security rules in Firebase Console
