import { Router } from 'express'
import UpdatePetController from '../controllers/update-pet-controller'
import DeletePetController from '../controllers/delete-pet-controller'
import { makeCreatePetController } from '../factories/make-create-pet-controller'
import { makeListPetsController } from '../factories/make-list-pets-controller'

const router = Router()

router.get('/', (_, response) => {
  response.status(200).json({ message: 'Hello World' })
})

const createPetController = makeCreatePetController()

router.post('/pet', createPetController.handle)

const listPetsController = makeListPetsController()

router.get('/pet', listPetsController.handle)

const updatePetController = new UpdatePetController()

router.put('/pet/:id', updatePetController.handle)

const deletePetController = new DeletePetController()

router.delete('/pet/:id', deletePetController.handle)

export default router
