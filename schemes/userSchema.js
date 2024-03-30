import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = Schema({
    username: { type: String, required: true, minLength: 4 },
    password: { type: String, required: true, minLength: 8 },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    status: {type: Number,default: 0},
    oneTimePassword: {type: Number},
    newPasswordRequest: {type: String, default: ""}
}, {
    timestamps: true,
}
);

export default mongoose.model("User", userSchema)