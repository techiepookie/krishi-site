const express = require('express');
const router = express.Router();

// Test questions data
const testQuestions = {
  adhd: [
    {
      id: 1,
      question: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
    },
    {
      id: 2,
      question: "How often do you have problems remembering appointments or obligations?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
    },
    {
      id: 3,
      question: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
    },
    {
      id: 4,
      question: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
    },
    {
      id: 5,
      question: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
    }
  ],
  anxiety: [
    {
      id: 1,
      question: "How often have you been bothered by feeling nervous, anxious, or on edge?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 2,
      question: "How often have you been bothered by not being able to stop or control worrying?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 3,
      question: "How often have you been bothered by worrying too much about different things?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 4,
      question: "How often have you been bothered by trouble relaxing?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 5,
      question: "How often have you been bothered by being so restless that it's hard to sit still?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  ],
  depression: [
    {
      id: 1,
      question: "How often have you been bothered by little interest or pleasure in doing things?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 2,
      question: "How often have you been bothered by feeling down, depressed, or hopeless?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 3,
      question: "How often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 4,
      question: "How often have you been bothered by feeling tired or having little energy?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
      id: 5,
      question: "How often have you been bothered by poor appetite or overeating?",
      options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  ]
};

// Helper function to calculate score
const calculateScore = (answers, testType) => {
  const maxScores = {
    adhd: 20,
    anxiety: 15,
    depression: 15
  };

  let score = 0;
  Object.values(answers).forEach(value => {
    score += value;
  });

  return (score / Object.keys(answers).length) * 100;
};

// Get test questions
router.get('/:type/questions', (req, res) => {
  const { type } = req.params;
  
  if (!testQuestions[type]) {
    return res.status(404).json({ error: 'Test type not found' });
  }

  res.json({ questions: testQuestions[type] });
});

// Submit test answers
router.post('/:type/submit', (req, res) => {
  const { type } = req.params;
  const { answers } = req.body;

  if (!testQuestions[type]) {
    return res.status(404).json({ error: 'Test type not found' });
  }

  if (!answers || Object.keys(answers).length !== testQuestions[type].length) {
    return res.status(400).json({ error: 'Please answer all questions' });
  }

  const score = calculateScore(answers, type);
  const result = {
    score,
    severity: score < 30 ? 'Low' : score < 60 ? 'Moderate' : 'High',
    recommendations: [
      'Consider consulting with a mental health professional',
      'Practice self-care and stress management techniques',
      'Maintain a regular sleep schedule',
      'Exercise regularly',
      'Stay connected with supportive friends and family'
    ]
  };

  res.json({ result });
});

// Get recent tests
router.get('/recent', (req, res) => {
  // This would typically fetch from a database
  // For now, return mock data
  res.json([
    {
      id: 1,
      type: 'adhd',
      date: new Date(),
      score: 45,
      severity: 'Moderate'
    },
    {
      id: 2,
      type: 'anxiety',
      date: new Date(),
      score: 30,
      severity: 'Low'
    }
  ]);
});

module.exports = router;
