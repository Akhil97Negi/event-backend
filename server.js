const express = require('express')
const connectDB = require('./src/config/db')
const cors = require('cors');
const userRouter = require('./src/routes/userRouter')
const eventRouter = require('./src/routes/eventRoutes');
const participantRouter = require('./src/routes/participantRoutes');
require('dotenv').config()
const app = express()
app.use(express.json())

app.use(cors())
const port  = process.env.port || 5060
const url = process.env.url

app.get('/home', (req, res) =>{
try {
    res.status(200).json({message : "welcome to home"})

} catch (err) {
    res.status(500).json({message : err})
    
}

})


//router
app.use('/api/users', userRouter);
app.use('/events', eventRouter);
app.use('/participants', participantRouter);

app.listen(port, async() =>{
    try {
        await connectDB(url)
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.log(err);
    }
})
