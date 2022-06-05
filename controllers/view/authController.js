const { UserGames, UserGamesBiodata, UserGamesHistory, Otp } = require("../../models");
const mail = require('./../handler/email')
const otp = require('./../handler/otp')
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid')

module.exports = {
  login: (req, res) => {
    res.render('login')
  },

  register: (req, res) => {
    res.render('register')
  },

  registerproses: (req, res, next) => {
    const { username, password, email } = req.body;
    const now = new Date();
    const uid = uuidv4()
    UserGames.findOne({
      where: {
        username: username
      }
    }).then(user => {
      if (user) {
        res.status(400).render('errors/error', { status: 400, message: "Failed! Username is already in use!" })
        return;
      }
      // Email
      UserGames.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (user) {
          res.status(400).render('errors/error', { status: 400, message: "Failed! Email is already in use!" })
          return;
        }
        UserGames.create({
          uid,
          username,
          password: bcrypt.hashSync(password, 8),
          email,
          role_id: 2,
          sign_with: 'Form App',
          now,
          now,
        })
          .then((data) => {
            mail.sendMail(req, res);
            res.status(201).redirect("login");
          })
          .catch((error) => {
            res.status(500).render('errors/error', { status: 500, message: error.message })
          });
      });
    });
  },

  forgotPwd: (req, res) => {
    res.render('forgotPassword')
  },


  resetPwd: (req, res) => {
    res.render('resetPassword')
  },

  // Endpoint POST /forgot-password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body
      let modelUserGame;
      const userGame = await UserGames.findOne({where: { email: email }})
      if (!userGame) {
        res.status(404).render('errors/error', { status: 404, message: 'Email not found'})
      }
      modelUserGame = userGame

      const dataOtp = {
        otp: Math.floor(Math.random() * 1000000),
        email: modelUserGame.email,
        user_id: modelUserGame.id,
        expire_in: 2 * 60 * 1000,
      }
      let OtpProcess;
      console.log('ID USER',modelUserGame.id);
      const userOTP = await Otp.findOne({
        where: { email: email },
      })
      if (userOTP) {
        console.log('OTP UDAH ADA')
        OtpProcess = await Otp.update(dataOtp, {
          where: { user_id: modelUserGame.id }
        })
      } else {
        console.log('OTP BELUM ADA')
        OtpProcess = await Otp.create(dataOtp)
      }
      if (!OtpProcess) {
        res.status(500).render('errors/error', { status: 500, message:' Internal Server Error' })
      }
      console.log(dataOtp.otp)
      let otpuser = dataOtp.otp;
      otp.sendMail(req, res, otpuser);
      return res.status(200).render('resetPassword', { status: 200, message:'Please check your email!', email:email })
    } catch (error) {
      console.log(error)
      return res.status(500).render('errors/error', { status: 500, message:error.message})
    }
  },
  // Endpoint POST /reset-password
  otpresetPassword: async (req, res) => {
    try {
      const { otp, email } = req.body
      let modelUserGame;
      const userGame = await UserGames.findOne({where: { email: email }})
      if (!userGame) {
        return res.status(404).render('errors/error', { status: 500, message:"Email not found"})
      }
      modelUserGame = userGame
      console.log(modelUserGame.id)
      const otpData = await Otp.findOne({ where: { otp: otp, user_id: modelUserGame.id } })
      if (!otpData) { return res.status(200).render('resetPassword', { status: 404, message:'OTP not found', email:modelUserGame.email })}
      // Datenow in milisecond
      const dateNow = new Date().getTime()
      // Date Created at in milisecond
      const dateCreatedAt = otpData.dataValues.updatedAt.getTime()
      // Date Expired in milisecond
      const expire_in = otpData.dataValues.expire_in
      // Date Created at + Date Expired in milisecond
      const dateExpired = dateCreatedAt + expire_in
      if (dateNow > dateExpired) {
        return res.status(200).render('resetPassword', { status: 200, message:'OTP Expired', email:dataOtp.otp })
      }
      //return res.status(200).redirect(`/reset-password`);
      return res.status(200).render('resetPassword2', { status: 200, message:' OTP Valid', email:email , otp:otp })
    } catch (error) {
      console.log(error)
      return res.status(500).render('errors/error', { status: 500, message:error.message})
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { otp, password, email } = req.body
      let modelUserGame;
      const userGame = await UserGames.findOne({
        where: { email: email },
        include: [{ model: UserGamesBiodata, as: 'biodata' }]
      })
      if (!userGame) {
        return res.status(404).render('errors/error', { status: 500, message:"Email not found'"})
      }
      modelUserGame = userGame
      console.log(modelUserGame.id)
      const otpData = await Otp.findOne({ where: { otp: otp, user_id: modelUserGame.id } })
      if (!otpData) { return res.status(200).render('resetPassword', { status: 404, message:'OTP not found', email:modelUserGame.email })}
      // Datenow in milisecond
      const dateNow = new Date().getTime()
      // Date Created at in milisecond
      const dateCreatedAt = otpData.dataValues.updatedAt.getTime()
      // Date Expired in milisecond
      const expire_in = otpData.dataValues.expire_in
      // Date Created at + Date Expired in milisecond
      const dateExpired = dateCreatedAt + expire_in
      if (dateNow > dateExpired) {
        return res.status(200).render('resetPassword', { status: 200, message:'OTP Expired', email:dataOtp.otp })
      }
      const update = UserGames.update({
        password: bcrypt.hashSync(password, 8)
      },
        {
          where: { id: otpData.user_id },
        })
      if (!update) {
        res.status(500).render('errors/error', { status: 500, message:' Internal Server Error' })
      }
      return res.status(200).render('login', { status: 200, message:' OTP Valid' })
    } catch (error) {
      console.log(error)
      return res.status(500).render('errors/error', { status: 500, message:error.message})
    }
  },
}
