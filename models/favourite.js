const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const favourite = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    } ]
}, {
    timestamps: true
});

var Fourites = mongoose.model('Favourite', favourite);

module.exports = Fourites;