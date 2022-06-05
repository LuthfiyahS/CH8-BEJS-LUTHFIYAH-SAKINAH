const express = require("express");
const router = express.Router();
const controllerapi = require("../../controllers/api/usergamesbiodataController");

router.get("/user-games-biodata", controllerapi.getUserGamesBiodata);

router.get("/user-game-biodata", controllerapi.getUserGamesBiodataById);

router.post("/user-game-biodata", controllerapi.addUserGamesBiodata);

router.put("/user-game-biodata", controllerapi.updateUserGamesBiodata);

router.delete("/user-game-biodata", controllerapi.deleteUserGamesBiodata);

module.exports = router;