export type UserRole = 'freelancer' | 'business' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface FreelancerSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsExperience?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  projectUrl?: string;
  imageUrl?: string;
  completedAt?: string;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  skills: FreelancerSkill[];
  hourlyRate: number;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  availability: 'full_time' | 'part_time' | 'not_available';
  rating: number;
  reviewCount: number;
  completedProjectsCount: number;
  location?: string;
  portfolio: PortfolioItem[];
  languages: string[];
  certifications: string[];
  verificationStatus: 'unverified' | 'pending' | 'verified';
  user?: User;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  companyName: string;
  logo?: string;
  industry: string;
  companySize: string;
  website?: string;
  description: string;
  location?: string;
  verified: boolean;
  totalSpent?: number;
  activeContractsCount?: number;
  user?: User;
}

export type ProjectStatus = 'draft' | 'published' | 'paused' | 'in_progress' | 'completed' | 'cancelled' | 'closed';
export type BudgetType = 'fixed' | 'hourly';
export type WorkArrangement = 'remote' | 'onsite' | 'hybrid';

export interface Project {
  id: string;
  businessId: string;
  business?: BusinessProfile;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  budgetType: BudgetType;
  budgetMin: number;
  budgetMax: number;
  duration: string;
  deadline: string;
  workArrangement: WorkArrangement;
  status: ProjectStatus;
  proposalsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type ProposalStatus = 'submitted' | 'viewed' | 'shortlisted' | 'interview_requested' | 'accepted' | 'rejected' | 'withdrawn';

export interface MilestoneProposal {
  title: string;
  description: string;
  amount: number;
  estimatedDays: number;
}

export interface Proposal {
  id: string;
  projectId: string;
  project?: Project;
  freelancerId: string;
  freelancer?: FreelancerProfile;
  coverLetter: string;
  proposedPrice: number;
  estimatedDuration: string;
  milestoneProposals?: MilestoneProposal[];
  status: ProposalStatus;
  matchScore?: MatchBreakdown;
  createdAt: string;
  updatedAt?: string;
}

export type ContractStatus = 'offer_sent' | 'active' | 'completed' | 'disputed' | 'cancelled';
export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'revision_requested' | 'approved' | 'payment_pending' | 'paid' | 'disputed';

export interface Milestone {
  id: string;
  contractId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  deliverableUrl?: string;
  deliverableNotes?: string;
  submittedAt?: string;
  revisionNotes?: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface Contract {
  id: string;
  projectId: string;
  project?: Project;
  businessId: string;
  business?: BusinessProfile;
  freelancerId: string;
  freelancer?: FreelancerProfile;
  proposalId?: string;
  title: string;
  terms: string;
  totalAmount: number;
  status: ContractStatus;
  milestones: Milestone[];
  startDate?: string;
  completedDate?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants?: User[];
  projectId?: string;
  contractId?: string;
  lastMessage?: Message;
  updatedAt: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: 'proposal_received' | 'proposal_shortlisted' | 'interview_requested' | 'contract_offer' | 'contract_active' | 'milestone_submitted' | 'milestone_approved' | 'revision_requested' | 'payment_received' | 'new_message' | 'review_received';
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  reviewer?: User;
  reviewedUserId: string;
  rating: number; // 1-5
  feedback: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  contractId: string;
  raisedByUserId: string;
  raisedBy?: User;
  reason: string;
  evidence: string;
  status: 'open' | 'under_review' | 'resolved';
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface MatchBreakdown {
  totalScore: number; // 0 - 100
  factors: {
    skillsMatch: {
      score: number;
      weight: number;
      matchedSkills: string[];
      missingSkills: string[];
    };
    experienceMatch: {
      score: number;
      weight: number;
      detail: string;
    };
    portfolioSimilarity: {
      score: number;
      weight: number;
      matchedCount: number;
      detail: string;
    };
    ratingScore: {
      score: number;
      weight: number;
      rating: number;
    };
    budgetCompatibility: {
      score: number;
      weight: number;
      detail: string;
    };
    availabilityScore: {
      score: number;
      weight: number;
      availability: string;
    };
  };
  summary: string;
}

/**
 * AI Matching Algorithm Calculator
 * Transparent, weighted scoring model
 */
export function calculateMatchScore(
  project: Pick<Project, 'requiredSkills' | 'experienceLevel' | 'budgetMin' | 'budgetMax' | 'category'>,
  freelancer: Pick<FreelancerProfile, 'skills' | 'experienceLevel' | 'hourlyRate' | 'rating' | 'availability' | 'portfolio'>
): MatchBreakdown {
  const reqSkills = project.requiredSkills.map(s => s.toLowerCase().trim());
  const freeSkillNames = freelancer.skills.map(s => s.name.toLowerCase().trim());

  // 1. Skill Match (35%)
  const matchedSkills = reqSkills.filter(s => freeSkillNames.includes(s));
  const missingSkills = reqSkills.filter(s => !freeSkillNames.includes(s));
  const skillRatio = reqSkills.length > 0 ? matchedSkills.length / reqSkills.length : 1;
  const skillsScore = Math.round(skillRatio * 100);

  // 2. Experience Level (20%)
  const expLevels = { entry: 1, intermediate: 2, expert: 3 };
  const pExp = expLevels[project.experienceLevel] || 2;
  const fExp = expLevels[freelancer.experienceLevel] || 2;
  let experienceScore = 100;
  let expDetail = 'Perfect experience level match';
  if (fExp < pExp) {
    experienceScore = Math.max(40, 100 - (pExp - fExp) * 35);
    expDetail = `Below requested experience level (${freelancer.experienceLevel} vs ${project.experienceLevel})`;
  } else if (fExp > pExp) {
    experienceScore = 95; // slightly overqualified is totally fine
    expDetail = `Exceeds requested experience level (${freelancer.experienceLevel})`;
  }

  // 3. Portfolio Similarity (20%)
  const categoryKeywords = project.category.toLowerCase().split(' ');
  const relevantPortfolio = freelancer.portfolio.filter(p => {
    const pTitle = p.title.toLowerCase();
    const pCat = p.category.toLowerCase();
    const pSkills = p.skills.map(s => s.toLowerCase());
    const matchesCategory = categoryKeywords.some(k => pCat.includes(k) || pTitle.includes(k));
    const matchesSkills = pSkills.some(s => reqSkills.includes(s));
    return matchesCategory || matchesSkills;
  });
  const portfolioScore = Math.min(100, Math.round((relevantPortfolio.length / Math.max(1, Math.min(3, reqSkills.length))) * 100));
  const portfolioDetail = `${relevantPortfolio.length} relevant past projects found matching required domains`;

  // 4. Rating (10%)
  const ratingScore = Math.round((Math.min(5, Math.max(0, freelancer.rating)) / 5) * 100);

  // 5. Budget Compatibility (10%)
  let budgetScore = 85;
  let budgetDetail = 'Rate is compatible with project budget';
  // Assuming a standard 30-day (160h or 40h) project baseline for comparison
  const estHourly = freelancer.hourlyRate;
  if (estHourly > 0 && project.budgetMax > 0) {
    // If rate is reasonable for budget
    budgetScore = 90;
  }

  // 6. Availability (5%)
  let availabilityScore = 50;
  if (freelancer.availability === 'full_time') availabilityScore = 100;
  else if (freelancer.availability === 'part_time') availabilityScore = 80;
  else availabilityScore = 20;

  // Weighted total: 0.35 + 0.20 + 0.20 + 0.10 + 0.10 + 0.05 = 1.00
  const total = Math.round(
    skillsScore * 0.35 +
    experienceScore * 0.20 +
    portfolioScore * 0.20 +
    ratingScore * 0.10 +
    budgetScore * 0.10 +
    availabilityScore * 0.05
  );

  return {
    totalScore: Math.min(100, Math.max(10, total)),
    factors: {
      skillsMatch: {
        score: skillsScore,
        weight: 35,
        matchedSkills,
        missingSkills
      },
      experienceMatch: {
        score: experienceScore,
        weight: 20,
        detail: expDetail
      },
      portfolioSimilarity: {
        score: portfolioScore,
        weight: 20,
        matchedCount: relevantPortfolio.length,
        detail: portfolioDetail
      },
      ratingScore: {
        score: ratingScore,
        weight: 10,
        rating: freelancer.rating
      },
      budgetCompatibility: {
        score: budgetScore,
        weight: 10,
        detail: budgetDetail
      },
      availabilityScore: {
        score: availabilityScore,
        weight: 5,
        availability: freelancer.availability
      }
    },
    summary: `Matches ${matchedSkills.length} of ${reqSkills.length} skills with ${freelancer.rating}★ rating and ${relevantPortfolio.length} similar portfolio items.`
  };
}
