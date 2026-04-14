let users = [];

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
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        
        const id = Date.now().toString();
        const newUser = { id, name, email };
        users.push(newUser);
        
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const updateUser = (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const updatedUser = { ...users[userIndex] };
        if (name !== undefined) updatedUser.name = name;
        if (email !== undefined) updatedUser.email = email;
        
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
