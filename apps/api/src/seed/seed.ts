import { dbStore } from '../store/index.js';

console.log('🌱 Seeding SkillBridge database...');
dbStore.resetToSeed();
console.log('✅ Seed completed successfully!');
console.log(`- Users: ${dbStore.getUsers().length}`);
console.log(`- Freelancers: ${dbStore.getFreelancerProfiles().length}`);
console.log(`- Businesses: ${dbStore.getBusinessProfiles().length}`);
console.log(`- Projects: ${dbStore.getProjects().length}`);
console.log(`- Proposals: ${dbStore.getProposals().length}`);
console.log(`- Contracts: ${dbStore.getContracts().length}`);
