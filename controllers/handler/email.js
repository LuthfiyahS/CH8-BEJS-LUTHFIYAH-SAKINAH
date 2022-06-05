require('dotenv').config();
const nodemailer = require('nodemailer')
const fs = require('fs');
const htmlmail = require('./mail-template/welcome');
const mustache = require('mustache');
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
           // const template = fs.readFileSync('./handler/mail-template/welcome.html', 'utf8');
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
                //html: mustache.to_html(template, {username })
                // html: `<!DOCTYPE html>
                // <html lang="en">
                // <head>
                //   <title>WELCOME EMAIL</title>
                //   <meta charset="utf-8">
                //   <meta name="viewport" content="width=device-width, initial-scale=1">
                //   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                //   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
                //   <style>
                //   body{
                //       background-image:url('./mail-template/bg.png')
                //   }
                //   a{
                //   color:#3d5ca3;}
                //   </style>
                // </head>
                // <body>
                
                // <div class="p-5 text-white text-center" style="background-color:#3d5ca3;">
                //   <h2>Hi! Welcome ${username}</h2>
                //   <p style="font-size: 20px;">Take <strong>the game</strong> for more <strong>experience</strong> gaming.</p>
                // </div>
                
                // <div class="text-center mt-5 p-4">
                //   <h6 style="color:#3d5ca3;">Contact us: <a target="_blank" href="tel:081282497545" >081282497545</a> | <a target="_blank" href="mailto:luthfiyah.sakinah19@gmail.com">luthfiyah.sakinah19@mail.com</a></h6>
                // </div>
                
                // <div class="mt-5 p-4 bg-dark text-white text-center">
                //   <p>This is challeng for studi independen Back End Java Script Binar Academy
                // Luthfiyah Sakinah - &nbsp; <a href="https://pei.ac.id/" style="color:white;">Politeknik Enjinering Indorama</a>.</p></p> 
                // </div>
                
                // </body>
                // </html>`
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



