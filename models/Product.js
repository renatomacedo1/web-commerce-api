const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide a name'],
        maxLenght: [100, 'Name can not be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        default: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxLenght: [1000, 'Description can not be more than 1000 characters']
    },
    image: {
        type: String,
        default: '/uploads/example.jpg'
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['office', 'kitchen', 'bedroom']
    },
    company: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        }
    },
    colors: {
        type: [String],
        default: ['#222'],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true, toJSON:{virtuals: true}, toObject:{virtuals:true}});

// Estabelece relação entr o Product e as reviews
ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})

// Quando o hook remove é ativado para um produto, apaga também as reviews com o produto associado
ProductSchema.pre('remove', async function(next){
    await this.model('Review').deleteMany({product:this._id})
})

module.exports = mongoose.model('Product', ProductSchema);