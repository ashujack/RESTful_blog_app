var mongoose = require('mongoose');


commentSchema = mongoose.Schema({
    text: String,
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    created: {type: Date, default: Date.now}
});

var Populate = field => {
    return function(next) {
        this.populate(field);
        next();
    }
}



// var autoPopulateChildren = function(next) {
//     this.populate('children');
//     next();
// };
commentSchema
.pre('findOne', Populate('comments'))
.pre('find', Populate('comments'))


module.exports = mongoose.model('Comment', commentSchema);