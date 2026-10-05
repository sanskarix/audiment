# Firebase & Cloudinary Infrastructure Setup

This guide details cloud service setup for Firestore Database, Firebase Auth, and Cloudinary media processing.

---

## 🔥 Firebase Setup

### 1. Enable Firestore & Auth
* In the Firebase Console, create a new Firestore database in Production Mode.
* Enable **Email/Password** under Authentication > Sign-in method.

### 2. Deploy Firestore Indexes & Security Rules
Audiment uses `firestore.indexes.json` for composite queries:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## ☁️ Cloudinary Setup

### 1. Create Unsigned Upload Preset
1. Open Cloudinary Console > Settings > Upload.
2. Add a new **Unsigned Upload Preset** named `audiment_photos`.
3. Set Folder: `audiment/audits`.
4. Allowed Formats: `jpg, jpeg, png, webm, mp4`.

### 2. Enable HLS Streaming Transformation
1. Under Media Library > Settings, enable Video Transformations.
2. Select Adaptive Bitrate Streaming (HLS) for Flashmob 20-second video playback.
