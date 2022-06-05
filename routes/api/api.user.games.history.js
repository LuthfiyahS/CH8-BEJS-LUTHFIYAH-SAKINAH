const express = require("express");
const router = express.Router();
const controllerapi = require("../../controllers/api/usergameshistoryController");

router.get("/user-games-history", controllerapi.getUserGamesHistory);

router.get("/user-game-history", controllerapi.getUserGamesHistoryById);

router.post("/user-game-history", controllerapi.addUserGamesHistory);

router.put("/user-game-history", controllerapi.updateUserGamesHistory);

router.delete("/user-game-history", controllerapi.deleteUserGamesHistory);

module.exports = router;
