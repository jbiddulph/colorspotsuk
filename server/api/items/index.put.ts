import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = parseInt(body.id);

  try {
    // Validate id
    if (isNaN(id)) {
      throw new Error("Invalid id");
    }

    const item = await prisma.items.update({
      where: { id: id },
      data: {
        item_name: body.item_name,
        item_description: body.item_description,
        item_pic: body.item_pic,
        item_status: body.item_status,
        item_type: body.item_type,
        latitude: body.latitude,
        longitude: body.longitude,
        reported_on: body.reported_on,
        reported_at: body.reported_at,
        user_id: body.user_id
      },
    });

    return item;
  } catch (error) {
    // Handle errors
    return createError({ statusCode: 500, statusMessage: error.message });
  }
});
