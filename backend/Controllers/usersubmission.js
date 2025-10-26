const problem=require("../models/problem");
const Submission = require("../models/submission");
const {getLanguageId,submitBatch,submitToken}=require("../utilis/Problemutility");

const submitcode=async(req,res)=>{

	  try{
			 
          const userid=req.result._id;
					const problemid=req.params.id;
					const {code,language}=req.body;
					if(!userid||!problemid||!code||!language){
						return res.status(400).send("missing required fields");
					}
		const problemindatabase=	await		problem.findById(problemid);
		// const submittedresult=await Submission.create({
		// 	userid,
		// 	problemid,
		// 	code,
		// 	language,
		
		// 	status:'pending',
		// 	testCasetotal:problemindatabase.hiddenTestCases.length,




		// })
		const submittedresult = await Submission.create({
    userId: userid,       // <-- camelCase
    problemId: problemid, // <-- camelCase
    code,
    language,
    status: 'pending',
    testCasetotal: problemindatabase.hiddenTestCases.length,
});

		// judge0 code ko submit krna hai
		const languageid=getLanguageId(language);
		const submissions= problemindatabase.hiddenTestCases.map((testcase)=>({
			source_code:code,
			language_id:languageid,
			stdin:testcase.input,
			expected_output:testcase.output,


		}));
		const submitresult=await submitBatch(submissions);
			const resulttoken=submitresult.map((value)=>value.token);
			  const testresult=    await submitToken(resulttoken);
				// submitted result ko update kro
				let testcasepassed=0;
				let runtime=0;
				let memory=0;
				let status="Accepted";
				let  errormessage=null;

				for(const test of testresult){
					if(test.status._id==3){
						testcasepassed++;
						runtime=runtime+parseFloat(test.time)
						memory=Math.max(memory,parseInt(test.memory));

					}
					else{
             if(test.status._id==4){
							status="error";
							errormessage=test.stderr;
						 }
						 else{
							status="wrong answer";
						 }
					}
				}
				// store the result in database in submission
				submittedresult.status=status;
				submittedresult.testCasepassed=testcasepassed;
				submittedresult.errormessage=errormessage;
				submittedresult.runtime=runtime;
				submittedresult.memory=memory;
				await submittedresult.save();
   // problemid ko insert karenge userschema ke problemsolved me if it is not present 
	 if(!req.result.problemsolved.includes(problemid)){
		req.result.problemsolved.push(problemid);
		await req.result.save();  // save changes in database
	 }



res.status(201).send(submittedresult);


					// fetch the problem from the database
					// kya apne submission store kar du pahle

		}
		catch(err){
			res.status(500).send("internal server error "+err.message);

		}
}

const runcode =
async(req,res)=>{

	  try{
			 
          const userid=req.result._id;
					const problemid=req.params.id;
					const {code,language}=req.body;
					if(!userid||!problemid||!code||!language){
						return res.status(400).send("missing required fields");
					}
		const problemindatabase=	await		problem.findById(problemid);
		// const submittedresult=await Submission.create({
		// 	userid,
		// 	problemid,
		// 	code,
		// 	language,
		
		// 	status:'pending',
		// 	testCasetotal:problemindatabase.hiddenTestCases.length,




		// })

		// judge0 code ko submit krna hai
		const languageid=getLanguageId(language);
		const submissions= problemindatabase.visibleTestCases.map((testcase)=>({
			source_code:code,
			language_id:languageid,
			stdin:testcase.input,
			expected_output:testcase.output,


		}));
				const submitresult=await submitBatch(submissions);
			const resulttoken=submitresult.map((value)=>value.token);
			  const testresult=    await submitToken(resulttoken);

				
			



res.status(201).send(testresult);;


					// fetch the problem from the database
					// kya apne submission store kar du pahle

		}
		catch(err){
			res.status(500).send("internal server error "+err.message);

		}}
module.exports={submitcode,runcode};