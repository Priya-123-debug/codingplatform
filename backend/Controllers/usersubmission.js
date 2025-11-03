// const problem = require("../models/problem");
// const Submission = require("../models/submission");
// const {
//   getLanguageId,
//   submitBatch,
//   submitToken,
//   wrapUserCode,
// } = require("../utilis/Problemutility");

// // 🧩 SUBMIT CODE CONTROLLER
// // -------------------------------------------------
// const submitcode = async (req, res) => {
//   try {
//     // Extract user and problem details
//     const userid = req.result._id;
//     const problemid = req.params.id;
//     const { code, language } = req.body;

//     console.log("🧩 Received Problem ID:", problemid);

//     // Basic validation
//     if (!userid || !problemid || !code || !language) {
//       return res.status(400).send("Missing required fields");
//     }

//     // Fetch problem from DB
//     const problemindatabase = await problem.findById(problemid);
//     if (!problemindatabase) {
//       return res.status(404).send("Problem not found");
//     }

//     // Create a new submission record with 'pending' status
//     const submittedresult = await Submission.create({
//       userId: userid,
//       problemId: problemid,
//       code,
//       language,
//       status: "pending",
//       testCasetotal: problemindatabase.hiddenTestCases.length,
//     });

//     // Get language ID for Judge0
//     const languageid = getLanguageId(language);

//     // Create Judge0 submissions for each hidden testcase
//     // Base64 encode all fields as Judge0 recommends
//     const submissions = problemindatabase.hiddenTestCases.map((testcase) => ({
//       source_code: Buffer.from(wrapUserCode(language, code, testcase.input)).toString("base64"),
//       language_id: languageid,
//       stdin: Buffer.from(testcase.input || "").toString("base64"),
//       expected_output: Buffer.from(testcase.output || "").toString("base64"),
//     }));

//     // Submit to Judge0 (with base64_encoded=true)
//     const submitresult = await submitBatch(submissions, true); // <-- pass flag true
//     const resulttoken = submitresult.map((value) => value.token);

//     // Fetch results from Judge0
//     const testresult = await submitToken(resulttoken);

//     // Calculate result summary
//     let testcasepassed = 0;
//     let runtime = 0;
//     let memory = 0;
//     let status = "Accepted";
//     let errormessage = null;

//     for (const test of testresult) {
//       if (test.status.id === 3) {
//         // 3 = Accepted
//         testcasepassed++;
//         runtime += parseFloat(test.time);
//         memory = Math.max(memory, parseInt(test.memory));
//       } else {
//         // Handle errors
//         if (test.status.id === 4) {
//           status = "error";
//           errormessage = test.stderr;
//         } else {
//           status = "wrong answer";
//         }
//       }
//     }

//     // Update the submission document
//     submittedresult.status = status;
//     submittedresult.testCasepassed = testcasepassed;
//     submittedresult.errormessage = errormessage;
//     submittedresult.runtime = runtime;
//     submittedresult.memory = memory;
//     await submittedresult.save();

//     // Add problem to user's solved list if not already present
//     if (!req.result.problemsolved.includes(problemid)) {
//       req.result.problemsolved.push(problemid);
//       await req.result.save();
//     }

//     // Send final submission summary
//     res.status(201).send(submittedresult);
//   } catch (err) {
//     console.error("❌ Error in submitcode:", err.response?.data || err.message);
//     res.status(500).send("Internal server error " + err.message);
//   }
// };

// // 🧩 RUN CODE CONTROLLER (for visible testcases only)
// // -------------------------------------------------
// const runcode = async (req, res) => {
//   try {
//     const userid = req.result._id;
//     const problemid = req.params.id;
//     const { code, language } = req.body;

//     console.log("🧩 Received Problem ID:", problemid);

//     // Validation
//     if (!userid || !problemid || !code || !language) {
//       return res.status(400).send("Missing required fields");
//     }

//     // Fetch problem from DB
//     const problemindatabase = await problem.findById(problemid);
//     if (!problemindatabase) {
//       return res.status(404).send("Problem not found");
//     }

//     // Get Judge0 language id
//     const languageid = getLanguageId(language);
//     console.log("Language id for", language, "is", languageid);

//     // Prepare submissions (base64 encoded)
//     // const submissions = problemindatabase.visibleTestCases.map((testcase) => ({
//     //   source_code: Buffer.from(wrapUserCode(language, code, testcase.input)).toString("base64"),
//     //   language_id: languageid,
//     //   stdin: Buffer.from(testcase.input || "").toString("base64"),
//     //   expected_output: Buffer.from(testcase.output || "").toString("base64"),
//     // }));
// 		const submissions = problemindatabase.visibleTestCases.map((testcase) => {
//   const sourceCode = wrapUserCode(language, code, testcase.input);

//   // Encode safely to Base64
//   const encode = (str) => Buffer.from(str || "", "utf-8").toString("base64");

//   return {
//     source_code: encode(sourceCode),
//     language_id: languageid,
//     stdin: encode(testcase.input),
//     expected_output: encode(testcase.output),
//   };
// });

// const submitresult = await submitBatch(submissions, true);  // ✅ base64 mode ON


//     console.log("Submitting", submissions.length, "test cases to Judge0");

//     // Submit all testcases to Judge0 (with base64 encoding enabled)
    
//     const resulttoken = submitresult.map((value) => value.token);

//     // Get execution results
//     const testresult = await submitToken(resulttoken);

//     console.log("✅ Judge0 test results received");
//     res.status(201).send(testresult);
//   } catch (err) {
//     console.error("❌ Error calling Judge0:", err.response?.data || err.message);
//     res.status(500).send("Internal server error " + err.message);
//   }
// };

// module.exports = { submitcode, runcode };

const problem = require("../models/problem");
const Submission = require("../models/submission");
const {
  getLanguageId,
  submitBatch,
  submitToken,
  wrapUserCode,
  generateTestCode,
  parseTestCase
} = require("../utilis/Problemutility");

// Helper function to extract function name from code
function extractFunctionName(code, language) {
  const lang = language.toLowerCase();
  
  if (lang === 'cpp' || lang === 'c++') {
    // Match patterns like: vector<int> twoSum(vector<int>& nums, int target)
    const match = code.match(/(?:class\s+Solution\s*{[\s\S]*?public:)?\s*\w+(?:::\w+)?\s+(\w+)\s*\([^)]*\)\s*(?:const)?\s*{/);
    if (match) return match[1];
    
    // Alternative pattern for C++
    const altMatch = code.match(/(\w+)\s*\([^)]*\)\s*{/);
    return altMatch ? altMatch[1] : 'solution';
  } 
  else if (lang === 'python' || lang === 'python3') {
    const match = code.match(/def\s+(\w+)\s*\(/);
    return match ? match[1] : 'solution';
  } 
  else if (lang === 'java') {
    const match = code.match(/(?:public|private|protected)?\s*(?:\w+\s+)+(\w+)\s*\([^)]*\)\s*{/);
    return match ? match[1] : 'solution';
  } 
  else if (lang === 'javascript' || lang === 'js') {
    const match = code.match(/(\w+)\s*\([^)]*\)\s*{/);
    return match ? match[1] : 'solution';
  }
  
  return 'solution';
}

// Helper function to auto-detect input types based on test case input
function detectInputTypes(testCaseInput, language) {
  try {
    const parsed = JSON.parse(testCaseInput);
    if (Array.isArray(parsed)) {
      if (language === 'cpp') return ['vector<int>'];
      if (language === 'java') return ['int[]'];
      if (language === 'python') return ['List[int]'];
      return ['array'];
    } else if (typeof parsed === 'string') {
      return ['string'];
    } else if (typeof parsed === 'number') {
      return ['int'];
    }
  } catch (e) {
    // If not JSON, try to detect from string format
    if (testCaseInput.includes('[') && testCaseInput.includes(']')) {
      if (language === 'cpp') return ['vector<int>'];
      if (language === 'java') return ['int[]'];
      if (language === 'python') return ['List[int]'];
      return ['array'];
    } else if (!isNaN(testCaseInput)) {
      return ['int'];
    }
  }
  return ['auto']; // Default fallback
}

// Helper function to auto-detect return type based on test case output
function detectReturnType(testCaseOutput, language) {
  try {
    const parsed = JSON.parse(testCaseOutput);
    if (Array.isArray(parsed)) {
      if (language === 'cpp') return 'vector<int>';
      if (language === 'java') return 'int[]';
      if (language === 'python') return 'List[int]';
      return 'array';
    } else if (typeof parsed === 'string') {
      return 'string';
    } else if (typeof parsed === 'number') {
      return 'int';
    } else if (typeof parsed === 'boolean') {
      return 'bool';
    }
  } catch (e) {
    // If not JSON, try to detect from string format
    if (testCaseOutput.includes('[') && testCaseOutput.includes(']')) {
      if (language === 'cpp') return 'vector<int>';
      if (language === 'java') return 'int[]';
      if (language === 'python') return 'List[int]';
      return 'array';
    } else if (testCaseOutput === 'true' || testCaseOutput === 'false') {
      return 'bool';
    } else if (!isNaN(testCaseOutput)) {
      return 'int';
    }
  }
  return 'auto'; // Default fallback
}

// 🧩 SUBMIT CODE CONTROLLER
// -------------------------------------------------
const submitcode = async (req, res) => {
  try {
    // Extract user and problem details
    const userid = req.result._id;
    const problemid = req.params.id;
    const { code, language } = req.body;

    console.log("🧩 Received Problem ID:", problemid);

    // Basic validation
    if (!userid || !problemid || !code || !language) {
      return res.status(400).send("Missing required fields");
    }

    // Fetch problem from DB
    const problemindatabase = await problem.findById(problemid);
    if (!problemindatabase) {
      return res.status(404).send("Problem not found");
    }

    // Auto-detect function name from user code
    const functionName = extractFunctionName(code, language);
    console.log("🔍 Detected function name:", functionName);

    // Create a new submission record with 'pending' status
    const submittedresult = await Submission.create({
      userId: userid,
      problemId: problemid,
      code,
      language,
      status: "pending",
      testCasetotal: problemindatabase.hiddenTestCases.length,
    });

    // Get language ID for Judge0
    const languageid = getLanguageId(language);

    // Create Judge0 submissions for each hidden testcase
    const submissions = problemindatabase.hiddenTestCases.map((testcase) => {
      // Auto-detect types based on first test case
      const inputTypes = detectInputTypes(testcase.input, language);
      const returnType = detectReturnType(testcase.output, language);
      
      console.log(`🔍 Test case - Input: ${testcase.input.substring(0, 50)}... | Detected types:`, { inputTypes, returnType });

      // Parse test case and generate test code
      const { inputObj } = parseTestCase(testcase.input, testcase.output, language);
      const testInputCode = generateTestCode(language, functionName, inputObj, testcase.output, inputTypes, returnType);
      
      // Wrap user code with test cases
      const wrappedCode = wrapUserCode(language, code, testInputCode, inputTypes, returnType);
      
      return {
        source_code: Buffer.from(wrappedCode).toString("base64"),
        language_id: languageid,
        stdin: Buffer.from(testcase.input || "").toString("base64"),
        expected_output: Buffer.from(testcase.output || "").toString("base64"),
      };
    });

    // Submit to Judge0 (with base64_encoded=true)
    const submitresult = await submitBatch(submissions, true);
    const resulttoken = submitresult.map((value) => value.token);

    // Fetch results from Judge0
    const testresult = await submitToken(resulttoken);

    // Calculate result summary
    let testcasepassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "Accepted";
    let errormessage = null;

    for (const test of testresult) {
      if (test.status.id === 3) {
        // 3 = Accepted
        testcasepassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, parseInt(test.memory || 0));
      } else {
        // Handle errors
        if (test.status.id === 4 || test.status.id === 5 || test.status.id === 6) {
          status = "error";
          errormessage = test.stderr || test.compile_output || "Runtime error";
        } else if (test.status.id === 7) {
          status = "wrong answer";
        } else {
          status = "failed";
        }
      }
    }

    // Update the submission document
    submittedresult.status = status;
    submittedresult.testCasepassed = testcasepassed;
    submittedresult.errormessage = errormessage;
    submittedresult.runtime = runtime;
    submittedresult.memory = memory;
    await submittedresult.save();

    // Add problem to user's solved list if all test cases passed
    if (status === "Accepted" && !req.result.problemsolved.includes(problemid)) {
      req.result.problemsolved.push(problemid);
      await req.result.save();
    }

    // Send final submission summary
    res.status(201).send(submittedresult);
  } catch (err) {
    console.error("❌ Error in submitcode:", err.response?.data || err.message);
    res.status(500).send("Internal server error " + err.message);
  }
};

// 🧩 RUN CODE CONTROLLER (for visible testcases only)
// -------------------------------------------------
const runcode = async (req, res) => {
  try {
    const userid = req.result._id;
    const problemid = req.params.id;
    const { code, language } = req.body;

    console.log("🧩 Received Problem ID:", problemid);

    // Validation
    if (!userid || !problemid || !code || !language) {
      return res.status(400).send("Missing required fields");
    }

    // Fetch problem from DB
    const problemindatabase = await problem.findById(problemid);
    if (!problemindatabase) {
      return res.status(404).send("Problem not found");
    }

    // Auto-detect function name from user code
    const functionName = extractFunctionName(code, language);
    console.log("🔍 Detected function name:", functionName);

    // Get Judge0 language id
    const languageid = getLanguageId(language);
    console.log("Language id for", language, "is", languageid);

    // Prepare submissions (base64 encoded)
    const submissions = problemindatabase.visibleTestCases.map((testcase, index) => {
      // Auto-detect types based on test case
      const inputTypes = detectInputTypes(testcase.input, language);
      const returnType = detectReturnType(testcase.output, language);
      
      console.log(`🔍 Visible Test case ${index + 1} - Detected types:`, { inputTypes, returnType });

      // Parse test case and generate test code
      const { inputObj } = parseTestCase(testcase.input, testcase.output, language);
      const testInputCode = generateTestCode(language, functionName, inputObj, testcase.output, inputTypes, returnType);
      
      // Wrap user code with test cases
      const sourceCode = wrapUserCode(language, code, testInputCode, inputTypes, returnType);

      // Encode safely to Base64
      const encode = (str) => Buffer.from(str || "", "utf-8").toString("base64");

      return {
        source_code: encode(sourceCode),
        language_id: languageid,
        stdin: encode(testcase.input),
        expected_output: encode(testcase.output),
      };
    });

    const submitresult = await submitBatch(submissions, true);  // ✅ base64 mode ON

    console.log("Submitting", submissions.length, "test cases to Judge0");

    // Get execution results
    const resulttoken = submitresult.map((value) => value.token);
    const testresult = await submitToken(resulttoken);

    console.log("✅ Judge0 test results received");
    res.status(201).send(testresult);
  } catch (err) {
    console.error("❌ Error calling Judge0:", err.response?.data || err.message);
    res.status(500).send("Internal server error " + err.message);
  }
};

module.exports = { submitcode, runcode };