const express = require("express");
const router = express.Router();
const controllerapi = require("../../controllers/api/usergamesController");

router.get("/user-games", controllerapi.getUserGames);

router.get("/user-game", controllerapi.getUserGamesById);

router.post("/user-game", controllerapi.createUserGames);

router.put("/user-game", controllerapi.updateUserGames);

router.delete("/user-game", controllerapi.deleteUserGames);

module.exports = router;
