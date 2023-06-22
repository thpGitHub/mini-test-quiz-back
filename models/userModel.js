const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash the password before saving
userSchema.pre("save", async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Generate JWT token
userSchema.methods.generateToken = function() {
    const token = jwt.sign({ email: this.email }, "secret_key"); // Replace "secret_key" with your own secret key
    return token;
};


// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     token: {
//         type: String
//     }
// });

// // Hash the password before saving
// userSchema.pre("save", async function(next) {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(this.password, salt);
//         this.password = hashedPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     try {
//         return await bcrypt.compare(candidatePassword, this.password);
//     } catch (error) {
//         throw new Error(error);
//     }
// };

// // Generate JWT token and save it in the document
// userSchema.methods.generateToken = async function() {
//     const token = jwt.sign({ email: this.email }, "secret_key"); // Replace "secret_key" with your own secret key
//     this.token = token;
//     await this.save(); // Save the updated document
//     return token;
// };

// module.exports = mongoose.model("User", userSchema) 
module.exports = mongoose.model("User", userSchema) || mongoose.models("User", userSchema);
//module.exports = mongoose.model("Quiz", quizSchema) || mongoose.models("Quiz", quizSchema)