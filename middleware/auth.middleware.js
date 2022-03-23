const config = require('config')
const jwt = require('jsonwebtoken')

module.exports= (req, res, next) =>{
  if(req.method === 'OPTIONS'){
    return next()
  }

  try{
    const token = req.headers.authorization.split()[1]
    if(!token){
      res.status(401).json({message: 'need authentication'})
    }
    const decode = jwt.verify(token, config.get('jwtSecretKey'))
    req.user = decoded
    next()

  }catch(e){
    res.status(401).json({message: 'need authentication'})
  }
}