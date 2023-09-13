const mongoose = require('mongoose');
const slugify = require('slugify')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        // required:true,
        // unique:true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
})

categorySchema.pre('save', function (next) {
    const slug = slugify(this.name, {
        lower: true,
        strict: true,
    });
    this.slug = slug;
    next();
});

module.exports = mongoose.model('Category', categorySchema)