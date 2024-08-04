import { it, describe, expect, beforeAll, afterAll } from 'vitest'
import { connect, disconnect, eraseRecords, createClient } from '../services/db/client'
import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../app'
import ListPetsController from './list-pets-controller'
import { Pet } from '../data/pet'
import { WithTimestamps } from '../utils/types/with-timestamps'
import { PrismaPetRepository } from '../repositories/prisma-pet-repository'
import { makeCreatePetControllerTest } from '../factories/make-create-pet-controller-test'

let dbClient: PrismaClient | undefined = undefined

type GetResponse = {
  items: WithTimestamps<Pet>[],
  totalItems: number,
  totalPages: number,
  currentPage: number,
  pageSize: number
}

describe('List Pets Controller', () => {
  beforeAll(async () => {
    dbClient = createClient()
    await connect(dbClient)
    const petRepository = new PrismaPetRepository()
    const listPetsController = new ListPetsController(petRepository)

    app.get('/pet', listPetsController.handle)

    const createPetController = makeCreatePetControllerTest()

    app.post('/pet', createPetController.handle)

  })

  afterAll(async () => {
    if (!dbClient) {
      return
    }

    await disconnect(dbClient)
    await eraseRecords(dbClient)
  })

  describe('when is created a pet', () => {
    it('should return the data of pet created', async () => {
      const pet: Pet = {
        name: 'Ella',
        age: 1,
        breed: 'Pelo Curto Brasileiro',
        contactId: '44671233162'
      }

      await request(app)
        .post('/pet')
        .send(pet)

      const response = await request(app).get('/pet').send()

      const petResponse = {
        name: pet.name,
        age: pet.age
      }

      const responseBody: GetResponse = response.body
      expect(responseBody.items).toEqual(expect.arrayContaining([
        expect.objectContaining(petResponse)
      ]))
    })
  })
})