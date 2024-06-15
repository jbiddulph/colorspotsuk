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
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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

  // Delete the image from Supabase storage if it exists
  if (existingItem.item_pic) {
    const imagePath = `public/items/${existingItem.item_pic}`;
    const { error: storageError } = await supabase.storage.from('images').remove([imagePath]);

    if (storageError) {
      console.error('Error removing image from storage:', storageError);
      return createError({ statusCode: 500, statusMessage: "Error deleting image from storage" });
    }
  }

  return item;
});

