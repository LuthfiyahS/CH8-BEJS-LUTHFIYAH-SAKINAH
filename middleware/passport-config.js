/** @format */
require('dotenv').config();
const { UserGames, UserGamesBiodata, UserGamesHistory } = require('./../models');
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const htmlmail = require("./../controllers/handler/mail-template/welcome")
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;


const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL_GOOGLE = "https://bejs-chapter08.herokuapp.com/google/callback";
//const callbackURL_GOOGLE = "http://localhost:3000/google/callback"|| "https://bejs-chapter08.herokuapp.com/google/callback";
//const callbackURL_GOOGLE = process.env.HOST;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL_GOOGLE,
  passReqToCallback: true,
},
  function (request, accessToken, refreshToken, profile, done) {
    // let user =profile;
    // return done(null, user);
    const uid = uuidv4()
    UserGames.findOne({where: {google_id:profile.id}}).then(function (user) {
      if(!user){
        UserGames.create({uid: uid, username: profile.displayName, email:profile.email, role_id: 2, sign_with:'Google Account', google_id: profile.id})
        .then(async (user) =>{
            const email = user.email;
            //Step 1: Creating the transporter
            const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: '587',
            service: "Gmail",
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASSWORD_MAILAPP
                }
            });

            //Step 2: Setting up message options
            const messageOptions = {
                from: process.env.USER_MAIL,
                to: email,
                subject: `Welcome to PIY Game State, ${user.username}`,
                text: `Welcome to PIY Game State, ${user.username}`,
                html: htmlmail
            }

            //Step 3: Sending email
            transporter.sendMail(messageOptions, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info)
                }
            });
          return done(null, user)
        });
      }else{
        return done(null, user);
      }
    });
    
  }));

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await UserGames.findOne({ where: { username: username } }, {
        include:
          [
            { model: UserGamesBiodata, as: "biodata" },
            { model: UserGamesHistory, as: "history" }
          ]
      });
      if (!user) {
        return done(null, false, { message: 'username not found ! Please try again' });
      }
      const passVal = await bcrypt.compare(password, user.password);
      if (!passVal) {
        return done(null, false, { message: `password does not match ! Please try again` });
      }
      return done(null, user);
    } catch (err) {
      //return done(err);
      return done(null, false, { message: err });
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  UserGames.findByPk(id).then(function (user) {
    done(null, user);
  });
});
