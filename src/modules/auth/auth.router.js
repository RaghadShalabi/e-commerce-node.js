import { Router } from 'express'
const router = Router()
import * as authController from './controller/auth.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'


router.post('/signUp', fileUpload(fileValidation.image).single("image"), authController.signUp)
router.post('/signIn', authController.signIn)
router.get('/confirmEmail/:token', authController.confirmEmail)
router.patch('/sendCode', authController.sendCode)
router.post('/forgetPassword', authController.forgetPassword)

export default router
