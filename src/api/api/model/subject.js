const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
