const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  name:String,
  email:String
});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'}); //adicionar o plugin do passport dentro do model. Não precisa criar "senha:" no mongoose Schema! Ele já complementa.

module.exports = mongoose.model('User', userSchema);