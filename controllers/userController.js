const Joi = require('joi');
const emailService = require('../services/emailService');

let users = [];

// Joi schemas for input validation
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(0).required()
});

const updateUserSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    age: Joi.number().integer().min(0)
});

const getAllUsers = (req, res) => {
    try {
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getUserById = (req, res) => {
    try {
        const { id } = req.params;
        const user = users.find(u => u.id === id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const createUser = (req, res) => {
    try {
        // Validate req.body data
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, email, age } = value;
        
        // Grab uploaded file info if available
        let profilePicture = null;
        if (req.file) {
            profilePicture = req.file.path;
        }

        const id = Date.now().toString();
        const newUser = { id, name, email, age, profilePicture };
        users.push(newUser);

        // Send a welcome email asynchronously
        emailService.sendWelcomeEmail(name, email);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const updateUser = (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate req.body update payload
        const { error, value } = updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const updatedUser = { ...users[userIndex] };
        
        if (value.name !== undefined) updatedUser.name = value.name;
        if (value.email !== undefined) updatedUser.email = value.email;
        if (value.age !== undefined) updatedUser.age = value.age;
        
        // Update profile picture if a new file is uploaded
        if (req.file) {
            updatedUser.profilePicture = req.file.path;
        }
        
        users[userIndex] = updatedUser;
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const deleteUser = (req, res) => {
    try {
        const { id } = req.params;
        
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        users.splice(userIndex, 1);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
