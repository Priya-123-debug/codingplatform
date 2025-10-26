const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const problemSchema=new Schema({
	title:{
		type:String,
		required:true,

	},
	description:{
		type:String,
		required:true,
	},
	difficulty:{
		type:String,
		enum:["easy","medium","hard"],

	},
	tags:{
		// type:String,
		 type: [String],
		enum:["array","string","dp","tree","graph","math","greedy","backtracking"],
		required:true,
	},
	visibleTestCases:[
		{
			input:{
				type:String,
				required:true,

			},
			output:{
				type:String,
				required:true,

			},
			explanation:{
				type:String,
				required:true,
			}
		}
	],
		hiddenTestCases:[
		{
			input:{
				type:String,
				required:true,

			},
			output:{
				type:String,
				required:true,

			},
			startcode:[
				{
					language:{
						type:String,
						required:true,
					},
					initialcode:{
						type:String,
						required:true,
					}
				}
			],
		
			referencesolution:[
				{
					language:{
						type:String,
						required:true,
					},
					initialcode:{
						type:String,
						required:true,
					}
				}
			],
			
		
		}
	],
		problemcreator:{
				type:Schema.Types.ObjectId,
				required:true,
				ref:"User"
			},
})
const problem=mongoose.model("problem",problemSchema);
module.exports=problem;
