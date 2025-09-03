// controllers/userController.js
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Create user (supports creating admins only if current user is admin)
 * Keeps your original behaviour.
 */
export function saveUser(req, res) {
  if (req.body.role == "admin") {
    if (req.user == null) {
      res.status(403).json({
        message: "Please login as admin to create a new user",
      });
      return;
    }
    if (req.user.role != "admin") {
      res.status(403).json({
        message: "You are not authorized to create a new admin account ",
      });
      return;
    }
  }

  const hashPassword = bcrypt.hashSync(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashPassword,
    phone: req.body.phone,
    role: req.body.role,
  });

  user
    .save()
    .then(() => {
      res.status(201).json({
        message: "User saved successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error saving user",
        error: error.message,
      });
    });
}

/**
 * Email/password login (unchanged)
 */
export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (user == null) {
      res.json({ message: "User not found" });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const userData = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          isDisabled: user.isDisabled,
          isEmailVerified: user.isEmailVerified,
        };
        const token = jwt.sign(userData, process.env.JWT_KEY);
        res.json({
          message: "Login successful",
          token: token,
          user: userData,
        });
      } else {
        res.json({ message: "Incorrect password" });
      }
    }
  });
}

/**
 * Google login: verifies Google ID token, finds/creates user, returns your JWT + user payload
 * Endpoint to map in a router: POST /api/auth/google  (req.body.credential)
 */
export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Missing credential" });
    }

    // Verify with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      given_name,
      family_name,
      name,
      picture,
      email_verified,
    } = payload || {};

    if (!email) {
      return res.status(400).json({ message: "Email not available from Google" });
    }

    // Find existing user by email
    let user = await User.findOne({ email });

    // Create user if not exists (schema requires password; generate a strong random hash)
    if (!user) {
      const firstName = given_name || (name ? name.split(" ")[0] : "User");
      const lastName =
        family_name || (name ? name.split(" ").slice(1).join(" ") || "Account" : "Account");

      const randomPassword = bcrypt.hashSync(
        "google_login_" + googleId + "_" + Date.now(),
        10
      );

      user = await User.create({
        email,
        firstName,
        lastName,
        password: randomPassword, // required by your schema
        // phone, role, isDisabled, isEmailVerified use your schema defaults
        isEmailVerified: !!email_verified || true,
        // Note: if you later add optional fields to schema (e.g., googleId, avatar),
        // you can store: googleId, avatar: picture
      });
    } else {
      // Optionally mark verified if Google says so
      if (email_verified && !user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }
    }

    // Build same payload shape your loginUser sends
    const userData = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      isDisabled: user.isDisabled,
      isEmailVerified: user.isEmailVerified,
    };

    const token = jwt.sign(userData, process.env.JWT_KEY);

    return res.json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Google login error", err);
    return res.status(401).json({ message: "Invalid Google credential" });
  }
}
