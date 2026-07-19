const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, profileController.getProfile);
router.post('/', profileController.createProfile); 
router.put('/', authMiddleware, profileController.updateProfile);
router.put('/:id', authMiddleware, profileController.updateProfileById);
router.delete('/', authMiddleware, profileController.deleteProfile);
router.delete('/:id', authMiddleware, profileController.deleteProfile);
router.get('/all', authMiddleware, profileController.getAllProfiles); 
router.get('/:id', authMiddleware, profileController.getProfile);

module.exports = router;