import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ["javascript", "python", "cpp", "java", "go", "c", "sqlite3"],
  },
  version: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  input: {
    type: String,
    default: "",
  },
  output: {
    type: String,
  },
  executionTime: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Code = mongoose.models.Code || mongoose.model("Code", codeSchema);

export default Code;
