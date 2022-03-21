const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const app = express()
app.use('/api/auth', require('./routes/auth'))
async function start() {
  try{
    await mongoose.connect(config.get('mongoUri', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }))
    const PORT = config.get('port') || 5000
    app.listen(PORT, ()=>console.log( `server starts on ${PORT} port`))
  }catch(e){
    console.log(`server error ${e.message}`)
    process.exit(1)
  }
}

start()