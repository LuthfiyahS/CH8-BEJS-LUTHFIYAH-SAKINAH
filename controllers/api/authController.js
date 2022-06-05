const { UserGames, UserGamesBiodata, Otp } = require("../../models")
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const privateKey = 'challeng-bejs'
const bcrypt = require("bcryptjs");
const response = require('../../utils/formatResponse')
const mail = require('./../handler/email')
const otp = require('./../handler/otp')


module.exports = {
  // Endpoint POST /login
  login: async (req, res) => {
    let { username, password } = req.body
    let user_games = await UserGames.findOne({ where: { username: username } })
    if (!user_games?.username) {
        return response(res, 200, false, 'Username not found', null)
    }

    var passwordIsValid = bcrypt.compareSync(
        password,
        user_games?.password
      );

      if (!passwordIsValid) {
        return response(res, 401, false, 'Invalid Password!', null)
      }

    let token = jwt.sign({
        id: user_games?.id,
        username: username,
        email: user_games?.email,
        profil: user_games?.profil,
        role_id: user_games?.role_id,
    }, privateKey, {
        expiresIn: '1d'
    });

    req.session.token = token
    await UserGames.update({token: token}, {where: {id: user_games?.id,}})

    return res.status(200).json({
        success:true,
        message: 'Username & Password is Correct',
        data: {
            'token': token,
            'expired_at': moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
    })
  },
  // Endpoint POST /register
  register: async (req, res) => {
    let { username, password, email,role_id } = req.body
    const uid = uuidv4()
    const now = new Date();

    UserGames.findOne({
    where: {
      username: username
    }
    }).then(user => {
      if (user) {
        return response(res, 400, false, 'Failed! Username is already in use!', null)
      }
      // Email
      UserGames.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (user) {
          return response(res, 400, false, 'Failed! Email is already in use!', null)
        }
        console.log('check 1')
        UserGames.create({
          uid,
          username,
          password: bcrypt.hashSync(password, 8),
          email,
          role_id,
          sign_with:'Form App',
          now,
          now,
        })
          .then((data) => {
            console.log('check 2')
            mail.sendMail(req,res);
            response(res, 201, true, 'Success insert data user games', data)
          })
          .catch((error) => {
            if (error.name === 'SequelizeDatabaseError') {
                return response(res, 400, false, error.message, null);
            }
            return response(res, 500, false, "Internal Server Error", null);
          });
      });
    });
  },
  // Endpoint POST /forgot-password
  forgotPassword: async (req, res) => {
      try {
          const { email } = req.body
          const isEmail = (text) => {
              const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
              return regex.test(text)
          }
          let modelUserGame;
          if (isEmail(email)) {
              console.log('email')
              const userGame = await UserGames.findOne({ 
                  where: { email: email },
                  include: [{model: UserGamesBiodata, as : 'biodata'}]   
              })
              if (!userGame) {
                return response(res, 404, false, 'Email not found', null)
              }
              modelUserGame = userGame
          } else {
              const userGame = await UserGames.findOne({
                  where: { username: email },
                  include: [
                      { model: UserGamesBiodata, as:'biodata' },
                      { model: Otp, as: 'otp' }
                  ]
              })
              if (!userGame) {
                  return response(res, 404, false, 'Username not found', null)
              }
              modelUserGame = userGames
          }
          const dataOtp = {
              otp: Math.floor(Math.random() * 1000000),
              email: modelUserGame.email,
              user_id: modelUserGame.id,
              expire_in: 2 * 60 * 1000,
          } 
          let OtpProcess;
          console.log(modelUserGame);
          console.log('dataOtp', Otp.otp)
          const userOTP = await Otp.findOne({ 
            where: { email: email },
          })
          if (!userOTP) {
              OtpProcess = await Otp.update(dataOtp, {
                  where: { user_id: modelUserGame.id }
              })
          } else {
              OtpProcess = await Otp.create(dataOtp)
          }
          if (!OtpProcess) {
              return response(res, 500, false, 'Internal Server Error', null)
          }
          console.log(dataOtp.otp)
          let otpuser =dataOtp.otp;
          otp.sendMail(req,res,otpuser);
          return response(res, 200, true, 'Please check your email!', null)
      } catch (error) {
          console.log(error)
          return response(res, 500, false, error.message, null)
      }
  },
  // Endpoint POST /reset-password
  resetPassword: async (req, res) => {
      try {
          const { otp, password, email } = req.body
          const isEmail = (text) => {
              const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
              return regex.test(text)
          }
          let modelUserGame;
          if (isEmail(email)) {
              console.log('email')
              const userGame = await UserGames.findOne({ 
                  where: { email: email },
                  include: [{model: UserGamesBiodata, as : 'biodata'}]   
              })
              if (!userGame) {
                return response(res, 404, false, 'Email not found', null)
              }
              modelUserGame = userGame
          } else {
              const userGame = await UserGames.findOne({
                  where: { username: email },
                  include: [
                      { model: UserGamesBiodata, as:'biodata' },
                      { model: Otp, as: 'otp' }
                  ]
              })
              if (!userGame) {
                  return response(res, 404, false, 'Username not found', null)
              }
              modelUserGame = userGames
          }
          console.log(modelUserGame.id)
          const otpData = await Otp.findOne({ where: { otp: otp, user_id: modelUserGame.id } })
          if (!otpData) { return response(res, 404, false, 'OTP not found', null) } 
          // Datenow in milisecond
          const dateNow = new Date().getTime()
          // Date Created at in milisecond
          const dateCreatedAt = otpData.dataValues.updatedAt.getTime()
          // Date Expired in milisecond
          const expire_in = otpData.dataValues.expire_in
          // Date Created at + Date Expired in milisecond
          const dateExpired = dateCreatedAt + expire_in
          if (dateNow > dateExpired) {
              return response(res, 404, false, 'OTP Expired', null)
          }
          const update = UserGames.update({
              password: bcrypt.hashSync(password, 8)
          },
          {
            where: { id:otpData.user_id },
          })
          if (!update) {
              return response(res, 500, false, 'Internal Server Error', null)
          }
          return response(res, 200, true, 'Password has been changed', null)
      } catch (error) {
          console.log(error)
          return response(res, 500, false, error.message, null)
      }
  },
}

