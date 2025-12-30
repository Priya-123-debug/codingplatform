import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../utilis/axiosClient";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    startcode: [{ language: "", initialcode: "" }],
    referencesolution: [{ language: "", initialcode: "" }],
    visibleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
  });

  // Fetch existing problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problembyid/${id}`);
        const data = res.data;
        // console.log("Fetched problem:", data);

        setFormData({
          title: data?.title || "",
          description: data?.description || "",
          difficulty: data?.difficulty || "",
          startcode: data?.startcode?.length
            ? data.startcode
            : [{ language: "", initialcode: "" }],
          referencesolution: data?.referencesolution?.length
            ? data.referencesolution
            : [{ language: "", initialcode: "" }],
          visibleTestCases: data?.visibleTestCases?.length
            ? data.visibleTestCases
            : [{ input: "", output: "", explanation: "" }],
          hiddenTestCases: data?.hiddenTestCases?.length
            ? data.hiddenTestCases
            : [{ input: "", output: "" }],
        });

        // console.log("Form data set to:", formData);
      } catch (err) {
        console.log("Error fetching problem:", err);
      }
    };
    fetchProblem();
  }, [id]);

  // Handle text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle visible/hidden test changes
  const handleTestChange = (type, index, field, value) => {
    const updatedTests = [...formData[type]];
    updatedTests[index][field] = value;
    setFormData({ ...formData, [type]: updatedTests });
  };

  // Add or delete test cases
  const addTestCase = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { input: "", output: "", explanation: "" }],
    });
  };

  const removeTestCase = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  // Handle code changes for startcode and referencesolution
  const handleCodeChange = (type, index, field, value) => {
    const updatedCode = [...formData[type]];
    updatedCode[index][field] = value;
    setFormData({ ...formData, [type]: updatedCode });
  };

  // Add or remove code entries
  const addCodeEntry = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { language: "", initialcode: "" }],
    });
  };

  const removeCodeEntry = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/problem/update/${id}`, formData);
      alert("✅ Problem updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.log("Error updating problem:", err);
      alert(err.response?.data?.message || "Error updating problem");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-[#f89f1b] mb-4">
        ✏️ Edit Problem
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-400 mb-1">Problem Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-400 mb-1">
            Problem Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          ></textarea>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-gray-400 mb-1">Difficulty Level</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          >
            <option value="">Select</option>
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟠 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>
        </div>

        {/* Start Code */}
        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-2">
            💻 Starter Code
          </h3>
          {formData.startcode.map((code, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-gray-400 text-sm mb-1">
                Language
              </label>
              <select
                value={code.language}
                onChange={(e) =>
                  handleCodeChange(
                    "startcode",
                    index,
                    "language",
                    e.target.value
                  )
                }
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
                required
              >
                <option value="">Select Language</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
              </select>

              <label className="block text-gray-400 text-sm mb-1">
                Initial Code
              </label>
              <textarea
                value={code.initialcode}
                onChange={(e) =>
                  handleCodeChange(
                    "startcode",
                    index,
                    "initialcode",
                    e.target.value
                  )
                }
                rows="6"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 font-mono"
              ></textarea>

              {formData.startcode.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCodeEntry("startcode", index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addCodeEntry("startcode")}
            className="text-green-400 hover:text-green-600 text-sm"
          >
            ➕ Add Starter Code
          </button>
        </div>

        {/* Reference Solution */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-400 mb-2">
            ✅ Reference Solution
          </h3>
          {formData.referencesolution.map((code, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-gray-400 text-sm mb-1">
                Language
              </label>
              <select
                value={code.language}
                onChange={(e) =>
                  handleCodeChange(
                    "referencesolution",
                    index,
                    "language",
                    e.target.value
                  )
                }
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
                required
              >
                <option value="">Select Language</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="c">C</option>
              </select>

              <label className="block text-gray-400 text-sm mb-1">
                Reference Code
              </label>
              <textarea
                value={code.initialcode}
                onChange={(e) =>
                  handleCodeChange(
                    "referencesolution",
                    index,
                    "initialcode",
                    e.target.value
                  )
                }
                rows="6"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2 font-mono"
              ></textarea>

              {formData.referencesolution.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCodeEntry("referencesolution", index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addCodeEntry("referencesolution")}
            className="text-yellow-400 hover:text-yellow-600 text-sm"
          >
            ➕ Add Reference Solution
          </button>
        </div>

        {/* Visible Test Cases */}
        <div>
          <h3 className="text-xl font-semibold text-blue-400 mb-2">
            🌟 Visible Test Cases
          </h3>
          {formData.visibleTestCases.map((test, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-gray-400 text-sm mb-1">
                Input (Visible #{index + 1})
              </label>
              <textarea
                value={test.input}
                onChange={(e) =>
                  handleTestChange(
                    "visibleTestCases",
                    index,
                    "input",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <label className="block text-gray-400 text-sm mb-1">
                Expected Output
              </label>
              <textarea
                value={test.output}
                onChange={(e) =>
                  handleTestChange(
                    "visibleTestCases",
                    index,
                    "output",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <label className="block text-gray-400 text-sm mb-1">
                Explanation
              </label>
              <textarea
                value={test.explanation || ""}
                onChange={(e) =>
                  handleTestChange(
                    "visibleTestCases",
                    index,
                    "explanation",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              {formData.visibleTestCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase("visibleTestCases", index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestCase("visibleTestCases")}
            className="text-blue-400 hover:text-blue-600 text-sm"
          >
            ➕ Add Visible Test Case
          </button>
        </div>

        {/* Hidden Test Cases */}
        <div>
          <h3 className="text-xl font-semibold text-purple-400 mb-2">
            🕵️ Hidden Test Cases
          </h3>
          {formData.hiddenTestCases.map((test, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded mb-2 bg-gray-900"
            >
              <label className="block text-gray-400 text-sm mb-1">
                Input (Hidden #{index + 1})
              </label>
              <textarea
                value={test.input}
                onChange={(e) =>
                  handleTestChange(
                    "hiddenTestCases",
                    index,
                    "input",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <label className="block text-gray-400 text-sm mb-1">
                Expected Output
              </label>
              <textarea
                value={test.output}
                onChange={(e) =>
                  handleTestChange(
                    "hiddenTestCases",
                    index,
                    "output",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <label className="block text-gray-400 text-sm mb-1">
                Explanation
              </label>
              <textarea
                value={test.explanation || ""}
                onChange={(e) =>
                  handleTestChange(
                    "hiddenTestCases",
                    index,
                    "explanation",
                    e.target.value
                  )
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              {formData.hiddenTestCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase("hiddenTestCases", index)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestCase("hiddenTestCases")}
            className="text-purple-400 hover:text-purple-600 text-sm"
          >
            ➕ Add Hidden Test Case
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#f89f1b] hover:bg-[#e98c00] text-black font-semibold py-2 rounded"
        >
          💾 Update Problem
        </button>
      </form>
    </div>
  );
};

export default EditProblem;
