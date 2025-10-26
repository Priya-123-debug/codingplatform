const axios = require('axios');

const getLanguageId = (lang) => {
  const language = {
    "c++": 54,
    "python": 71,
    "java": 62,
    "javascript": 63
  };
  return language[lang.toLowerCase()];
};

// Proper wait function
const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Submit batch of code to Judge0
const submitBatch = async (submissions) => {
  if (!submissions || submissions.length === 0) {
    throw new Error("No submissions to send to Judge0");
  }

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=false',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': 'c3f1e07d3amsh70931283891d384p1d1a84jsn28013a972321',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    },
    data: { submissions }
  };

  try {
    const response = await axios.request(options);
    return response.data; // returns { tokens: [...] }
  } catch (error) {
    console.error("Judge0 Batch Error:", error.response?.data || error.message);
    throw error;
  }
};

// Poll Judge0 for results
const submitToken = async (tokens) => {
  if (!tokens || tokens.length === 0) throw new Error("No tokens to poll");

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    headers: {
      'x-rapidapi-key': 'c3f1e07d3amsh70931283891d384p1d1a84jsn28013a972321',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    },
    params: {
      tokens: tokens.join(','),
      base64_encoded: false,
      fields: '*'
    }
  };

  while (true) {
    const response = await axios.request(options);
    const submissions = response.data.submissions;
    const allDone = submissions.every((s) => s.status.id > 2);

    if (allDone) return submissions; // return all submission results

    await waiting(1000); // wait 1s before polling again
  }
};

module.exports = { getLanguageId, submitBatch, submitToken };
