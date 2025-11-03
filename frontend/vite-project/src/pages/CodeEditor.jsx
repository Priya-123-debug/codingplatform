import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../utilis/axiosClient";
import { useState } from "react";
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

  const { id } = useParams(); // ✅ get problem id from URL
  const [problem, setproblem] = useState(null);
  const [loading, setloading] = useState(true);
		const [language,setlanguage]=useState('cpp');
    const [code,setcode]=useState("");
    const[output,setoutput]=useState("");
    const[isrunning,setisrunning]=useState(false);
    const[testresult,settestresult]=useState(null);
    // handle language switch
   
    const handleruncode=async()=>{
      
      try{
        setisrunning(true);
        setoutput("running...");

        const res=await axiosClient.post(`/submission/run/${id}`,{
          language:language,
          code,
          input:"",
        })
        settestresult(res.data);
        setoutput(res.data.output||"code executed successfully");
      }
      catch(err){
        console.log(err);
        setoutput("error running code",err.response?.data?.message||err.message);
      }
       finally{
      setisrunning(false);
    }
    }
   

   const getStartCodeForLanguage = (lang) => {
  if (!problem?.hiddenTestCases?.length) return templates[lang];
  
  const allStartCodes = problem.hiddenTestCases[0]?.startcode || [];
  const codeObj = allStartCodes.find(
    (entry) => entry.language.toLowerCase() === lang.toLowerCase()
  );

  const rawCode = codeObj?.initialcode || templates[lang];
  // ✅ Replace escaped newline sequences with real newlines
  return rawCode.replace(/\\n/g, "\n");
};

 const handleLanguageChange=(lang)=>{
      setlanguage(lang);
      setcode(getStartCodeForLanguage(lang));
    }


  useEffect(() => {
    //  we'll fetch problem details using this ID
    const fetchproblem = async () => {
      try {
       
        const res = await axiosClient.get(`/problem/problembyid/${id}`);
     


       
        setproblem(res?.data);
       

      } catch (err) {
        console.log("error fetching problem", err);
      } finally {
        setloading(false);
      }
    };
    fetchproblem();
  }, [id,language]);
  useEffect(() => {
  if (problem) {
    const codeForLang = getStartCodeForLanguage(language);
    console.log("✅ Setting code for", language, "→", codeForLang.slice(0, 100));
    setcode(codeForLang);
  }
}, [problem, language]);




  if (loading) {
    return (
      <div className="text-white p-6">
        <p>Loading ...</p>
      </div>
    );
  }
  if (!problem) {
    return <div className="text-red-500 p-6">problem not found</div>;
  }


  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden">
     

      <div className="col-span-4 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
        <p className="text-gray-300 mb-4">{problem.description}</p>

        <p className="text-sm text-yellow-400 mb-4">
          Difficulty: {problem.difficulty}
        </p>

        <h3 className="text-lg font-semibold mb-2">Example Test Cases:</h3>
        <div className="flex gap-4 mt-6 pt-6">
          <ul className="space-y-2 w-full">
            {problem.visibleTestCases.map((test, index) => (
              <li key={index} className="bg-gray-700 p-2 rounded ">
                <p>
                  <b>Input:</b> {test.input}
                </p>
                <p>
                  <b>Output:</b> {test.output}
                </p>
                <p>
                  <b>Explanation:</b> {test.explanation}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* editor part */}
      {/* Right Panel
 ├── Top bar  →  [Language dropdown] [Run] [Submit]
 ├── Middle  →  Editor area
 └── Bottom  →  Output/Console area */}
 
      <div className="col-span-8 bg-gray-800 p-4 overflow-y-auto flex flex-col h-screen ">
        {/* top bar */}
        <div className="flex justify-between items-center p-2 border-b">
          <div>{/* language dropdown  */}
						<select className="bg-gray-800 text-white p-2 rounded-md outline-none" defaultValue="cpp"
						value={language}
						onChange={(e)=>handleLanguageChange(e.target.value)}>
							<option value="cpp">c++</option>
							<option value="python">Python

							</option>
							<option value="java"> java

							</option>
							<option value="javascript">javascript

							</option>

						</select>
					</div>

          <div>{/* {run and submit button} */}
           <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md cursor-pointer mr-4 font-semibold"
           onClick={handleruncode}>
						Run

					 </button>
					 <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold cursor-pointer ">
           Submit
					 </button>

					</div>
        </div>

        {/* {middle area of editor} */}
       <div className="flex-1 bg-gray-900 text-white p-2">
  <Editor
  height="100%"
  theme="vs-dark"
  language={language}       // ✅ dynamic language
  value={code}              // ✅ dynamic code
  onChange={(value) => setcode(value)}   // ✅ updates when user types
  options={{
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
  }}
/>

</div>


        {/* bottom area of editor  */}
        
          {isrunning?(
            <div className="h-40 bg-black text-green-400 p-2 overflow-auto">
              Running...</div>
          ):(
            <div className="h-40 bg-black text-green-400 p-2 overflow-auto">
              <pre>{output}</pre>
              </div>
          )}

{
  testresult&&testresult.map((t,i)=>(
    <div key={i}>
<p className="text-white font-semibold">
  Testcase {i+1}:{t.status?.description}

</p>
<pre>{t.stdout}</pre>
      </div>
  ))
}



      </div>


    </div>
  );
};

export default CodeEditor;
