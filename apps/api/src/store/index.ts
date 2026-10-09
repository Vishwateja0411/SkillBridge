import fs from 'fs';
import path from 'path';
import {
  User,
  FreelancerProfile,
  BusinessProfile,
  Project,
  Proposal,
  Contract,
  Milestone,
  Conversation,
  Message,
  Notification,
  Review,
  Dispute,
  AuditLog,
  calculateMatchScore,
} from '@skillbridge/shared';
import {
  SEED_USERS,
  SEED_BUSINESS_PROFILES,
  SEED_FREELANCER_PROFILES,
  SEED_PROJECTS,
  SEED_PROPOSALS,
  SEED_CONTRACTS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
  SEED_REVIEWS,
  SEED_AUDIT_LOGS,
} from '../seed/seedData.js';

interface DatabaseData {
  users: (User & { passwordHash: string })[];
  freelancerProfiles: FreelancerProfile[];
  businessProfiles: BusinessProfile[];
  projects: Project[];
  proposals: Proposal[];
  contracts: Contract[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  reviews: Review[];
  disputes: Dispute[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'store.json');

class Store {
  private data: DatabaseData;

  constructor() {
    this.data = this.loadData();
    this.ensureCalculatedMatchScores();
  }

  private loadData(): DatabaseData {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed to read persisted store.json, reinitializing from seed data:', err);
    }

    return this.getInitialSeedData();
  }

  private getInitialSeedData(): DatabaseData {
    return {
      users: JSON.parse(JSON.stringify(SEED_USERS)),
      freelancerProfiles: JSON.parse(JSON.stringify(SEED_FREELANCER_PROFILES)),
      businessProfiles: JSON.parse(JSON.stringify(SEED_BUSINESS_PROFILES)),
      projects: JSON.parse(JSON.stringify(SEED_PROJECTS)),
      proposals: JSON.parse(JSON.stringify(SEED_PROPOSALS)),
      contracts: JSON.parse(JSON.stringify(SEED_CONTRACTS)),
      conversations: JSON.parse(JSON.stringify(SEED_CONVERSATIONS)),
      messages: JSON.parse(JSON.stringify(SEED_MESSAGES)),
      notifications: JSON.parse(JSON.stringify(SEED_NOTIFICATIONS)),
      reviews: JSON.parse(JSON.stringify(SEED_REVIEWS)),
      disputes: [],
      auditLogs: JSON.parse(JSON.stringify(SEED_AUDIT_LOGS)),
    };
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write store to disk:', err);
    }
  }

  public resetToSeed() {
    this.data = this.getInitialSeedData();
    this.ensureCalculatedMatchScores();
    this.save();
  }

  private ensureCalculatedMatchScores() {
    for (const prop of this.data.proposals) {
      const project = this.data.projects.find((p) => p.id === prop.projectId);
      const freelancer = this.data.freelancerProfiles.find((f) => f.id === prop.freelancerId);
      if (project && freelancer) {
        prop.matchScore = calculateMatchScore(project, freelancer);
      }
    }
  }

  // --- Users ---
  getUsers() {
    return this.data.users;
  }
  getUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }
  getUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(user: User & { passwordHash: string }) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  updateUser(id: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  // --- Freelancer Profiles ---
  getFreelancerProfiles() {
    return this.data.freelancerProfiles.map((fp) => ({
      ...fp,
      user: this.getUserById(fp.userId),
    }));
  }
  getFreelancerProfileById(id: string) {
    const fp = this.data.freelancerProfiles.find((f) => f.id === id);
    if (!fp) return null;
    return { ...fp, user: this.getUserById(fp.userId) };
  }
  getFreelancerProfileByUserId(userId: string) {
    const fp = this.data.freelancerProfiles.find((f) => f.userId === userId);
    if (!fp) return null;
    return { ...fp, user: this.getUserById(fp.userId) };
  }
  createFreelancerProfile(profile: FreelancerProfile) {
    this.data.freelancerProfiles.push(profile);
    this.save();
    return profile;
  }
  updateFreelancerProfile(id: string, updates: Partial<FreelancerProfile>) {
    const idx = this.data.freelancerProfiles.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.data.freelancerProfiles[idx] = { ...this.data.freelancerProfiles[idx], ...updates };
      this.save();
      return this.getFreelancerProfileById(id);
    }
    return null;
  }

  // --- Business Profiles ---
  getBusinessProfiles() {
    return this.data.businessProfiles.map((bp) => ({
      ...bp,
      user: this.getUserById(bp.userId),
    }));
  }
  getBusinessProfileById(id: string) {
    const bp = this.data.businessProfiles.find((b) => b.id === id);
    if (!bp) return null;
    return { ...bp, user: this.getUserById(bp.userId) };
  }
  getBusinessProfileByUserId(userId: string) {
    const bp = this.data.businessProfiles.find((b) => b.userId === userId);
    if (!bp) return null;
    return { ...bp, user: this.getUserById(bp.userId) };
  }
  createBusinessProfile(profile: BusinessProfile) {
    this.data.businessProfiles.push(profile);
    this.save();
    return profile;
  }
  updateBusinessProfile(id: string, updates: Partial<BusinessProfile>) {
    const idx = this.data.businessProfiles.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.data.businessProfiles[idx] = { ...this.data.businessProfiles[idx], ...updates };
      this.save();
      return this.getBusinessProfileById(id);
    }
    return null;
  }

  // --- Projects ---
  getProjects() {
    return this.data.projects.map((p) => ({
      ...p,
      business: this.getBusinessProfileById(p.businessId) || undefined,
    }));
  }
  getProjectById(id: string) {
    const proj = this.data.projects.find((p) => p.id === id);
    if (!proj) return null;
    return {
      ...proj,
      business: this.getBusinessProfileById(proj.businessId) || undefined,
    };
  }
  createProject(project: Project) {
    this.data.projects.unshift(project);
    this.save();
    return project;
  }
  updateProject(id: string, updates: Partial<Project>) {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.projects[idx] = { ...this.data.projects[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return this.getProjectById(id);
    }
    return null;
  }
  deleteProject(id: string) {
    const idx = this.data.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.projects.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // --- Proposals ---
  getProposals() {
    return this.data.proposals.map((pr) => ({
      ...pr,
      project: this.getProjectById(pr.projectId) || undefined,
      freelancer: this.getFreelancerProfileById(pr.freelancerId) || undefined,
    }));
  }
  getProposalById(id: string) {
    const prop = this.data.proposals.find((p) => p.id === id);
    if (!prop) return null;
    return {
      ...prop,
      project: this.getProjectById(prop.projectId) || undefined,
      freelancer: this.getFreelancerProfileById(prop.freelancerId) || undefined,
    };
  }
  getProposalsByProjectId(projectId: string) {
    return this.data.proposals
      .filter((p) => p.projectId === projectId)
      .map((p) => ({
        ...p,
        freelancer: this.getFreelancerProfileById(p.freelancerId) || undefined,
      }));
  }
  getProposalsByFreelancerId(freelancerId: string) {
    return this.data.proposals
      .filter((p) => p.freelancerId === freelancerId)
      .map((p) => ({
        ...p,
        project: this.getProjectById(p.projectId) || undefined,
      }));
  }
  createProposal(proposal: Proposal) {
    // calculate match score
    const project = this.getProjectById(proposal.projectId);
    const freelancer = this.getFreelancerProfileById(proposal.freelancerId);
    if (project && freelancer) {
      proposal.matchScore = calculateMatchScore(project, freelancer);
    }
    this.data.proposals.unshift(proposal);

    // update project proposal count
    const proj = this.data.projects.find((p) => p.id === proposal.projectId);
    if (proj) {
      proj.proposalsCount = (proj.proposalsCount || 0) + 1;
    }

    this.save();
    return this.getProposalById(proposal.id);
  }
  updateProposal(id: string, updates: Partial<Proposal>) {
    const idx = this.data.proposals.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.proposals[idx] = { ...this.data.proposals[idx], ...updates, updatedAt: new Date().toISOString() };
      this.save();
      return this.getProposalById(id);
    }
    return null;
  }

  // --- Contracts ---
  getContracts() {
    return this.data.contracts.map((c) => ({
      ...c,
      project: this.getProjectById(c.projectId) || undefined,
      business: this.getBusinessProfileById(c.businessId) || undefined,
      freelancer: this.getFreelancerProfileById(c.freelancerId) || undefined,
    }));
  }
  getContractById(id: string) {
    const c = this.data.contracts.find((item) => item.id === id);
    if (!c) return null;
    return {
      ...c,
      project: this.getProjectById(c.projectId) || undefined,
      business: this.getBusinessProfileById(c.businessId) || undefined,
      freelancer: this.getFreelancerProfileById(c.freelancerId) || undefined,
    };
  }
  createContract(contract: Contract) {
    this.data.contracts.unshift(contract);
    this.save();
    return this.getContractById(contract.id);
  }
  updateContract(id: string, updates: Partial<Contract>) {
    const idx = this.data.contracts.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.data.contracts[idx] = { ...this.data.contracts[idx], ...updates };
      this.save();
      return this.getContractById(id);
    }
    return null;
  }
  updateMilestone(contractId: string, milestoneId: string, updates: Partial<Milestone>) {
    const contract = this.data.contracts.find((c) => c.id === contractId);
    if (!contract) return null;
    const mIdx = contract.milestones.findIndex((m) => m.id === milestoneId);
    if (mIdx !== -1) {
      contract.milestones[mIdx] = { ...contract.milestones[mIdx], ...updates };
      this.save();
      return contract.milestones[mIdx];
    }
    return null;
  }

  // --- Conversations & Messages ---
  getConversationsByUserId(userId: string) {
    return this.data.conversations
      .filter((c) => c.participantIds.includes(userId))
      .map((c) => {
        const otherParticipantIds = c.participantIds.filter((p) => p !== userId);
        const otherUsers = otherParticipantIds.map((id) => this.getUserById(id)).filter(Boolean) as User[];
        const lastMsg = this.data.messages
          .filter((m) => m.conversationId === c.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        return {
          ...c,
          participants: c.participantIds.map((id) => this.getUserById(id)).filter(Boolean) as User[],
          otherUser: otherUsers[0],
          lastMessage: lastMsg,
        };
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getOrCreateConversation(p1: string, p2: string, projectId?: string, contractId?: string) {
    let conv = this.data.conversations.find(
      (c) => c.participantIds.includes(p1) && c.participantIds.includes(p2)
    );
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        participantIds: [p1, p2],
        projectId,
        contractId,
        updatedAt: new Date().toISOString(),
      };
      this.data.conversations.unshift(conv);
      this.save();
    }
    return conv;
  }

  getMessagesByConversationId(conversationId: string) {
    return this.data.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  createMessage(msg: Message) {
    this.data.messages.push(msg);
    const conv = this.data.conversations.find((c) => c.id === msg.conversationId);
    if (conv) {
      conv.updatedAt = msg.createdAt;
    }
    this.save();
    return msg;
  }

  markMessagesRead(conversationId: string, currentUserId: string) {
    let modified = false;
    for (const msg of this.data.messages) {
      if (msg.conversationId === conversationId && msg.senderId !== currentUserId && !msg.read) {
        msg.read = true;
        modified = true;
      }
    }
    if (modified) this.save();
  }

  // --- Notifications ---
  getNotificationsByUserId(userId: string) {
    return this.data.notifications
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(notif: Notification) {
    this.data.notifications.unshift(notif);
    this.save();
    return notif;
  }

  markNotificationRead(id: string) {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
    return notif;
  }

  markAllNotificationsRead(userId: string) {
    for (const n of this.data.notifications) {
      if (n.recipientId === userId) {
        n.read = true;
      }
    }
    this.save();
  }

  // --- Reviews ---
  getReviews() {
    return this.data.reviews.map((r) => ({
      ...r,
      reviewer: this.getUserById(r.reviewerId),
    }));
  }
  getReviewsForUser(userId: string) {
    return this.data.reviews
      .filter((r) => r.reviewedUserId === userId)
      .map((r) => ({
        ...r,
        reviewer: this.getUserById(r.reviewerId),
      }));
  }
  createReview(review: Review) {
    this.data.reviews.unshift(review);
    // Recalculate average rating for freelancer if applicable
    const freelancer = this.data.freelancerProfiles.find((f) => f.userId === review.reviewedUserId);
    if (freelancer) {
      const userReviews = this.data.reviews.filter((r) => r.reviewedUserId === review.reviewedUserId);
      const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      freelancer.rating = Math.round(avg * 10) / 10;
      freelancer.reviewCount = userReviews.length;
    }
    this.save();
    return review;
  }

  // --- Disputes ---
  getDisputes() {
    return this.data.disputes.map((d) => ({
      ...d,
      raisedBy: this.getUserById(d.raisedByUserId),
    }));
  }
  createDispute(dispute: Dispute) {
    this.data.disputes.unshift(dispute);
    this.save();
    return dispute;
  }
  updateDispute(id: string, updates: Partial<Dispute>) {
    const idx = this.data.disputes.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.data.disputes[idx] = { ...this.data.disputes[idx], ...updates };
      this.save();
      return this.data.disputes[idx];
    }
    return null;
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return this.data.auditLogs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  logAction(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }
}

export const dbStore = new Store();
