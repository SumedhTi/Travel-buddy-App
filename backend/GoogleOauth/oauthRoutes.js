import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';
import { User } from '../Modules/Schema.js';
dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
const client = new OAuth2Client(process.env.clientID);

router.post('/google/token', async (req, res) => {
  const { id_token } = req.body;
  let isUserNew = false;
  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.clientID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ "$or": [ { "email": payload.email }, { "googleId": payload.sub } ] });
    if (!user) {
      isUserNew = true;
      user = new User({
        name: payload.name,
        googleId: payload.sub,
        email: payload.email,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, username: user.name },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
      },
      isUserNew
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

export default router;
