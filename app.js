const express = require('express')
const app= express()
const pool= require('./db/db');
const userRoutes= require('./routes/user')
const audio_bookRoutes= require('./routes/audiobooks')
const port =3000;
app.get('/', (req, res) =>{
    res.send('Welcome');
})
app.use('/users', userRoutes);
app.use('/audiobooks', audio_bookRoutes);
app.listen(port, ()=> console.log('listening on port ${port}')); 