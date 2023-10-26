const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware to parse POST data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/contactDB', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Create a schema and model for contacts
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  contactMethod: String,
  services: [String],
  message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Handle form submission
app.post('/contact', async (req, res) => {
  const { name, email, phone, contactMethod, service1, service2, service3, message } = req.body;

  // Save to MongoDB
  const newContact = new Contact({
    name,
    email,
    phone,
    contactMethod,
    services: [service1, service2, service3].filter(Boolean),
    message
  });

  await newContact.save()
    .then(item => {
      res.send("Item saved to database");
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
