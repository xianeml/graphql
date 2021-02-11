const { graphQLServer, GraphQLServer } = require('graphql-yoga');

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'tutorial for GraphQL',
  },
];

/* GraphQL 스키마의 실제 구현
   각 필드와 동일한 이름을 가진 함수 구현
   모든 필드가 리졸버 함수를 가진다.
   리졸브: 쿼리를 처리하여 데이터 반환
*/
let idCount = links.length;
const resolvers = {
  Query: {
    info: () => 'API입니다',
    feed: () => links,
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
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

// 스키마와 리졸버를 서버에 전달
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

// GraphQL playground 확인 가능
server.start(() => console.log('localhost:4000에서 가동중'));
