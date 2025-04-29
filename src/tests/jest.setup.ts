import { PrismaClient } from '@prisma/client'

// Create a new Prisma Client for testing
const prisma = new PrismaClient()

// Clean up the database before tests
beforeAll(async () => {
  // Add any necessary setup here
})

// Clean up the database after tests
afterAll(async () => {
  await prisma.$disconnect()
})

// Reset the database between tests
beforeEach(async () => {
  // Add any necessary cleanup here
}) 