# Flash Verification (Flashmob) Studio

**Flash Verification (Flashmob)** is Audiment's covert, unannounced video-based presence audit designed to eliminate remote inspection fraud ("pencil-whipping").

---

## 🔍 How Flash Verification Works

Unlike regular checklist audits, a Flashmob audit requires the field worker to capture an unedited live video of their physical surroundings along with a verified selfie inside the browser.

```
+---------------------------------------------------------------------------------+
|                       FLASH VERIFICATION (FLASHMOB) FLOW                        |
|                                                                                 |
|  1. Select Outlet   -->   2. 20s Surroundings   -->   3. Face Guide   -->  4. Upload |
|     (Target Node)            Video Sweep              Circular Selfie      + GPS Lock  |
|                                [ REC 00:20 ]           Viewfinder                      |
+---------------------------------------------------------------------------------+
```

---

## 🎬 Step-by-Step Execution Lifecycle

### 1. Permission Gate & Location Selection
* Only auditors with `flashmobAccess: true` on their Firestore user document can see the Flashmob button.
* The auditor selects their target branch/location from a dropdown menu.

### 2. Live Environmental Video Capture (20 Seconds)
* The browser initializes the device camera via the HTML5 `MediaRecorder` API.
* An animated **REC** indicator and a 20-second countdown timer display on screen.
* The auditor pans the camera around the branch interior to prove physical presence.
* MediaRecorder records using candidate MIME types for maximum browser compatibility (`video/webm;codecs=vp9`, `video/webm`, or `video/mp4`).

### 3. Video Review
* Upon timer completion, the auditor previews the recorded video snippet.
* If unsatisfied or interrupted, they can discard and re-record.

### 4. Circular "Face Guide" Selfie Verification
* A circular viewfinder overlay displays on screen.
* The auditor aligns their face inside the viewfinder guide and captures a high-resolution selfie snapshot.

### 5. Immutable GPS Lock & Server Upload
* The device captures high-accuracy GPS coordinates (`latitude`, `longitude`).
* The video file and selfie photo are uploaded to Cloudinary.
* A document is created in the `flashmobAudits` collection.

---

## 🔒 Restricted Admin Review Studio

Flashmob audits do **NOT** display in the public audit queue. They are restricted covert records.

* **Path:** `/dashboard/admin/flashmob`
* **Access Rule:** Visible only to Admins and users explicitly listed in the `visibleTo` array.
* **Review UI Components:**
  * **Video Player:** Plays full 20-second sweep with HLS streaming support.
  * **Face Match Card:** Displays verified selfie alongside auditor profile details.
  * **Interactive Map:** Renders exact GPS pin location at submission time.
