// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default defineEventHandler(async (event) => {
//   const {user_id} = event.context.params
// console.log("USERID: ", user_id);
//   return prisma.items.findMany({
//     where: {
//       user_id: user_id
//     }
//   })
// })

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { user_id } = event.context.params;
  const query = getQuery(event);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    prisma.items.findMany({
      where: {
        user_id: user_id,
      },
      skip: skip,
      take: limit,
    }),
    prisma.items.count({
      where: {
        user_id: user_id,
      },
    }),
  ]);

  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
  };
});
