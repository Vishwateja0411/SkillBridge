const BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken(): string | null {
  return localStorage.getItem('sb_token');
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}/api/v1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Freelancers
  getFreelancers: (params?: Record<string, string>) => {
    const qs = params ? new URLSearchParams(params).toString() : '';
    return request(`/freelancers${qs ? `?${qs}` : ''}`);
  },
  getFreelancerById: (id: string) => request(`/freelancers/${id}`),
  updateFreelancerProfile: (data: any) => request('/freelancers/me/profile', { method: 'PUT', body: JSON.stringify(data) }),
  addPortfolioItem: (data: any) => request('/freelancers/me/portfolio', { method: 'POST', body: JSON.stringify(data) }),
  removePortfolioItem: (id: string) => request(`/freelancers/me/portfolio/${id}`, { method: 'DELETE' }),
  submitFreelancerOnboarding: (data: any) => request('/freelancers/me/onboarding', { method: 'POST', body: JSON.stringify(data) }),

  // Businesses
  getBusinessById: (id: string) => request(`/businesses/${id}`),
  updateBusinessProfile: (data: any) => request('/businesses/me/profile', { method: 'PUT', body: JSON.stringify(data) }),
  submitBusinessOnboarding: (data: any) => request('/businesses/me/onboarding', { method: 'POST', body: JSON.stringify(data) }),

  // Projects
  getProjects: (params?: Record<string, string>) => {
    const qs = params ? new URLSearchParams(params).toString() : '';
    return request(`/projects${qs ? `?${qs}` : ''}`);
  },
  getProjectById: (id: string) => request(`/projects/${id}`),
  createProject: (data: any) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),
  getMyProjects: () => request('/projects/my/projects'),
  getProjectRecommendations: (id: string) => request(`/projects/${id}/recommendations`),

  // Proposals
  submitProposal: (data: any) => request('/proposals', { method: 'POST', body: JSON.stringify(data) }),
  getProposalsForProject: (projectId: string) => request(`/proposals/project/${projectId}`),
  getMyProposals: () => request('/proposals/my/proposals'),
  updateProposalStatus: (id: string, status: string) => request(`/proposals/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  withdrawProposal: (id: string) => request(`/proposals/${id}/withdraw`, { method: 'PUT' }),

  // Contracts
  createContractOffer: (data: any) => request('/contracts/offer', { method: 'POST', body: JSON.stringify(data) }),
  getContracts: () => request('/contracts'),
  getContractById: (id: string) => request(`/contracts/${id}`),
  acceptContract: (id: string) => request(`/contracts/${id}/accept`, { method: 'PUT' }),
  submitMilestoneDeliverable: (contractId: string, milestoneId: string, data: any) =>
    request(`/contracts/${contractId}/milestones/${milestoneId}/submit`, { method: 'PUT', body: JSON.stringify(data) }),
  approveMilestone: (contractId: string, milestoneId: string) =>
    request(`/contracts/${contractId}/milestones/${milestoneId}/approve`, { method: 'PUT' }),
  requestMilestoneRevision: (contractId: string, milestoneId: string, data: any) =>
    request(`/contracts/${contractId}/milestones/${milestoneId}/revision`, { method: 'PUT', body: JSON.stringify(data) }),
  completeContract: (id: string) => request(`/contracts/${id}/complete`, { method: 'PUT' }),

  // Messaging
  getConversations: () => request('/messages/conversations'),
  startConversation: (data: any) => request('/messages/conversations', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: (convId: string) => request(`/messages/conversations/${convId}/messages`),
  sendMessage: (convId: string, data: any) => request(`/messages/conversations/${convId}/messages`, { method: 'POST', body: JSON.stringify(data) }),
  markMessagesRead: (convId: string) => request(`/messages/conversations/${convId}/read`, { method: 'PUT' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Reviews & Disputes
  submitReview: (data: any) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getUserReviews: (userId: string) => request(`/reviews/user/${userId}`),
  submitDispute: (data: any) => request('/disputes', { method: 'POST', body: JSON.stringify(data) }),
  getDisputes: () => request('/disputes'),
  resolveDispute: (id: string, data: any) => request(`/disputes/${id}/resolve`, { method: 'PUT', body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  toggleUserVerification: (id: string) => request(`/admin/users/${id}/verify`, { method: 'PUT' }),
  getAdminAuditLogs: () => request('/admin/audit-logs'),
  resetSeedData: () => request('/admin/reset-seed', { method: 'POST' }),

  // AI Assistant
  enhanceProjectDescription: (data: any) => request('/ai/enhance-project-description', { method: 'POST', body: JSON.stringify(data) }),
  extractSkills: (text: string) => request('/ai/extract-skills', { method: 'POST', body: JSON.stringify({ text }) }),
  getProposalDraft: (data: any) => request('/ai/proposal-assistant', { method: 'POST', body: JSON.stringify(data) }),
};
