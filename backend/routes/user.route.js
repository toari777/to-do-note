//PATH: backend\routes\user.route.js

import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js"

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // [추가] 비밀번호 해싱 과정
    const salt = await bcrypt.genSalt(10); // 1. 솔트(salt) 생성
    const hashedPassword = await bcrypt.hash(password, salt); // 2. 비밀번호와 솔트를 합쳐 해싱

    // [수정] 해싱된 비밀번호로 새로운 유저 생성
    const newUser = await User.create({ email, password: hashedPassword });
    console.log(hashedPassword)
    res.status(201).json(newUser);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ email });

    // [수정] 비밀번호 비교 로직 변경
    // 사용자가 입력한 비밀번호와 DB에 저장된 해시값을 bcrypt로 비교
    const isPasswordCorrect = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isPasswordCorrect) {
      // 유저가 없거나 비밀번호가 틀리면 동일한 에러 메시지를 보내 보안 강화
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // ... 토큰 생성 및 쿠키 설정 (이하 동일) ...
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: 'Login successful', user: { _id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.post('/logout', (req, res) => {
  try {
    // 클라이언트의 토큰 쿠키를 비웁니다.
    res.cookie('token', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router;