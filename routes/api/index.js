const router = require("express").Router();
const apiusergames = require("./api.user.games")
const apiusergamesbiodata = require("./api.user.games.biodata")
const apiusergameshistory = require("./api.user.games.history")
const Middleware = require('../../middleware')
const ctl = require('./../../controllers/api/authController')

router.post('/login', ctl.login)
router.post('/register', ctl.register)
router.post("/forgot-password", ctl.forgotPassword);
router.post("/reset-password", ctl.resetPassword);

router.use(Middleware.verifyJwt, apiusergames)
router.use(Middleware.verifyJwt,apiusergamesbiodata)
router.use(Middleware.verifyJwt,apiusergameshistory)

module.exports = router