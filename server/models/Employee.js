const mongoose =require('mongoose');
const Schema = mongoose.Schema;

let StudentSchema = new Schema({
    name:{
        type:String
    },
    about:{
        type:String
    },
    email:{
        type:String
    },
    company :{
        type:String
    },
    designation :{
        type:String
    },
    address:{
        type:String
    },
    phone:{
        type:String
    },
    image:{
        type:Buffer
    }

},
{
    collection:'employees'
})
module.exports=mongoose.model('Employee',StudentSchema)