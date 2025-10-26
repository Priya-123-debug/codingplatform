const mongoose = require("mongoose");
const Schema=mongoose.Schema;
async function main() {
  await mongoose.connect(process.env.DB_URL);
}
module.exports = main;
const userSchema = new Schema({
  firstname: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 20,
  },

  lastname: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 20,
  },
  emailid: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
    immutable: true,
  },
  age: {
    type: Number,
    min: 10,
    max: 80,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  problemsolved: {
    type: [String],
    default: [],
  },
});
