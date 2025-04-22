// Admin login, manage banks
import express from 'express';
import {adminRegister, adminLogin, getAdminProfile} from '../controllers/adminControllers.js';


const router = express.Router();

router.post('/adminRegister', adminRegister);
router.post('/adminLogin', adminLogin);
router.get('/getAdminProfile', getAdminProfile);

export default router;