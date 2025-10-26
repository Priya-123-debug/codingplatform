const express=require("express");
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const cookieparser=require("cookie-parser");
const authRouter= require("./routes/userauth");
const problemrouter=require("./routes/problemcreate");
const submitrouter=require("./routes/submit");
const cors=require('cors');
app.use(cors({
	origin:'http://localhost:5173',
	credentials:true,
}))
app.use(express.json());
app.use(cookieparser());
app.use('/user',authRouter);
app.use('/problem',problemrouter);
app.use('/submission',submitrouter);
const main=require("./utilis/db");

/// cookie come in json format 
const port =process.env.PORT||5000;;
main().then(()=>{
	app.listen(port,()=>{
	console.log(`server is running on port ${port}`);
})

}).catch((err)=>{
	console.log(err);
})

