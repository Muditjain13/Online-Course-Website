const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Define schema
const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        enrolledCourses: [
            {
                courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
                rating: { type: Number, min: 1, max: 5 },
            },
        ],
    },
    { timestamps: true } // Add createdAt and updatedAt fields
);

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Avoid overwriting the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
