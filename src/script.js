const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// send query to the DB
// write all queries inside this function
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: 'tutorial for GraphQL',
      url: 'www.howtographql.com',
    },
  });
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect(); // close the DB connection
  });
