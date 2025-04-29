import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

beforeAll(async () => {
  try {
    await prisma.$connect()
    // Clean up the database before running tests
    await prisma.$transaction([
      prisma.bloodDonationRequest.deleteMany(),
      prisma.patient.deleteMany(),
      prisma.user.deleteMany(),
      prisma.role.deleteMany(),
      prisma.address.deleteMany(),
      prisma.blogCategory.deleteMany(),
      prisma.blogPost.deleteMany(),
      prisma.token.deleteMany(),
    ])
    // Seed required roles
    await prisma.role.createMany({
      data: [
        { name: 'USER', description: 'Default user role' },
        { name: 'ADMIN', description: 'Administrator role' }
      ],
      skipDuplicates: true
    })
    // Seed a test author user for blog posts
    await prisma.user.create({
      data: {
        id: 'test-author-id', // Use the same id as in your tests
        name: 'Test Author',
        email: 'author@example.com',
        password: 'hashed_password'
      }
    })
  } catch (error) {
    console.error('Error setting up test database:', error)
    throw error
  }
})

afterAll(async () => {
  await prisma.$disconnect()
})

export { prisma } 