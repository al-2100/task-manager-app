const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware to parse JSON
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome');
});

// The projects route mounts task routes internally
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Port configuration
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
