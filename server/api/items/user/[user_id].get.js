import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const {user_id} = event.context.params
console.log("USERID: ", user_id);
  return prisma.items.findMany({
    where: {
      user_id: user_id
    }
  })
})