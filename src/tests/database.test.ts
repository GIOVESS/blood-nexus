import { prisma } from './setup'

describe('Database Implementation Tests', () => {
  describe('User Operations', () => {
    let testUser: any

    beforeAll(async () => {
      // Clean up and set up only once for this group
      await prisma.user.deleteMany({ where: { email: 'test@example.com' } })
      testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashed_password',
          userRoles: {
            create: {
              role: {
                connect: {
                  name: 'USER'
                }
              }
            }
          }
        }
      })
    })

    afterAll(async () => {
      await prisma.user.deleteMany({ where: { email: 'test@example.com' } })
    })

    test('should create a new user', async () => {
      expect(testUser).toBeDefined()
      expect(testUser.email).toBe('test@example.com')
    })

    test('should read user with relations', async () => {
      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      })

      expect(user).toBeDefined()
      expect(user?.userRoles[0]?.role.name).toBe('USER')
    })

    test('should update user', async () => {
      const updatedUser = await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { name: 'Updated Test User' }
      })

      expect(updatedUser.name).toBe('Updated Test User')
    })

    test('should delete user with cascade', async () => {
      await prisma.user.delete({
        where: { email: 'test@example.com' }
      })

      const deletedUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      })

      expect(deletedUser).toBeNull()
    })
  })

  describe('Blood Donation Request Operations', () => {
    let testRequest: any
    let testPatient: any
    let testAddress: any

    beforeAll(async () => {
      // Clean up and set up only once for this group
      await prisma.bloodDonationRequest.deleteMany({ where: { notes: 'Test Request' } })
      await prisma.patient.deleteMany({ where: { name: 'Test Patient' } })
      await prisma.address.deleteMany({ where: { label: 'Test Address' } })

      testAddress = await prisma.address.create({
        data: {
          label: 'Test Address',
          type: 'HOSPITAL',
          division: 'Test Division',
          district: 'Test District',
          upazila: 'Test Upazila'
        }
      })

      testPatient = await prisma.patient.create({
        data: {
          name: 'Test Patient',
          bloodGroup: 'A_POSITIVE'
        }
      })

      testRequest = await prisma.bloodDonationRequest.create({
        data: {
          requiredOn: new Date(),
          addressId: testAddress.id,
          bloodGroup: 'A_POSITIVE',
          unit: 1,
          patientId: testPatient.id,
          notes: 'Test Request',
          priority: 'HIGH'
        }
      })
    })

    afterAll(async () => {
      await prisma.bloodDonationRequest.deleteMany({ where: { notes: 'Test Request' } })
      await prisma.patient.deleteMany({ where: { name: 'Test Patient' } })
      await prisma.address.deleteMany({ where: { label: 'Test Address' } })
    })

    test('should create blood donation request with relations', async () => {
      expect(testRequest).toBeDefined()
      expect(testRequest.bloodGroup).toBe('A_POSITIVE')
    })

    test('should read blood donation request with relations', async () => {
      const request = await prisma.bloodDonationRequest.findUnique({
        where: { id: testRequest.id },
        include: {
          patient: true,
          address: true
        }
      })

      expect(request).toBeDefined()
      expect(request?.patient?.name).toBe('Test Patient')
      expect(request?.address?.label).toBe('Test Address')
    })

    test('should update blood donation request', async () => {
      const updatedRequest = await prisma.bloodDonationRequest.update({
        where: { id: testRequest.id },
        data: { priority: 'LOW' }
      })

      expect(updatedRequest.priority).toBe('LOW')
    })

    test('should delete blood donation request with cascade', async () => {
      await prisma.bloodDonationRequest.delete({
        where: { id: testRequest.id }
      })

      const deletedRequest = await prisma.bloodDonationRequest.findUnique({
        where: { id: testRequest.id }
      })

      expect(deletedRequest).toBeNull()
    })
  })

  describe('Blog Operations', () => {
    let testPost: any
    let testCategory: any

    beforeAll(async () => {
      await prisma.blogPost.deleteMany({ where: { title: 'Test Blog Post' } })
      await prisma.blogCategory.deleteMany({ where: { name: 'Test Category' } })

      testCategory = await prisma.blogCategory.create({
        data: {
          name: 'Test Category',
          slug: 'test-category'
        }
      })

      // Ensure the author exists (should be seeded in setup)
      testPost = await prisma.blogPost.create({
        data: {
          title: 'Test Blog Post',
          slug: 'test-blog-post',
          content: 'Test content',
          published: true,
          authorId: 'test-author-id',
          categories: {
            create: {
              category: {
                connect: {
                  id: testCategory.id
                }
              }
            }
          }
        }
      })
    })

    afterAll(async () => {
      await prisma.blogPost.deleteMany({ where: { title: 'Test Blog Post' } })
      await prisma.blogCategory.deleteMany({ where: { name: 'Test Category' } })
    })

    test('should create blog post with category', async () => {
      expect(testPost).toBeDefined()
      expect(testPost.title).toBe('Test Blog Post')
    })

    test('should read blog post with relations', async () => {
      const post = await prisma.blogPost.findUnique({
        where: { id: testPost.id },
        include: {
          categories: {
            include: {
              category: true
            }
          }
        }
      })

      expect(post).toBeDefined()
      expect(post?.categories[0]?.category.name).toBe('Test Category')
    })

    test('should update blog post', async () => {
      const updatedPost = await prisma.blogPost.update({
        where: { id: testPost.id },
        data: { published: false }
      })

      expect(updatedPost.published).toBe(false)
    })

    test('should delete blog post with cascade', async () => {
      await prisma.blogPost.delete({
        where: { id: testPost.id }
      })

      const deletedPost = await prisma.blogPost.findUnique({
        where: { id: testPost.id }
      })

      expect(deletedPost).toBeNull()
    })
  })

  describe('Referential Integrity Tests', () => {
    test('should maintain referential integrity on user deletion', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User for Integrity',
          email: 'integrity@example.com',
          password: 'hashed_password'
        }
      })

      const token = await prisma.token.create({
        data: {
          userId: user.id,
          token: 'test-token',
          type: 'OTP'
        }
      })

      await prisma.user.delete({
        where: { id: user.id }
      })

      const deletedToken = await prisma.token.findUnique({
        where: { id: token.id }
      })

      expect(deletedToken).toBeNull()
    })

    test('should maintain referential integrity on address deletion', async () => {
      const address = await prisma.address.create({
        data: {
          label: 'Test Address for Integrity',
          type: 'HOSPITAL',
          division: 'Test Division',
          district: 'Test District',
          upazila: 'Test Upazila'
        }
      })

      const request = await prisma.bloodDonationRequest.create({
        data: {
          requiredOn: new Date(),
          addressId: address.id,
          bloodGroup: 'A_POSITIVE',
          unit: 1
        }
      })

      await prisma.address.delete({
        where: { id: address.id }
      })

      const deletedRequest = await prisma.bloodDonationRequest.findUnique({
        where: { id: request.id }
      })

      expect(deletedRequest).toBeNull()
    })
  })
}) 