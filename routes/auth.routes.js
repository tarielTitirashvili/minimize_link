const User = require('../models/User')
const { Router } = require('express')
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult }= require('express-validator')
const router = Router()
// /api/auth...
router.post(
  '/register', 
  [
    check('email', 'email is incorrect').isEmail(),
    check('password', 'password should be minimum 5 symbols').isLength({min: 5})
  ],
  async(req, res)=>{
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({
          errors: errors.array(),
          message: 'incorrect register data'
        })
      }
      const {email, password} = req.body
      const candidate = await User.findOne({email: email})
      if(candidate){
        return res.status(400).json({message: 'email is already used'})
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({email, password: hashedPassword})
      await user.save()
      res.status(201).json({message: 'user was created'})
    }catch(e){
      res.status(500).json({message: 'something went wrong please try again'})
    }
  }
)

router.post('/login',
  [
    check('email', 'enter correct email').normalizeEmail().isEmail(),
    check('password', 'enter password').exists()
  ],
  async(req, res)=>{
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({
          errors: errors.array(),
          message: 'incorrect login data'
        })
      }
      const {email, password} = req.body
      const user = await User.findOne({email: email})
      if(!user){
        return res.status(400).json({
          message: 'user not found'
        })
      }
      isMatched = await bcrypt.compare(password, user.password)
      if(!isMatched){
        return res.status(400).json({
          message: 'incorrect password'
        })
      }
      const token = jwt.sign(
        {userId: user.id},
        config.get('jwtSecretKey'),
        {expiresIn: '1h'}
      )
      res.json({message: 'authentication was successfully', token, userId: user.id})
    }catch(e){
      console.log(e)
      res.status(500).json({message: 'something went wrong please try again'})
    }
  }
)

module.exports = router