const jwt = require('jsonwebtoken')
const config = require('config')

module.exports= (req, res, next) =>{
  if(req.method === 'OPTIONS'){
    return next()
  }

  try{
    const token = req.headers.authorization.split(' ')[1]
    console.log(req.headers.authorization)
    if(!token){
      res.status(401).json({message: 'need authentication'})
    }
    const decode = jwt.verify(token, config.get('jwtSecretKey'))
    req.user = decode
    next()

  }catch(e){
    res.status(401).json({message: 'need authentication'})
  }
}