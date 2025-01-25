// User data storage and management utilities

// Save user data to localStorage
export const saveUserData = (userData) => {
  try {
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

// Get user data from localStorage
export const getUserData = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Calculate mental health score based on user responses
export const calculateMentalHealthScore = (userData) => {
  let score = 0;
  let maxScore = 0;

  // Sleep Quality scoring (max 10 points)
  if (userData.sleepQuality === 'excellent') score += 10;
  else if (userData.sleepQuality === 'good') score += 7;
  else if (userData.sleepQuality === 'fair') score += 5;
  else if (userData.sleepQuality === 'poor') score += 2;
  maxScore += 10;

  // Stress Level scoring (max 10 points)
  if (userData.stressLevel === 'low') score += 10;
  else if (userData.stressLevel === 'moderate') score += 7;
  else if (userData.stressLevel === 'high') score += 4;
  else if (userData.stressLevel === 'severe') score += 1;
  maxScore += 10;

  // Daily Mood Rating scoring (max 10 points)
  if (userData.dailyMoodRating) {
    score += parseInt(userData.dailyMoodRating) * 2;
    maxScore += 10;
  }

  // Social Support scoring (max 10 points)
  if (userData.socialSupport === 'strong') score += 10;
  else if (userData.socialSupport === 'moderate') score += 7;
  else if (userData.socialSupport === 'limited') score += 4;
  else if (userData.socialSupport === 'none') score += 1;
  maxScore += 10;

  // Physical Activity scoring (max 10 points)
  if (userData.physicalActivity === 'high') score += 10;
  else if (userData.physicalActivity === 'moderate') score += 7;
  else if (userData.physicalActivity === 'low') score += 4;
  else if (userData.physicalActivity === 'none') score += 1;
  maxScore += 10;

  // Calculate percentage
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
};

// Save test result
export const saveTestResult = (testData) => {
  try {
    const tests = getTestResults() || [];
    tests.push({
      ...testData,
      date: new Date().toISOString(),
    });
    localStorage.setItem('testResults', JSON.stringify(tests));
    return true;
  } catch (error) {
    console.error('Error saving test result:', error);
    return false;
  }
};

// Get all test results
export const getTestResults = () => {
  try {
    const tests = localStorage.getItem('testResults');
    return tests ? JSON.parse(tests) : [];
  } catch (error) {
    console.error('Error getting test results:', error);
    return [];
  }
};

// Get latest test result
export const getLatestTestResult = () => {
  const tests = getTestResults();
  return tests.length > 0 ? tests[tests.length - 1] : null;
};

// Clear user data (for logout)
export const clearUserData = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('testResults');
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};
