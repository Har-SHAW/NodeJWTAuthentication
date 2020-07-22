var passportLocalMongoose = require('passport-local-mongoose');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);