let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let todoSchema = new Schema({
    user: {type: String},  
    items: [String]
});

module.exports = mongoose.model("Todo", todoSchema);