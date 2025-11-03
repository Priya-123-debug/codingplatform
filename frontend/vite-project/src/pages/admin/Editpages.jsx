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
    startCode: "",
    referenceSolution: "",
    visibleTests: [{ input: "", output: "", explanation: "" }],
    hiddenTests: [{ input: "", output: "", explanation: "" }],
  });

  // Fetch existing problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problembyid/${id}`);
        const data = res.data;
        console.log("Fetched problem:", data);

        setFormData({
          title: data?.title || "",
          description: data?.description || "",
          difficulty: data?.difficulty || "",
          // startCode: data?.hiddenTestCases?.startcode || "",
          // referenceSolution: data?.hiddenTestCases?.referencesolution || "",

					 startCode: data?.hiddenTestCases?.[0]?.startcode?.[0]?.initialcode || "",
  referenceSolution: data?.hiddenTestCases?.[0]?.referencesolution?.[0]?.initialcode || "",
          visibleTests: data?.visibleTestCases?.length
            ? data.visibleTestCases
            : [{ input: "", output: "", explanation: "" }],
          hiddenTests: data?.hiddenTestCases?.length
            ? data.hiddenTestCases
            : [{ input: "", output: "", explanation: "" }],
        });
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

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/problem/update/${id}`, formData);
      alert("✅ Problem updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.log("Error updating problem:", err);
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
          <label className="block text-gray-400 mb-1">Problem Description</label>
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
          <label className="block text-gray-400 mb-1">Starter Code</label>
          <textarea
            name="startCode"
            value={formData.startCode}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          ></textarea>
        </div>

        {/* Reference Solution */}
        <div>
          <label className="block text-gray-400 mb-1">Reference Solution</label>
          <textarea
            name="referenceSolution"
            value={formData.referenceSolution}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
          ></textarea>
        </div>

        {/* Visible Test Cases */}
        <div>
          <h3 className="text-xl font-semibold text-blue-400 mb-2">
            🌟 Visible Test Cases
          </h3>
          {formData.visibleTests.map((test, index) => (
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
                  handleTestChange("visibleTests", index, "input", e.target.value)
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
                  handleTestChange("visibleTests", index, "output", e.target.value)
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
                  handleTestChange("visibleTests", index, "explanation", e.target.value)
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <button
                type="button"
                onClick={() => removeTestCase("visibleTests", index)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestCase("visibleTests")}
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
          {formData.hiddenTests.map((test, index) => (
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
                  handleTestChange("hiddenTests", index, "input", e.target.value)
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
                  handleTestChange("hiddenTests", index, "output", e.target.value)
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
                  handleTestChange("hiddenTests", index, "explanation", e.target.value)
                }
                rows="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-2"
              ></textarea>

              <button
                type="button"
                onClick={() => removeTestCase("hiddenTests", index)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addTestCase("hiddenTests")}
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
