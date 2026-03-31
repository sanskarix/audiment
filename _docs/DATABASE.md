# Audiment – Firebase Firestore Schema

## Overview
Firestore is a NoSQL document database. Data is organised in collections containing documents. Each document can have subcollections.

---

## Collection: users
One document per user. Created by admin when adding a new user.
```
users / {userId}
  - uid: string (matches Firebase Auth UID)
  - name: string
  - email: string
  - role: string (admin | manager | auditor)
  - organizationId: string
  - assignedLocations: array of locationIds (for managers)
  - managerId: string (for auditors – which manager they report to)
  - isActive: boolean
  - createdAt: timestamp
```

---

## Collection: organizations
One document per client business. Separates data between different restaurant groups.
```
organizations / {organizationId}
  - name: string
  - ownerName: string
  - email: string
  - createdAt: timestamp
```

---

## Collection: locations
One document per branch or outlet.
```
locations / {locationId}
  - organizationId: string
  - name: string
  - address: string
  - city: string
  - latitude: number
  - longitude: number
  - assignedManagerId: string
  - isActive: boolean
  - createdAt: timestamp
```

---

## Collection: auditTemplates
Master templates created by admin. Blueprint for actual audits.
```
auditTemplates / {templateId}
  - organizationId: string
  - title: string (e.g. Washroom Audit, Kitchen Audit)
  - category: string (hygiene | safety | inventory | custom)
  - description: string
  - isActive: boolean
  - createdBy: string (userId)
  - createdAt: timestamp

  Subcollection: questions / {questionId}
    - questionText: string
    - questionType: string (yes_no | rating)
    - maxScore: number (1 for yes_no | 10 for rating)
    - severity: string (low | medium | critical)
    - requiresPhoto: boolean
    - order: number (display order)
```

---

## Collection: audits
A published instance of a template assigned to a location.
```
audits / {auditId}
  - organizationId: string
  - templateId: string
  - templateTitle: string
  - locationId: string
  - locationName: string
  - publishedBy: string (adminUserId)
  - assignedManagerId: string
  - assignedAuditorId: string (set by manager)
  - status: string (published | assigned | in_progress | completed | missed)
  - isSurprise: boolean
  - deadline: timestamp
  - scheduledDate: timestamp
  - completedAt: timestamp
  - totalScore: number (calculated on completion)
  - maxPossibleScore: number
  - scorePercentage: number
  - createdAt: timestamp
```

---

## Collection: auditResponses
Every answer submitted by an auditor for an audit.
```
auditResponses / {responseId}
  - auditId: string
  - questionId: string
  - questionText: string
  - questionType: string
  - answer: string (yes | no | 0-10 rating)
  - score: number
  - severity: string
  - auditorId: string
  - locationId: string
  - latitude: number (geo-tag at time of submission)
  - longitude: number
  - submittedAt: timestamp
  - photoUrls: array of strings (Firebase Storage URLs)
  - notes: string (optional auditor note)
```

---

## Collection: correctiveActions
Auto-created when a critical question is failed in an audit.
```
correctiveActions / {actionId}
  - auditId: string
  - questionId: string
  - questionText: string
  - locationId: string
  - locationName: string
  - organizationId: string
  - assignedManagerId: string
  - description: string
  - severity: string
  - status: string (open | in_progress | resolved)
  - deadline: timestamp
  - resolvedAt: timestamp
  - resolutionNote: string
  - resolutionPhotoUrls: array of strings
  - createdAt: timestamp
```

---

## Collection: flashmobAudits
Separate from regular audits. Covert video-based audits.
```
flashmobAudits / {flashmobId}
  - organizationId: string
  - locationId: string
  - locationName: string
  - auditorId: string
  - auditorName: string
  - videoUrl: string (Firebase Storage URL)
  - selfieUrl: string
  - latitude: number
  - longitude: number
  - submittedAt: timestamp
  - visibleTo: array of userIds (only authorised viewers)
```

---

## Collection: notifications
System-generated alerts for all roles.
```
notifications / {notificationId}
  - organizationId: string
  - recipientId: string (userId)
  - recipientRole: string
  - type: string (audit_assigned | audit_missed | low_score | corrective_action | trend_alert | surprise_audit)
  - title: string
  - message: string
  - relatedId: string (auditId or correctiveActionId)
  - isRead: boolean
  - createdAt: timestamp
```

---

## Firestore Security Rules – Logic Summary
- Users can only read and write documents belonging to their organizationId
- Auditors can only read audits assigned to their userId
- Managers can only read locations assigned to their userId
- Only admins can create or modify templates, locations, and users
- All rules enforced server-side via Firestore Security Rules