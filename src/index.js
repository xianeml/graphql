const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/* GraphQL 스키마의 실제 구현
   각 필드와 동일한 이름을 가진 함수 구현
   모든 필드가 리졸버 함수를 가진다.
   리졸브: 쿼리를 처리하여 데이터 반환
*/
const resolvers = {
  Query: {
    info: () => 'API입니다',
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
  /*
    리졸버 첫번째 인자는 parent 또는 root 라는 걸 받는데,
    직전 리졸버 실행수준에서의 결과값이다.
    위에서 가져온 links로 Link가 이루어진다.
  */
  // Link: {
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // },
};

const fs = require('fs');
const path = require('path');

// 스키마와 리졸버를 서버에 전달
// 서버가 초기화될 때 context도 초기화, context.prisma 접근 가능
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma,
  },
});

// GraphQL playground 확인 가능
server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
