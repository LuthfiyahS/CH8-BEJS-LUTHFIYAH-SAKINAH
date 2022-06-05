const { UserGamesHistory, UserGames } = require("../../models");
const getIntervalTime = require('../../utils/time')
const response = require('../../utils/formatResponse')

module.exports = {
  getUserGamesHistory: (req, res) => {
    UserGamesHistory.findAll({ include: [{ model: UserGames, as: "user" }] })
      .then((user_games_history) => {
        response(res, 200, true, 'Success get data user games history', user_games_history)
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  },

  addUserGamesHistory: (req, res) => {
    let { user_id, score, session_start, session_end } = req.body

    const checkUserGames = (user_id, success, failed) => {
      UserGames.findOne({ where: { id: user_id } }).then((UserGames) => {
        return success(UserGames)
      }).catch((error) => {
        return response(res, 500, false, error.message, null)
      })
    }

    checkUserGames(user_id, (data) => {
      if (!data) {
        return response(res, 404, true, 'User game id not found', null)
      }

      let playtime = getIntervalTime(session_end, session_start)

      UserGamesHistory.create({
        user_id: user_id,
        score: score,
        session_start: session_start,
        session_end: session_end,
        playtime: playtime
      }).then((userhistory) => {
        return response(res, 201, true, 'Success insert data  user game history', userhistory)
      }).catch((error) => {
        return response(res, 500, false, error.message, null)
      });
    }, (error) => {
      console.log(error)
      return response(res, 400, true, 'Failed', null)
    })
  },

  getUserGamesHistoryById:(req, res) => {
    const id = req.query.id;
    UserGamesHistory.findOne({ include: [{ model: UserGames, as: "user" }], where: { id: id } })
      .then((usergameshistory) => {
        if (!usergameshistory) {
          return response(res, 404, false, `Could not find user games history with id = ${id}`, null)
        }
        response(res, 200, true, `Success find user games history with id = ${id}`, usergameshistory)
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  },

  updateUserGamesHistory: (req, res) => {
    let id = req.query.id

    let playtime = getIntervalTime(req.body?.session_end, req.body?.session_start)
    let userhistory_data = {
      user_id: req.body?.user_id,
      score: req.body?.score,
      session_start: req.body?.session_start,
      session_end: req.body?.session_end,
      playtime: playtime
    }
    let query = {where: {id: id}}

    const checkUserGames = (user_id, success, failed) => {
      UserGames.findOne({ where: { id: user_id } }).then((UserGames) => {
        return success(UserGames)
      }).catch((error) => {
        return failed(error)
      })
    }

    const checkBefore = (id, success, failed) => {
      UserGamesHistory.findOne({ where: { id: id } }).then((userhistory) => {
        return success(userhistory)
      }).catch((error) => {
        return failed(error)
      })
    }

    checkUserGames(userhistory_data.user_id, (data) => {
      if (!data) {
        return response(res, 404, true, 'User game id not found', null)
      }

      checkBefore(id, (data) => {
        if (!data) {
          return response(res, 404, true, 'Data not found', null)
        }

        UserGamesHistory.update(userhistory_data, query).then((userhistory) => {
          return response(res, 200, true, 'Success update data', userhistory_data)
        }).catch((error) => {
          return response(res, 500, false, error.message, null)
        });
      }, (error) => {
        console.log(error)
        return response(res, 400, false, 'Failed', null)
      })
    }, (error) => {
      console.log(error)
      return response(res, 400, false, 'Failed', null)
    })
  },

  deleteUserGamesHistory: (req, res) => {
    const { id } = req.query;
    UserGamesHistory.findByPk(id)
      .then((data) => {
        if (!data) {
          return response(res, 404, false, `Could not find user games history with id = ${id}`, null)
        }
        UserGamesHistory.destroy({
          where: { id },
        });
        response(res, 200, true, `Success delete user games history with id = ${id}`, 1)
        
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  }
}