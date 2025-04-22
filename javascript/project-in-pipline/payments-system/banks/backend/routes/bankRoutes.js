import express from 'express'
// import router from 'Router'
import {
    createBank,
    getAllBanks,
    getBankByCode,
    addBranch,
} from '../controllers/bankControllers.js';

const router = express.Router();

router.post('/createBank', createBank);
router.get('/getAllBanks', getAllBanks);
router.get('/getBankByCode/:code',getBankByCode);
router.post('/addBranch', addBranch);

export default router;