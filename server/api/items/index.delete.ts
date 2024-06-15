// import { PrismaClient } from "@prisma/client"
// const prisma = new PrismaClient();

// export default defineEventHandler(async (event) => {

//   const body = await readBody(event)
//   let item = null
//   let error = null
//   if(body.id)

//   await prisma.items.delete({
//     where: {
//       id: body.id
//     }
//   }).then((response)=> {
//     item = response
//   }).catch(async(e) => {
//     error = e
//   })
//   if (error) return createError({statusCode: 500, statusMessage: "Server Error"})
//   return item
// })

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let item = null;
  let error = null;

  if (!body.id) {
    return createError({ statusCode: 400, statusMessage: "Invalid request, missing item ID" });
  }

  // Fetch the item to get the image path before deleting
  const existingItem = await prisma.items.findUnique({
    where: {
      id: body.id,
    },
  });

  if (!existingItem) {
    return createError({ statusCode: 404, statusMessage: "Item not found" });
  }
  // Delete the item from the database
  await prisma.items.delete({
    where: {
      id: body.id,
    },
  }).then((response) => {
    item = response;
  }).catch((e) => {
    error = e;
  });

  if (error) return createError({ statusCode: 500, statusMessage: "Server Error" });


  return item;
});

