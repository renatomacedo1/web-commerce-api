const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
        maxLength: 50
    },
    email:{
        type: String,
        unique:true,
        required: [true, 'Please provide an email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    password:{
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 3,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
});

UserSchema.pre('save', async function(){
    console.log(this.modifiedPaths());
    console.log(this.isModified('name'));

    if(!this.isModified('password')) return;//prevents modifying the password when saving while updating other stuff
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
 
UserSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
}


module.exports = mongoose.model('User', UserSchema);