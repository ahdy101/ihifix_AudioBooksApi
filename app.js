const express = require('express');
const app = express();
const pool = require('./db/db');
const audio_bookRoutes = require('./routes/audiobooks');
const userRoutes = require('./routes/user');

const port = 3000;


app.get('/', (req, res) => {
  res.send('Welcome');
});


app.use('/audiobooks', audio_bookRoutes);


app.use('/user', userRoutes);


const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');

app.use('/signup', signupRoutes); 
app.use('/login', loginRoutes);  


app.listen(port, () => console.log(`Listening on port ${port}`));
