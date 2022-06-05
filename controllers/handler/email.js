require('dotenv').config();
const nodemailer = require('nodemailer')
const htmlmail = require('./mail-template/welcome');
exports.sendMail = async  (req, res) => {
    try {
        if(!req.body){
            return res.json({
                success: true,
                message: "Input is missing",
                data: null
              });
        }else{
            const email = req.body.email;
            const username = req.body.username;

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
                subject: `Welcome to PIY Game State, ${username}`,
                text: `Welcome to PIY Game State, ${username}`,
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
            //next()
        }
    } catch (error) {
        console.log(error)
    }
}



