import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const templates = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
    python: `def solve():
    # Write your code here
    pass

if __name__ == "__main__":
    solve()`,
    javascript: `function solve() {
    // Write your code here
}

solve();`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
  };

  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // ✅ NEW STATES
  const [verdict, setVerdict] = useState("");
  const [testResult, setTestResult] = useState([]);

  /* ---------------- Fetch Problem ---------------- */
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problembyid/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  /* ---------------- Get Start Code ---------------- */
  const getStartCodeForLanguage = (lang) => {
    if (!problem?.startcode?.length) return templates[lang];

    const codeObj = problem.startcode.find(
      (s) => s.language.toLowerCase() === lang.toLowerCase()
    );

    const rawCode = codeObj?.initialcode || templates[lang];
    return rawCode.replace(/\\n/g, "\n");
  };

  /* ---------------- Sync Code with Language ---------------- */
  useEffect(() => {
    if (problem) {
      setCode(getStartCodeForLanguage(language));
    }
  }, [problem, language]);

  /* ---------------- Run Code ---------------- */
  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput("Running...");
      setVerdict("");
      setTestResult([]);

      const res = await axiosClient.post(`/submission/run/${id}`, {
        language,
        code,
      });

      // ✅ BACKEND RESPONSE
      setVerdict(res.data.verdict);
      setTestResult(res.data.results);
      setOutput(res.data.verdict);

    } catch (err) {
      console.error(err);
      setOutput(err.response?.data || "Error running code");
    } finally {
      setIsRunning(false);
    }
  };

  /* ---------------- Render Guards ---------------- */
  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!problem) {
    return <div className="text-red-500 p-6">Problem not found</div>;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden">
      {/* Left Panel */}
      <div className="col-span-4 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
        <p className="text-gray-300 mb-4">{problem.description}</p>

        <p className="text-sm text-yellow-400 mb-4">
          Difficulty: {problem.difficulty}
        </p>

        <h3 className="text-lg font-semibold mb-2">Example Test Cases</h3>
        <ul className="space-y-2">
          {problem.visibleTestCases.map((test, i) => (
            <li key={i} className="bg-gray-700 p-2 rounded">
              <p><b>Input:</b> {test.input}</p>
              <p><b>Output:</b> {test.output}</p>
              <p><b>Explanation:</b> {test.explanation}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel */}
      <div className="col-span-8 bg-gray-800 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-2 border-b border-gray-700">
          <select
            className="bg-gray-800 text-white p-2 rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <div>
            <button
              onClick={handleRunCode}
              className="bg-gray-700 px-4 py-2 rounded mr-3"
            >
              Run
            </button>
            <button className="bg-yellow-500 px-4 py-2 rounded text-black">
              Submit
            </button>
          </div>
        </div>

        {/* Verdict */}
        {verdict && (
          <div
            className={`p-2 text-center font-bold ${
              verdict === "Accepted"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {verdict}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>

        {/* Output */}
        <div className="h-40 bg-black text-green-400 p-2 overflow-auto">
          {isRunning ? "Running..." : <pre>{output}</pre>}
        </div>

        {/* Testcase Results */}
        {testResult.map((t, i) => (
          <div key={i} className="text-white p-2 border-t border-gray-700">
            <p>
              Testcase {t.testcase}:{" "}
              <span
                className={
                  t.status === "Accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {t.status}
              </span>
            </p>

            {t.output && <pre>Output: {t.output}</pre>}
            {t.error && <pre className="text-red-400">Error: {t.error}</pre>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeEditor;
