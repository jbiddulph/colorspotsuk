import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {

  const body = await readBody(event)
  let item = null
  let error = null
  if(body.id)

  await prisma.items.delete({
    where: {
      id: body.id
    }
  }).then((response)=> {
    item = response
  }).catch(async(e) => {
    error = e
  })
  if (error) return createError({statusCode: 500, statusMessage: "Server Error"})
  return item
})