import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let item = null;
  
  try {
    // Create the item if user exists
    item = await prisma.items.create({
      data: {
        item_name: body.item_name,
        item_description: body.item_description,
        item_pic: body.item_pic,
        item_status: body.item_status,
        item_type: body.item_type,
        latitude: body.latitude,
        longitude: body.longitude,
        reported_at: body.reported_at,
        user_id: body.user_id
      }
    });

  } catch (error) {
    console.error('Error creating item:', error);
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    });
  }

  return {
    item: item
  };
});
