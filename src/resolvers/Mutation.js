const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

async function signup(parent, args, context, info) {
  // 1. user의 비밀번호 암호화(bcrypt 라이브러리 사용)
  const password = await bcrypt.hash(args.password, 10);
  // 2. prisma client 사용, db에 새로운 user 저장
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  // 3. APP_SECRET으로 사인된 jwt 생성.
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  // 4. AuthPayload 형태에 맞는 객체 반환
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  // 1. prisma client 사용, user 레코드 검색 후 반환.
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error('No such user found');
  }
  // 2. pw 비교
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

module.exports = {
  signup,
  login,
  post,
};
