//PATH: backend\middleware\auth.middleware.js

import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }

    // 토큰에서 해석된 사용자 정보를 req 객체에 추가합니다.
    // 이제 이 미들웨어를 통과하는 모든 요청은 req.user 정보를 갖게 됩니다.
    req.user = decoded;

    next(); // 다음 미들웨어 또는 라우트 핸들러로 이동합니다.

  } catch (error) {
    console.error("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};