const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');

const prisma = new PrismaClient();

/* GraphQL 스키마의 실제 구현
   각 필드와 동일한 이름을 가진 함수 구현
   모든 필드가 리졸버 함수를 가진다.
   리졸브: 쿼리를 처리하여 데이터 반환
*/
const resolvers = {
  Query,
  Mutation,
  User,
  Link,
};

const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');

// 스키마와 리졸버를 서버에 전달
// 서버가 초기화될 때 context도 초기화, context.prisma 접근 가능
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

// GraphQL playground 확인 가능
server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
