exports.calculateMatchScore = (seekerSkills, jobRequiredSkills) => {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) return 100;
  if (!seekerSkills || seekerSkills.length === 0) return 0;

  const cleanSeeker = seekerSkills.map(s => s.toLowerCase().trim());
  const cleanJob = jobRequiredSkills.map(s => s.toLowerCase().trim());

  const matchingTokens = cleanJob.filter(skill => cleanSeeker.includes(skill));
  return Math.round((matchingTokens.length / cleanJob.length) * 100);
};