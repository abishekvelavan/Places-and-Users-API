const mongoose = require('mongoose');
const unique_validator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required:true, unique:true},
    password: {type: String, required: true, minlength: 6},
    image: {type: String, required: false},
    places: [{type: mongoose.Types.ObjectId, required: false, ref:'Place'}],
});

userSchema.plugin(unique_validator);
module.exports = mongoose.model('User', userSchema);