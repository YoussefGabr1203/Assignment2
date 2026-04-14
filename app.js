const express = require('express');
const userRoutes = require('./routes/userRoutes');
const router = express.Router();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/users', userRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
