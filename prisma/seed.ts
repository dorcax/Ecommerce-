import { PrismaClient } from '@prisma/client'
import * as bcrypt from "bcrypt"
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'opeyemiibrahim667@gmail.com' },
    update: {},
    create: {
      email: 'opeyemiibrahim667@gmail.com',
      name: 'bolubee',
      password: await bcrypt.hash("opeyemiibrahim",10),
      role:"ADMIN"
    
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })