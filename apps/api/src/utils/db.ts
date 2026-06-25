import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function checkConnection() {
  try {
    await prisma.$connect()
    console.log('Database connection successful')
  } catch (err) {
    console.error('Database connection failed:', err)
  }
}

checkConnection()

export default prisma
