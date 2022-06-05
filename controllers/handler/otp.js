require('dotenv').config();
const nodemailer = require('nodemailer')

exports.sendMail = (req, res,otp) => {
    try {
        if(!req.body){
            return res.json({
                success: true,
                message: "Input is missing",
                data: null
              });
        }else{
            const email = req.body.email;
            //Step 1: Creating the transporter
            const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: 'smtp.gmail.com',
            port: '587',
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASSWORD_MAILAPP
                }
            });

            //Step 2: Setting up message options
            const messageOptions = {
                from: process.env.USER_MAIL,
                to: email,
                subject: 'FORGOT PASSWORD to PIY Game State',
                text: `FORGOT PASSWORD to PIY Game State`,
                html: `<!doctype html>
                        <html>
                        <head>
                            <meta name="viewport" content="width=device-width">
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                            <title>Simple Transactional Email</title>
                        </head>
                        <body>
                            <p>Thats OTP to Game State, ${otp}, date ${new Date()}</p>
                        </body>
                        </html>`
            }
            const messageOptionsa = {
            subject: "HA",
            text: "I am riet now!",
            to: email,
            from: "luthfiyah AJA"
            };

            //Step 3: Sending email
            transporter.sendMail(messageOptions, (err, info) => {
                if (err) {
                    console.log(err.message)
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



