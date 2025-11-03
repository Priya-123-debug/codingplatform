// const axios = require('axios');

// // -------------------------
// // 🧩 1️⃣ Language Mapping
// // -------------------------
// const getLanguageId = (lang) => {
//   const language = {
//     "c++": 54,
//     "cpp": 54,
//     "python": 71,
//     "java": 62,
//     "javascript": 63
//   };
//   return language[lang.toLowerCase()];
// };

// // -------------------------
// // 🧩 2️⃣ Helper: Delay
// // -------------------------
// const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // -------------------------
// // 🧩 3️⃣ Submit Code Batch
// // -------------------------
// const submitBatch = async (submissions, useBase64 = true) => {
//   try {
//     console.log("🚀 Submitting to Judge0...");
//     console.log("📦 Total submissions:", submissions.length);

//     // 🔹 DEBUG each submission before sending
//     submissions.forEach((submission, idx) => {
//       const testcase = {
//         input: submission.stdin,
//         output: submission.expected_output
//       };
//       const sourceCode = submission.source_code || "";

//       console.log(`🔹 Submission #${idx + 1}`);
//       console.log("  Raw Input:", testcase.input);
//       console.log("  Encoded Input:", submission.stdin);
//       console.log("  Raw Output:", testcase.output);
//       console.log("  Encoded Output:", submission.expected_output);
//       console.log("  Source Length:", sourceCode.length);
//       console.log("  Encoded Source (first 80 chars):", sourceCode.slice(0, 80));
//         console.log("🔍 Full source sent to Judge0:\n", atob(submission.source_code));

//       console.log("──────────────────────────────────────────────");
//     });
    
//     const options = {
//       method: 'POST',
//       url: `https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=${useBase64}&wait=false`,
//       headers: {
//         'content-type': 'application/json',
//         'x-rapidapi-key': 'c3f1e07d3amsh70931283891d384p1d1a84jsn28013a972321',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//       },
//       data: { submissions }
//     };

//     const response = await axios.request(options);
//     console.log("✅ Response from Judge0 (token batch):", response.data);
//     return response.data;
//   } catch (err) {
//     console.error("🚨 Error in submitBatch:", err.response?.data || err.message);
//     throw err;
//   }
// };

// // -------------------------
// // 🧩 4️⃣ Poll Judge0 Results
// // -------------------------
// const submitToken = async (tokens, useBase64 = true) => {
//   if (!tokens || tokens.length === 0) throw new Error("No tokens to poll");

//   console.log("🔁 Polling Judge0 for tokens:", tokens.join(','));

//   const options = {
//     method: 'GET',
//     url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//     headers: {
//       'x-rapidapi-key': 'c3f1e07d3amsh70931283891d384p1d1a84jsn28013a972321',
//       'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//     },
//     params: {
//       tokens: tokens.join(','),
//       base64_encoded: useBase64,
//       fields: '*'
//     }
//   };

//   while (true) {
//     const response = await axios.request(options);
//     const submissions = response.data.submissions;

//     submissions.forEach((s, i) =>
//       console.log(`📊 [${i}] Status: ${s.status?.description} (id=${s.status?.id})`)
//     );

//     const allDone = submissions.every((s) => s.status.id > 2);

//     if (allDone) {
//       console.log("✅ All submissions completed!");
//       return submissions;
//     }

//     await waiting(1500);
//   }
// };

// // -------------------------
// // 🧩 5️⃣ Wrapper Function
// // -------------------------
// function generateTestInputCode(language, functionName, rawInput) {
//   const lang = language.toLowerCase();

//   // Clean input like "[2,7,11,15], target=9"
//   const match = rawInput.match(/\[(.*?)\].*?(\d+)/);
//   let arrayPart = match ? match[1] : "";
//   let target = match ? match[2] : "";

//   if (lang === "cpp" || lang === "c++") {
//     return `
// vector<int> nums = {${arrayPart}};
// int target = ${target};
// Solution sol;
// auto result = sol.${functionName}(nums, target);
// for (int x : result) cout << x << " ";
// `;
//   }

//   if (lang === "python" || lang === "python3") {
//     return `
// nums = [${arrayPart}]
// target = ${target}
// sol = Solution()
// print(sol.${functionName}(nums, target))
// `;
//   }

//   if (lang === "java") {
//     return `
// int[] nums = new int[]{${arrayPart}};
// int target = ${target};
// Solution sol = new Solution();
// System.out.println(Arrays.toString(sol.${functionName}(nums, target)));
// `;
//   }

//   if (lang === "javascript" || lang === "js" || lang === "nodejs") {
//     return `
// const nums = [${arrayPart}];
// const target = ${target};
// const sol = new Solution();
// console.log(sol.${functionName}(nums, target));
// `;
//   }

//   if (lang === "c") {
//     return `
// int nums[] = {${arrayPart}};
// int target = ${target};
// // Function calls can be handled manually if needed
// `;
//   }

//   return "";
// }

// // -------------------------
// // 4️⃣ Universal Wrapper Function
// // -------------------------
// const wrapUserCode = (language, userCode, testInputCode = "") => {
//   const lang = language.toLowerCase();

//   if (lang === "cpp" || lang === "c++") {
//     return `
// #include <bits/stdc++.h>
// using namespace std;

// ${userCode}

// int main() {
//   ios::sync_with_stdio(false);
//   cin.tie(nullptr);
//   try {
//     ${testInputCode}
//   } catch (const exception &e) {
//     cerr << "Runtime error: " << e.what() << endl;
//     return 1;
//   }
//   return 0;
// }
// `;
//   }

//   if (lang === "python" || lang === "python3") {
//     return `
// ${userCode}

// if __name__ == "__main__":
//     try:
//         ${testInputCode}
//     except Exception as e:
//         print("Runtime error:", e)
// `;
//   }

//   if (lang === "java") {
//     return `
// import java.util.*;
// class Main {
// ${userCode}
//   public static void main(String[] args) {
//     try {
//       ${testInputCode}
//     } catch (Exception e) {
//       System.out.println("Runtime error: " + e.getMessage());
//     }
//   }
// }
// `;
//   }

//   if (lang === "javascript" || lang === "js") {
//     return `
// ${userCode}

// (async () => {
//   try {
//     ${testInputCode}
//   } catch (err) {
//     console.error("Runtime error:", err);
//   }
// })();
// `;
//   }

//   if (lang === "c") {
//     return `
// #include <stdio.h>
// #include <stdlib.h>

// ${userCode}

// int main() {
//   ${testInputCode}
//   return 0;
// }
// `;
//   }

//   return userCode;
// };













// // -------------------------
// // ✅ Export
// // -------------------------
// module.exports = {
//   getLanguageId,
//   submitBatch,
//   submitToken,
//   wrapUserCode
// };



const axios = require('axios');

// -------------------------
// 🧩 1️⃣ Language Mapping
// -------------------------
const getLanguageId = (lang) => {
  const language = {
    "c++": 54,
    "cpp": 54,
    "python": 71,
    "python3": 71,
    "java": 62,
    "javascript": 63,
    "js": 63,
    "c": 50,
    "c#": 51,
    "go": 60,
    "rust": 73,
    "ruby": 72,
    "swift": 83,
    "kotlin": 78,
    "scala": 81,
    "php": 68,
    "typescript": 74,
    "r": 80
  };
  return language[lang.toLowerCase()] || 54; // Default to C++
};

// -------------------------
// 🧩 2️⃣ Helper: Delay
// -------------------------
const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// -------------------------
// 🧩 3️⃣ Submit Code Batch
// -------------------------
const submitBatch = async (submissions, useBase64 = true) => {
  try {
    console.log("🚀 Submitting to Judge0...");
    console.log("📦 Total submissions:", submissions.length);

    submissions.forEach((submission, idx) => {
      console.log(`🔹 Submission #${idx + 1}`);
      console.log("  Language ID:", submission.language_id);
      console.log("  Source Length:", submission.source_code.length);
      console.log("  Encoded Source (first 100 chars):", submission.source_code.slice(0, 100));
      console.log("──────────────────────────────────────────────");
    });
    
    const options = {
      method: 'POST',
      url: `https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=${useBase64}&wait=false`,
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-key': 'c3f1e07d3amsh70931283891d384p1d1a84jsn28013a972321',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
      },
      data: { submissions }
    };

    const response = await axios.request(options);
    console.log("✅ Response from Judge0 (token batch):", response.data);
    return response.data;
  } catch (err) {
    console.error("🚨 Error in submitBatch:", err.response?.data || err.message);
    throw err;
  }
};

// -------------------------
// 🧩 4️⃣ Poll Judge0 Results
// -------------------------
// const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitToken = async (tokens, useBase64 = true) => {
  if (!tokens || tokens.length === 0) throw new Error("No tokens to poll");

  console.log("🔁 Polling Judge0 for tokens:", tokens.join(','));

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    headers: {
      'x-rapidapi-key': 'c3f1e07d3amsh70931283891d384p1d1a84jsn28013a972321',
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    },
    params: {
      tokens: tokens.join(','),
      base64_encoded: useBase64,
      fields: '*'
    }
  };

  while (true) {
    const response = await axios.request(options);

    if (!response.data || !response.data.submissions) {
      console.log("⚠️ No submissions data yet, retrying...");
      await waiting(1500);
      continue;
    }

    const submissions = response.data.submissions;

    submissions.forEach((s, i) => {
      console.log(`📊 [${i}] Status: ${s.status?.description} (id=${s.status?.id})`);

      const decodeIfBase64 = (val) => {
        if (!val) return null;
        try {
          return Buffer.from(val, 'base64').toString('utf8');
        } catch {
          return val;
        }
      };

      const compileOutput = decodeIfBase64(s.compile_output || null);
      const stderr = decodeIfBase64(s.stderr || null);
      const stdout = decodeIfBase64(s.stdout || null);
      const message = decodeIfBase64(s.message || null);

      console.log(`  🔴 compile_output:\n${compileOutput || '<empty>'}`);
      console.log(`  ⚠️ stderr:\n${stderr || '<empty>'}`);
      console.log(`  ✅ stdout:\n${stdout || '<empty>'}`);
      if (message) console.log(`  ℹ️ message:\n${message}`);
    });

    const allDone = submissions.every((s) => s.status.id > 2 || s.status.id === 6);
    if (allDone) {
      console.log("✅ All submissions completed!");
      return submissions;
    }

    await waiting(1500);
  }
};



// -------------------------
// 🧩 5️⃣ Universal Test Case Parser
// -------------------------
function parseTestCase(inputStr, outputStr, language) {
  try {
    // Try to parse input as JSON first
    let inputObj;
    try {
      inputObj = JSON.parse(inputStr);
    } catch {
      // If not JSON, treat as raw string
      inputObj = inputStr;
    }

    // Parse expected output
    let expectedOutput;
    try {
      expectedOutput = JSON.parse(outputStr);
    } catch {
      expectedOutput = outputStr;
    }

    return { inputObj, expectedOutput };
  } catch (error) {
    console.error("Error parsing test case:", error);
    return { inputObj: inputStr, expectedOutput: outputStr };
  }
}

// -------------------------
// 🧩 6️⃣ Generate Test Code for Any Function
// -------------------------
function generateTestCode(language, functionName, inputObj, expectedOutput, inputTypes, returnType) {
  const lang = language.toLowerCase();

  switch (lang) {
    case "cpp":
    case "c++":
      return generateCPPTestCode(functionName, inputObj, inputTypes, returnType);
    
    case "python":
    case "python3":
      return generatePythonTestCode(functionName, inputObj, inputTypes, returnType);
    
    case "java":
      return generateJavaTestCode(functionName, inputObj, inputTypes, returnType);
    
    case "javascript":
    case "js":
      return generateJavaScriptTestCode(functionName, inputObj, inputTypes, returnType);
    
    case "c":
      return generateCTestCode(functionName, inputObj, inputTypes, returnType);
    
    case "c#":
      return generateCSharpTestCode(functionName, inputObj, inputTypes, returnType);
    
    default:
      return generateGenericTestCode(lang, functionName, inputObj, inputTypes, returnType);
  }
}

// -------------------------
// 🧩 7️⃣ Language-Specific Test Code Generators
// -------------------------

function generateCPPTestCode(functionName, inputObj, inputTypes, returnType) {
  let code = `Solution sol;\n`;
  
  // Handle different input types
  if (Array.isArray(inputObj)) {
    if (inputTypes && inputTypes.length === 1 && inputTypes[0].includes('vector')) {
      code += `vector<${getCppType(inputTypes[0])}> nums = ${JSON.stringify(inputObj).replace(/"/g, '')};\n`;
      code += `auto result = sol.${functionName}(nums);\n`;
    } else {
      // Multiple parameters
      inputObj.forEach((param, index) => {
        const type = inputTypes && inputTypes[index] ? getCppType(inputTypes[index]) : 'auto';
        code += `${type} param${index} = ${formatCppValue(param)};\n`;
      });
      
      code += `auto result = sol.${functionName}(`;
      code += inputObj.map((_, index) => `param${index}`).join(', ');
      code += `);\n`;
    }
  } else if (typeof inputObj === 'object' && inputObj !== null) {
    // Single object parameter
    code += `auto params = ${formatCppObject(inputObj)};\n`;
    code += `auto result = sol.${functionName}(params);\n`;
  } else {
    // Single primitive parameter
    code += `auto result = sol.${functionName}(${formatCppValue(inputObj)});\n`;
  }
  
  code += `// Print result\n`;
  code += `printResult(result);\n`;
  
  return code;
}

function generatePythonTestCode(functionName, inputObj, inputTypes, returnType) {
  let code = `sol = Solution()\n`;
  
  if (Array.isArray(inputObj)) {
    if (inputTypes && inputTypes.length === 1 && inputTypes[0] === 'List') {
      code += `nums = ${JSON.stringify(inputObj)}\n`;
      code += `result = sol.${functionName}(nums)\n`;
    } else {
      // Multiple parameters
      code += `result = sol.${functionName}(${inputObj.map(param => formatPythonValue(param)).join(', ')})\n`;
    }
  } else if (typeof inputObj === 'object' && inputObj !== null) {
    code += `params = ${JSON.stringify(inputObj)}\n`;
    code += `result = sol.${functionName}(**params)\n`;
  } else {
    code += `result = sol.${functionName}(${formatPythonValue(inputObj)})\n`;
  }
  
  code += `print(result)\n`;
  return code;
}

function generateJavaTestCode(functionName, inputObj, inputTypes, returnType) {
  let code = `Solution sol = new Solution();\n`;
  
  if (Array.isArray(inputObj)) {
    if (inputTypes && inputTypes.length === 1 && inputTypes[0].startsWith('[]')) {
      const javaType = getJavaType(inputTypes[0]);
      code += `${javaType} nums = ${formatJavaArray(inputObj)};\n`;
      code += `${getJavaType(returnType)} result = sol.${functionName}(nums);\n`;
    } else {
      inputObj.forEach((param, index) => {
        const type = inputTypes && inputTypes[index] ? getJavaType(inputTypes[index]) : 'Object';
        code += `${type} param${index} = ${formatJavaValue(param)};\n`;
      });
      
      code += `${getJavaType(returnType)} result = sol.${functionName}(`;
      code += inputObj.map((_, index) => `param${index}`).join(', ');
      code += `);\n`;
    }
  } else {
    code += `${getJavaType(returnType)} result = sol.${functionName}(${formatJavaValue(inputObj)});\n`;
  }
  
  code += `System.out.println(java.util.Arrays.toString(result));\n`;
  return code;
}

function generateJavaScriptTestCode(functionName, inputObj, inputTypes, returnType) {
  let code = `const sol = new Solution();\n`;
  
  if (Array.isArray(inputObj)) {
    code += `const result = sol.${functionName}(${JSON.stringify(inputObj)});\n`;
  } else if (typeof inputObj === 'object' && inputObj !== null) {
    code += `const result = sol.${functionName}(${JSON.stringify(inputObj)});\n`;
  } else {
    code += `const result = sol.${functionName}(${JSON.stringify(inputObj)});\n`;
  }
  
  code += `console.log(JSON.stringify(result));\n`;
  return code;
}

// -------------------------
// 🧩 8️⃣ Value Formatters
// -------------------------

function formatCppValue(value) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (Array.isArray(value)) {
    return `{${value.map(formatCppValue).join(', ')}}`;
  }
  return JSON.stringify(value);
}

function formatCppObject(obj) {
  if (Array.isArray(obj)) {
    return formatCppValue(obj);
  }
  return JSON.stringify(obj).replace(/"([^"]+)":/g, '$1:');
}

function formatPythonValue(value) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  return JSON.stringify(value);
}

function formatJavaValue(value) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (Array.isArray(value)) {
    return formatJavaArray(value);
  }
  return JSON.stringify(value);
}

function formatJavaArray(arr) {
  return `new int[]{${arr.join(', ')}}`;
}

// -------------------------
// 🧩 9️⃣ Type Helpers
// -------------------------

function getCppType(typeStr) {
  const typeMap = {
    'vector<int>': 'int',
    'vector<string>': 'string',
    'vector<vector<int>>': 'vector<int>',
    'string': 'string',
    'int': 'int',
    'bool': 'bool',
    'double': 'double'
  };
  return typeMap[typeStr] || 'auto';
}

function getJavaType(typeStr) {
  const typeMap = {
    'int[]': 'int[]',
    'String[]': 'String[]',
    'String': 'String',
    'int': 'int',
    'boolean': 'boolean',
    'double': 'double'
  };
  return typeMap[typeStr] || 'Object';
}

// -------------------------
// 🧩 🔟 Universal Wrapper Function
// -------------------------
const wrapUserCode = (language, userCode, testInputCode = "", inputTypes = [], returnType = "auto") => {
  const lang = language.toLowerCase();
  
  // Add utility functions for output formatting
  const cppHelpers = `
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <algorithm>
using namespace std;

// Utility function to print various types
// ✅ Works in C++14 (no if constexpr or is_same_v)
template<typename T>
void printResult(const T& result) {
    if (typeid(T) == typeid(vector<int>)) {
        const vector<int>& vec = reinterpret_cast<const vector<int>&>(result);
        cout << "[";
        for (size_t i = 0; i < vec.size(); i++) {
            cout << vec[i];
            if (i < vec.size() - 1) cout << ", ";
        }
        cout << "]";
    } else if (typeid(T) == typeid(vector<vector<int>>)) {
        const vector<vector<int>>& vec2d = reinterpret_cast<const vector<vector<int>>&>(result);
        cout << "[";
        for (size_t i = 0; i < vec2d.size(); i++) {
            cout << "[";
            for (size_t j = 0; j < vec2d[i].size(); j++) {
                cout << vec2d[i][j];
                if (j < vec2d[i].size() - 1) cout << ", ";
            }
            cout << "]";
            if (i < vec2d.size() - 1) cout << ", ";
        }
        cout << "]";
    } else if (typeid(T) == typeid(string)) {
        cout << "\\""<< result <<"\\"";
    } else if (typeid(T) == typeid(bool)) {
        cout << (result ? "true" : "false");
    } else {
        cout << result;
    }
    cout << endl;
}
`;

switch(lang){
   case "cpp":
    case "c++":
      return `${cppHelpers}

${userCode}

int main() {
    ${testInputCode}
    return 0;
}
`;

    case "javascript":

    case "js":
      return `${userCode}

try {
    ${testInputCode}
} catch (err) {
    console.error("Runtime error:", err);
}
`;

    case "c":
      return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

${userCode}

int main() {
    ${testInputCode}
    return 0;
}
`;

    case "c#":
      return `using System;
using System.Collections.Generic;

${userCode}

class Program {
    static void Main(string[] args) {
        try {
            ${testInputCode}
        } catch (Exception e) {
            Console.WriteLine("Runtime error: " + e.Message);
        }
    }
}
`;

    default:
      return userCode;
  }
};

// -------------------------
// 🧩 1️⃣1️⃣ Main Execution Function
// -------------------------
async function executeCode(language, userCode, testCases, functionName, inputTypes = [], returnType = "auto") {
  const languageId = getLanguageId(language);
  
  const submissions = testCases.map((testCase, index) => {
    const { inputObj, expectedOutput } = parseTestCase(testCase.input, testCase.output, language);
    const testInputCode = generateTestCode(language, functionName, inputObj, expectedOutput, inputTypes, returnType);
    const wrappedCode = wrapUserCode(language, userCode, testInputCode, inputTypes, returnType);
    
    return {
      language_id: languageId,
      source_code: Buffer.from(wrappedCode).toString('base64'),
      stdin: Buffer.from(testCase.input || '').toString('base64'),
      expected_output: Buffer.from(testCase.output || '').toString('base64'),
      base64_encoded: true
    };
  });

  const tokens = await submitBatch(submissions);
  const results = await submitToken(tokens.map(t => t.token));
  
  return results;
}

// -------------------------
// ✅ Export
// -------------------------
module.exports = {
  getLanguageId,
  submitBatch,
  submitToken,
  wrapUserCode,
  generateTestCode,
  parseTestCase,
  executeCode
};
