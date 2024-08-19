const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require("./routes/notes")

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
try {
  const mongoURI = 'mongodb://127.0.0.1:27017/my-mern-app'; 

  mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB database connection established successfully'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
} catch (error) {
  console.error('Error connecting to MongoDB:', error.message);
}


// CRUD operations    
app.use("/api/notes", routes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
