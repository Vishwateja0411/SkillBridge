# SkillBridge — Data Models & Schemas

## Schemas & Relationships

### 1. User
- `id` (string, PK)
- `name` (string)
- `email` (string, Unique normalized)
- `passwordHash` (string, BCrypt)
- `role` ('freelancer' | 'business' | 'admin')
- `avatar` (string URL)
- `isVerified` (boolean)
- `createdAt` (ISO 8601 string)

### 2. FreelancerProfile
- `id` (string, PK)
- `userId` (string, FK -> User)
- `headline` (string)
- `bio` (string)
- `skills` (Array of { name: string, level: string, yearsExperience?: number })
- `hourlyRate` (number)
- `experienceLevel` ('entry' | 'intermediate' | 'expert')
- `availability` ('full_time' | 'part_time' | 'not_available')
- `rating` (number 1.0 - 5.0)
- `reviewCount` (number)
- `completedProjectsCount` (number)
- `portfolio` (Array of { id, title, description, category, skills, projectUrl, imageUrl, completedAt })
- `verificationStatus` ('unverified' | 'pending' | 'verified')

### 3. BusinessProfile
- `id` (string, PK)
- `userId` (string, FK -> User)
- `companyName` (string)
- `logo` (string URL)
- `industry` (string)
- `companySize` (string)
- `website` (string URL)
- `description` (string)
- `location` (string)
- `verified` (boolean)
- `totalSpent` (number)
- `activeContractsCount` (number)

### 4. Project
- `id` (string, PK)
- `businessId` (string, FK -> BusinessProfile)
- `title` (string)
- `description` (string)
- `category` (string)
- `requiredSkills` (string[])
- `experienceLevel` ('entry' | 'intermediate' | 'expert')
- `budgetType` ('fixed' | 'hourly')
- `budgetMin` (number)
- `budgetMax` (number)
- `duration` (string)
- `deadline` (string date)
- `workArrangement` ('remote' | 'onsite' | 'hybrid')
- `status` ('draft' | 'published' | 'in_progress' | 'completed' | 'paused' | 'closed')
- `proposalsCount` (number)

### 5. Proposal
- `id` (string, PK)
- `projectId` (string, FK -> Project)
- `freelancerId` (string, FK -> FreelancerProfile)
- `coverLetter` (string)
- `proposedPrice` (number)
- `estimatedDuration` (string)
- `milestoneProposals` (Array of { title, description, amount, estimatedDays })
- `status` ('submitted' | 'viewed' | 'shortlisted' | 'interview_requested' | 'accepted' | 'rejected' | 'withdrawn')
- `matchScore` (MatchBreakdown object with factors)

### 6. Contract & Milestone
- `Contract`: `id`, `projectId`, `businessId`, `freelancerId`, `proposalId`, `title`, `terms`, `totalAmount`, `status`, `milestones`, `startDate`, `completedDate`
- `Milestone`: `id`, `contractId`, `title`, `description`, `amount`, `dueDate`, `status` ('pending' | 'in_progress' | 'submitted' | 'revision_requested' | 'approved' | 'paid'), `deliverableUrl`, `deliverableNotes`, `revisionNotes`

### 7. Other Entities
- `Conversation` & `Message`: Real-time chat tracking.
- `Notification`: In-app notification alerts with read/unread states.
- `Review`: Verified feedback with 1-5 ratings.
- `Dispute`: Formal contract arbitration cases.
- `AuditLog`: Security log of administrative operations.
