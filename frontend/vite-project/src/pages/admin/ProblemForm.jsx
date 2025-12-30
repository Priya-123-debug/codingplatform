// // pages/admin/ProblemForm.jsx
// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axiosClient from "../../utilis/axiosClient";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// const ProblemForm = () => {
//   const navigate = useNavigate();
//   // const token = useSelector((state) => state.auth.user?.token);
// 	//   const [token, setToken] = useState(null);

//   // useEffect(() => {
//   //   const storedToken = localStorage.getItem("token");
//   //   if (storedToken) setToken(storedToken);
//   // }, []);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     difficulty: "easy",
//     tags: [],
//     visibleTestCases: [{ input: "", output: "", explanation: "" }],
//     hiddenTestCases: [
//       {
//         input: "",
//         output: "",
//         startcode: [{ language: "cpp", initialcode: "" }],
//         referencesolution: [{ language: "cpp", initialcode: "" }],
//       },
//     ],
//   });

//   // Basic input changes
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Tags
//   const handleTagChange = (tag) => {
//     if (!formData.tags.includes(tag))
//       setFormData({ ...formData, tags: [...formData.tags, tag] });
//   };

//   const removeTag = (tag) => {
//     setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
//   };

//   // Visible test cases
//   const addVisibleTestCase = () => {
//     setFormData({
//       ...formData,
//       visibleTestCases: [
//         ...formData.visibleTestCases,
//         { input: "", output: "", explanation: "" },
//       ],
//     });
//   };

//   const updateVisibleTestCase = (index, key, value) => {
//     const newCases = [...formData.visibleTestCases];
//     newCases[index][key] = value;
//     setFormData({ ...formData, visibleTestCases: newCases });
//   };

//   // Hidden test cases
//   const addHiddenTestCase = () => {
//     setFormData({
//       ...formData,
//       hiddenTestCases: [
//         ...formData.hiddenTestCases,
//         {
//           input: "",
//           output: "",
//           startcode: [{ language: "cpp", initialcode: "" }],
//           referencesolution: [{ language: "cpp", initialcode: "" }],
//         },
//       ],
//     });
//   };

//   const updateHiddenTestCase = (index, key, value) => {
//     const newCases = [...formData.hiddenTestCases];
//     newCases[index][key] = value;
//     setFormData({ ...formData, hiddenTestCases: newCases });
//   };

//   // Startcode & ReferenceSolution inside hidden test cases
//   const updateNestedCode = (hiddenIndex, type, codeIndex, field, value) => {
//     const newCases = [...formData.hiddenTestCases];
//     newCases[hiddenIndex][type][codeIndex][field] = value;
//     setFormData({ ...formData, hiddenTestCases: newCases });
//   };

//   const addNestedCode = (hiddenIndex, type) => {
//     const newCases = [...formData.hiddenTestCases];
//     newCases[hiddenIndex][type].push({ language: "cpp", initialcode: "" });
//     setFormData({ ...formData, hiddenTestCases: newCases });
//   };

//   // Submit

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     await axiosClient.post("/problem/create", formData, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     alert("Problem created successfully!");
//   //     navigate("/admin");
//   //   } catch (err) {
//   //     console.log("Error saving problem:", err);
//   //     alert(err.response?.data?.message || "Error saving problem");
//   //   }
//   // };
// 	const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     // No need to send Authorization header
//     await axiosClient.post("/problem/create", formData);
//     alert("Problem created successfully!");
//     navigate("/admin");
//   } catch (err) {
//     console.error("Error saving problem:", err.response?.data || err);
//     alert(err.response?.data?.message || "Error saving problem");
//   }
// };

//   return (
//     <div className="p-6 bg-gray-900 text-white rounded-lg max-w-5xl mx-auto">
//       <h2 className="text-2xl mb-4">Create Problem</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Title */}
//         <input
//           name="title"
//           placeholder="Problem Title"
//           value={formData.title}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 rounded bg-gray-800"
//           required
//         />

//         {/* Description */}
//         <textarea
//           name="description"
//           placeholder="Problem Description"
//           value={formData.description}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 rounded bg-gray-800"
//           rows={6}
//           required
//         />

//         {/* Difficulty */}
//         <select
//           name="difficulty"
//           value={formData.difficulty}
//           onChange={handleChange}
//           className="w-full mb-4 p-2 rounded bg-gray-800"
//         >
//           <option value="easy">Easy</option>
//           <option value="medium">Medium</option>
//           <option value="hard">Hard</option>
//         </select>

//         {/* Tags */}
//         <div className="mb-4 flex flex-wrap gap-2">
//           {["array", "string", "dp", "tree", "graph", "math", "greedy", "backtracking"].map(
//             (tag) => (
//               <button
//                 type="button"
//                 key={tag}
//                 onClick={() => handleTagChange(tag)}
//                 className={`px-2 py-1 rounded ${
//                   formData.tags.includes(tag) ? "bg-blue-500" : "bg-gray-600"
//                 }`}
//               >
//                 {tag}
//               </button>
//             )
//           )}
//         </div>

//         {/* Visible Test Cases */}
//         <h3 className="text-xl mb-2">Visible Test Cases</h3>
//         {formData.visibleTestCases.map((tc, i) => (
//           <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
//             <input
//               placeholder="Input"
//               value={tc.input}
//               onChange={(e) => updateVisibleTestCase(i, "input", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//               required
//             />
//             <input
//               placeholder="Output"
//               value={tc.output}
//               onChange={(e) => updateVisibleTestCase(i, "output", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//               required
//             />
//             <input
//               placeholder="Explanation"
//               value={tc.explanation}
//               onChange={(e) => updateVisibleTestCase(i, "explanation", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//             />
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addVisibleTestCase}
//           className="mb-4 px-4 py-2 bg-green-500 rounded"
//         >
//           Add Visible Test Case
//         </button>

//         {/* Hidden Test Cases */}
//         <h3 className="text-xl mb-2">Hidden Test Cases</h3>
//         {formData.hiddenTestCases.map((tc, i) => (
//           <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
//             <input
//               placeholder="Input"
//               value={tc.input}
//               onChange={(e) => updateHiddenTestCase(i, "input", e.target.value)}
//               className="w-full mb-1 p-1 rounded bg-gray-700"
//               required
//             />
//             <input
//               placeholder="Output"
//               value={tc.output}
//               onChange={(e) => updateHiddenTestCase(i, "output", e.target.value)}
//               className="w-full mb-2 p-1 rounded bg-gray-700"
//               required
//             />

//             {/* Startcode */}
//             <h4 className="text-lg mb-1">Start Code</h4>
//             {tc.startcode.map((sc, j) => (
//               <div key={j} className="mb-1">
//                 <input
//                   placeholder="Language"
//                   value={sc.language}
//                   onChange={(e) => updateNestedCode(i, "startcode", j, "language", e.target.value)}
//                   className="mr-2 mb-1 p-1 rounded bg-gray-700"
//                   required
//                 />
//                 <textarea
//                   placeholder="Initial Code"
//                   value={sc.initialcode}
//                   onChange={(e) => updateNestedCode(i, "startcode", j, "initialcode", e.target.value)}
//                   className="w-full mb-1 p-1 rounded bg-gray-700"
//                   rows={3}
//                   required
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addNestedCode(i, "startcode")}
//               className="mb-2 px-3 py-1 bg-green-500 rounded"
//             >
//               Add Start Code
//             </button>

//             {/* Reference Solution */}
//             <h4 className="text-lg mb-1">Reference Solution</h4>
//             {tc.referencesolution.map((rs, j) => (
//               <div key={j} className="mb-1">
//                 <input
//                   placeholder="Language"
//                   value={rs.language}
//                   onChange={(e) => updateNestedCode(i, "referencesolution", j, "language", e.target.value)}
//                   className="mr-2 mb-1 p-1 rounded bg-gray-700"
//                   required
//                 />
//                 <textarea
//                   placeholder="Reference Code"
//                   value={rs.initialcode}
//                   onChange={(e) => updateNestedCode(i, "referencesolution", j, "initialcode", e.target.value)}
//                   className="w-full mb-1 p-1 rounded bg-gray-700"
//                   rows={3}
//                   required
//                 />
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addNestedCode(i, "referencesolution")}
//               className="mb-2 px-3 py-1 bg-green-500 rounded"
//             >
//               Add Reference Solution
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addHiddenTestCase}
//           className="mb-4 px-4 py-2 bg-green-500 rounded"
//         >
//           Add Hidden Test Case
//         </button>

//         <button type="submit" className="px-6 py-2 bg-blue-500 rounded">
//           Save Problem
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ProblemForm;

// pages/admin/ProblemForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../utilis/axiosClient";

const ProblemForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: [],
    visibleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
    startcode: [{ language: "", initialcode: "" }],
    referencesolution: [{ language: "", initialcode: "" }],
  });

  // Basic input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Tags
  const handleTagChange = (tag) => {
    if (!formData.tags.includes(tag))
      setFormData({ ...formData, tags: [...formData.tags, tag] });
  };
  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  // Visible test cases
  const addVisibleTestCase = () =>
    setFormData({
      ...formData,
      visibleTestCases: [
        ...formData.visibleTestCases,
        { input: "", output: "", explanation: "" },
      ],
    });
  const updateVisibleTestCase = (index, key, value) => {
    const newCases = [...formData.visibleTestCases];
    newCases[index][key] = value;
    setFormData({ ...formData, visibleTestCases: newCases });
  };
  const removeVisibleTestCase = (index) => {
    const newCases = formData.visibleTestCases.filter((_, i) => i !== index);
    setFormData({ ...formData, visibleTestCases: newCases });
  };

  // Hidden test cases
  const addHiddenTestCase = () =>
    setFormData({
      ...formData,
      hiddenTestCases: [...formData.hiddenTestCases, { input: "", output: "" }],
    });
  const updateHiddenTestCase = (index, key, value) => {
    const newCases = [...formData.hiddenTestCases];
    newCases[index][key] = value;
    setFormData({ ...formData, hiddenTestCases: newCases });
  };
  const removeHiddenTestCase = (index) => {
    const newCases = formData.hiddenTestCases.filter((_, i) => i !== index);
    setFormData({ ...formData, hiddenTestCases: newCases });
  };

  // Startcode & Reference Solution
  const updateCode = (type, index, key, value) => {
    const newArr = [...formData[type]];
    newArr[index][key] = value;
    setFormData({ ...formData, [type]: newArr });
  };
  const addCode = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { language: "", initialcode: "" }],
    });
  };
  const removeCode = (type, index) => {
    const newArr = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: newArr });
  };

  // Submit
  const handleSubmit = async (e) => {
    // console.log("Data being sent to backend:", formData);
    e.preventDefault();
    try {
      await axiosClient.post("/problem/create", formData);
      alert("Problem created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error saving problem:", err.response?.data || err);
      alert(err.response?.data?.message || "Error saving problem");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl mb-4">Create Problem</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <input
          name="title"
          placeholder="Problem Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-800"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Problem Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-800"
          rows={6}
          required
        />

        {/* Difficulty */}
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-800"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            "array",
            "string",
            "dp",
            "tree",
            "graph",
            "math",
            "greedy",
            "backtracking",
          ].map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={`px-2 py-1 rounded ${
                formData.tags.includes(tag) ? "bg-blue-500" : "bg-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Visible Test Cases */}
        <h3 className="text-xl mb-2">Visible Test Cases</h3>
        {formData.visibleTestCases.map((tc, i) => (
          <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
            <input
              placeholder="Input"
              value={tc.input}
              onChange={(e) =>
                updateVisibleTestCase(i, "input", e.target.value)
              }
              className="w-full mb-1 p-1 rounded bg-gray-700"
              required
            />
            <input
              placeholder="Output"
              value={tc.output}
              onChange={(e) =>
                updateVisibleTestCase(i, "output", e.target.value)
              }
              className="w-full mb-1 p-1 rounded bg-gray-700"
              required
            />
            <input
              placeholder="Explanation"
              value={tc.explanation}
              onChange={(e) =>
                updateVisibleTestCase(i, "explanation", e.target.value)
              }
              className="w-full mb-1 p-1 rounded bg-gray-700"
            />
            {formData.visibleTestCases.length > 1 && (
              <button
                type="button"
                onClick={() => removeVisibleTestCase(i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addVisibleTestCase}
          className="mb-4 px-4 py-2 bg-green-500 rounded"
        >
          Add Visible Test Case
        </button>

        {/* Hidden Test Cases */}
        <h3 className="text-xl mb-2">Hidden Test Cases</h3>
        {formData.hiddenTestCases.map((tc, i) => (
          <div key={i} className="mb-4 p-2 bg-gray-800 rounded">
            <input
              placeholder="Input"
              value={tc.input}
              onChange={(e) => updateHiddenTestCase(i, "input", e.target.value)}
              className="w-full mb-1 p-1 rounded bg-gray-700"
              required
            />
            <input
              placeholder="Output"
              value={tc.output}
              onChange={(e) =>
                updateHiddenTestCase(i, "output", e.target.value)
              }
              className="w-full mb-1 p-1 rounded bg-gray-700"
              required
            />
            {formData.hiddenTestCases.length > 1 && (
              <button
                type="button"
                onClick={() => removeHiddenTestCase(i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addHiddenTestCase}
          className="mb-4 px-4 py-2 bg-green-500 rounded"
        >
          Add Hidden Test Case
        </button>

        {/* Startcode */}
        <h3 className="text-xl mb-2">Start Code</h3>
        {formData.startcode.map((sc, i) => (
          <div key={i} className="mb-2 p-2 bg-gray-800 rounded">
            <label className="block text-gray-400 text-sm mb-1">
              Language
            </label>
            <select
              value={sc.language}
              onChange={(e) =>
                updateCode("startcode", i, "language", e.target.value)
              }
              className="w-full mb-2 p-2 rounded bg-gray-700"
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
              placeholder="Initial Code"
              value={sc.initialcode}
              onChange={(e) =>
                updateCode("startcode", i, "initialcode", e.target.value)
              }
              className="w-full mb-1 p-1 rounded bg-gray-700 font-mono"
              rows={5}
              required
            />
            {formData.startcode.length > 1 && (
              <button
                type="button"
                onClick={() => removeCode("startcode", i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addCode("startcode")}
          className="mb-4 px-3 py-1 bg-green-500 rounded"
        >
          Add Start Code
        </button>

        {/* Reference Solution */}
        <h3 className="text-xl mb-2">Reference Solution</h3>
        {formData.referencesolution.map((rs, i) => (
          <div key={i} className="mb-2 p-2 bg-gray-800 rounded">
            <label className="block text-gray-400 text-sm mb-1">
              Language
            </label>
            <select
              value={rs.language}
              onChange={(e) =>
                updateCode("referencesolution", i, "language", e.target.value)
              }
              className="w-full mb-2 p-2 rounded bg-gray-700"
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
              placeholder="Reference Code"
              value={rs.initialcode}
              onChange={(e) =>
                updateCode(
                  "referencesolution",
                  i,
                  "initialcode",
                  e.target.value
                )
              }
              className="w-full mb-1 p-1 rounded bg-gray-700 font-mono"
              rows={5}
              required
            />
            {formData.referencesolution.length > 1 && (
              <button
                type="button"
                onClick={() => removeCode("referencesolution", i)}
                className="mt-1 text-red-400 hover:text-red-600 text-sm"
              >
                ❌ Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addCode("referencesolution")}
          className="mb-4 px-3 py-1 bg-green-500 rounded"
        >
          Add Reference Solution
        </button>

        <button type="submit" className="px-6 py-2 bg-blue-500 rounded">
          Save Problem
        </button>
      </form>
    </div>
  );
};

export default ProblemForm;
