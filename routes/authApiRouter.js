const express = require('express')
const router = express.Router()
const ctl = require('./../controllers/api/authController')

router.post('/login', ctl.login)
router.post('/register', ctl.register)
router.post("/forgot-password", ctl.forgotPassword);
router.post("/reset-password", ctl.resetPassword);

module.exports = router