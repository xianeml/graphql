const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some'; // 사용자에게 발급할 jwt 서명에 사용

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

// 인증 요구되는 리졸버(post)에서 호출할 수 있는 헬퍼 함수
function getUserId(req, authToken) {
  if (req) {
    // context 객체에서 user jwt가 포함된 인증 헤더 가져옴
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error('Not authenticated');
}

module.exports = {
  APP_SECRET,
  getUserId,
};
