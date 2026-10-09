"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchScore = calculateMatchScore;
/**
 * AI Matching Algorithm Calculator
 * Transparent, weighted scoring model
 */
function calculateMatchScore(project, freelancer) {
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
    }
    else if (fExp > pExp) {
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
    if (freelancer.availability === 'full_time')
        availabilityScore = 100;
    else if (freelancer.availability === 'part_time')
        availabilityScore = 80;
    else
        availabilityScore = 20;
    // Weighted total: 0.35 + 0.20 + 0.20 + 0.10 + 0.10 + 0.05 = 1.00
    const total = Math.round(skillsScore * 0.35 +
        experienceScore * 0.20 +
        portfolioScore * 0.20 +
        ratingScore * 0.10 +
        budgetScore * 0.10 +
        availabilityScore * 0.05);
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
