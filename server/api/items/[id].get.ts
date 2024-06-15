import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const params = event.context.params;

  if (!params || !params.id) {
    throw new Error('Missing parameter: id');
  }

  const id = params.id;
  console.log("item: ", id);

  return prisma.items.findUnique({
    where: {
      id: Number(id) // Assuming id is a number, convert it accordingly
    }
  });
});