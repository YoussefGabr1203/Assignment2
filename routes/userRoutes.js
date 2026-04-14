const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

// POST requests to add new users - allows 'profilePicture' field for file uploads
router.post('/', (req, res, next) => {
    upload.single('profilePicture')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, userController.createUser);

// PUT requests to update user - allows 'profilePicture' field update 
router.put('/:id', (req, res, next) => {
    upload.single('profilePicture')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, userController.updateUser);

router.delete('/:id', userController.deleteUser);

module.exports = router;
