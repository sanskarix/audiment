# Firestore Database Schema & Rules Reference

Audiment uses Firebase Firestore as its primary document store. This reference details all top-level collections, subcollections, fields, data types, and index requirements.

---

## 🗄️ Collections Overview

```
Firestore Database Root
├── users/                # User profiles & role assignments
├── organizations/        # Organization client accounts
├── locations/            # Outlet branches / nodes
├── auditTemplates/       # Master blueprints & subcollection questions
│   └── questions/
├── audits/               # Published/Completed audit instances
├── auditResponses/       # Submitted per-question evidence & scores
├── correctiveActions/    # CAPA resolution items & photo proof
├── flashmobAudits/       # Covert video presence recordings
└── notifications/        # In-app user notifications
```

---

## 📄 Detailed Schema Definitions

### 1. `users/{userId}`
```typescript
interface UserDocument {
  uid: string;                 // Matches Firebase Auth UID
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'auditor';
  organizationId: string;
  assignedLocations?: string[];// Location IDs (for managers)
  managerId?: string;          // Supervisor ID (for auditors)
  flashmobAccess?: boolean;    // Flashmob permission flag
  isActive: boolean;
  createdAt: Timestamp;
}
```

### 2. `organizations/{organizationId}`
```typescript
interface OrganizationDocument {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  createdAt: Timestamp;
}
```

### 3. `locations/{locationId}`
```typescript
interface LocationDocument {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  assignedManagerIds: string[];
  isActive: boolean;
  createdAt: Timestamp;
}
```

### 4. `auditTemplates/{templateId}`
```typescript
interface AuditTemplateDocument {
  id: string;
  organizationId: string;
  title: string;
  category: 'hygiene' | 'safety' | 'inventory' | 'custom';
  description: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Timestamp;
}

// Subcollection: auditTemplates/{templateId}/questions/{questionId}
interface QuestionDocument {
  id: string;
  questionText: string;
  questionType: 'yes_no' | 'rating_10';
  maxScore: number;            // 1 for yes_no, 10 for rating
  severity: 'low' | 'medium' | 'critical';
  requiresPhoto: boolean;
  order: number;
}
```

### 5. `audits/{auditId}`
```typescript
interface AuditDocument {
  id: string;
  organizationId: string;
  templateId: string;
  templateTitle: string;
  locationId: string;
  locationName: string;
  publishedBy: string;
  assignedManagerId: string;
  assignedAuditorId?: string;
  status: 'published' | 'assigned' | 'in_progress' | 'completed' | 'missed';
  isSurprise: boolean;
  deadline: Timestamp;
  scheduledDate: Timestamp;
  completedAt?: Timestamp;
  totalScore?: number;
  maxPossibleScore?: number;
  scorePercentage?: number;
  grade?: 'excellent' | 'good' | 'needs_improvement' | 'fail' | 'critical_fail';
  hasCriticalFailure?: boolean;
  criticalFailureCount?: number;
  scoringVersion?: string;
  createdAt: Timestamp;
}
```

### 6. `auditResponses/{responseId}`
```typescript
interface AuditResponseDocument {
  id: string;
  auditId: string;
  questionId: string;
  questionText: string;
  questionType: 'yes_no' | 'rating_10';
  answer: 'Yes' | 'No' | number;
  score: number;
  severity: 'low' | 'medium' | 'critical';
  auditorId: string;
  locationId: string;
  latitude: number;
  longitude: number;
  photoUrls: string[];
  notes?: string;
  submittedAt: Timestamp;
}
```

### 7. `correctiveActions/{actionId}`
```typescript
interface CorrectiveActionDocument {
  id: string;
  auditId: string;
  questionId: string;
  questionText: string;
  locationId: string;
  locationName: string;
  organizationId: string;
  assignedManagerId: string;
  description: string;
  severity: 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  deadline: Timestamp;           // 48 hours from creation
  resolvedAt?: Timestamp;
  resolutionNote?: string;
  resolutionPhotoUrls?: string[];
  lastDeadlineReminderSentAt?: Timestamp;
  createdAt: Timestamp;
}
```

### 8. `flashmobAudits/{flashmobId}`
```typescript
interface FlashmobAuditDocument {
  id: string;
  organizationId: string;
  locationId: string;
  locationName: string;
  auditorId: string;
  auditorName: string;
  videoUrl: string;
  selfieUrl: string;
  latitude: number;
  longitude: number;
  visibleTo: string[];           // Restricted viewer user IDs
  submittedAt: Timestamp;
}
```

### 9. `notifications/{notificationId}`
```typescript
interface NotificationDocument {
  id: string;
  organizationId: string;
  recipientId: string;
  recipientRole: 'admin' | 'manager' | 'auditor';
  type: 'audit_assigned' | 'audit_missed' | 'low_score' | 'corrective_action' | 'trend_alert' | 'surprise_audit';
  title: string;
  message: string;
  relatedId?: string;            // auditId or correctiveActionId
  isRead: boolean;
  createdAt: Timestamp;
}
```
