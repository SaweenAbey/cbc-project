// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  role:      { type: String, required: true, default: "user" },
  password:  { type: String, required: true }, // keep required
  phone:     { type: String, required: true, default: "Not Given" },
  isDisabled:{ type: Boolean, default: false, required: true },
  isEmailVerified: { type: Boolean, default: false, required: true },

  // ⬇️ NEW (not required to preserve your current create user path)
  googleId: { type: String },
  avatar:   { type: String }
});

const User = mongoose.model("users", userSchema);
export default User;
