const { UserGames, UserGamesBiodata } = require("../../models");
const response = require('../../utils/formatResponse')

module.exports = {
  getUserGamesBiodata: (req, res) => {
    UserGamesBiodata.findAll({ include: [{ model: UserGames, as: "user" }] })
      .then((user_games_biodata) => {
        response(res, 200, true, 'Success get data user games biodata', user_games_biodata)
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  },

  addUserGamesBiodata: (req, res) => {
    let { user_id, fullname, gender, date_of_birth, place_of_birth, address } = req.body
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
      const checkUserGamesBio = (user_id, success, failed) => {
        UserGamesBiodata.findOne({ where: { user_id: user_id } }).then((UserGamesBiodata) => {
          return success(UserGamesBiodata)
        }).catch((error) => {
          return response(res, 500, false, error.message, null)
        })
      }

      checkUserGamesBio(user_id, (data) => {
        if (data) {
          return response(res, 404, true, 'User game for this user is not available please check', null)
        }
        UserGamesBiodata.create({
          user_id: user_id,
          fullname: fullname,
          gender: gender,
          date_of_birth: date_of_birth,
          place_of_birth: place_of_birth,
          address: address,
        }).then((userbiodata) => {
          return response(res, 201, true, 'Success insert data', userbiodata)
        }).catch((error) => {
          return response(res, 500, false, error.message, null)
        })
      }, (error) => {
        console.log(error)
        return response(res, 400, true, 'Failed', null)
      })
    })
  },

  getUserGamesBiodataById: (req, res) => {
    const id = req.query.id;
    UserGamesBiodata.findOne({
      include: [{ model: UserGames, as: "user" }],
      where: { id: req.query.id }
    })
      .then((user_games_biodata) => {
        if (!user_games_biodata) {
          return response(res, 404, false, `Could not find user games biodata with id = ${id}`, null)
        }
        return response(res, 200, true, `Success find user games biodata with id = ${id}`, user_games_biodata)
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  },

  updateUserGamesBiodata: (req, res) => {
    let id = req.query.id

    let userbiodata_data = {
      user_id: req.body?.user_id,
      fullname: req.body?.fullname,
      gender: req.body?.gender,
      date_of_birth: req.body?.date_of_birth,
      place_of_birth: req.body?.place_of_birth,
      address: req.body?.address,
    }
    let query = { where: { id: id } }

    const checkUserGames = (user_id, success, failed) => {
      UserGames.findOne({ where: { id: user_id } }).then((UserGames) => {
        return success(UserGames)
      }).catch((error) => {
        return failed(error)
      })
    }

    const checkBefore = (id, success, failed) => {
      UserGamesBiodata.findOne({ where: { id: id } }).then((userbiodata) => {
        return success(userbiodata)
      }).catch((error) => {
        return failed(error)
      })
    }

    checkUserGames(userbiodata_data.user_id, (data) => {
      if (!data) {
        return response(res, 404, true, 'User game id not found', null)
      }

      checkBefore(id, (data) => {
        if (!data) {
          return response(res, 404, true, 'Data not found', null)
        }

        UserGamesBiodata.update(userbiodata_data, query).then((userbiodata_data) => {
          return response(res, 200, true, 'Success update data', userbiodata_data)
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

  deleteUserGamesBiodata: (req, res) => {
    const { id } = req.query;
    UserGamesBiodata.findByPk(id)
      .then((data) => {
        if (!data) {
          return response(res, 404, false, `Could not find user games biodata with id = ${id}`, null)
        }
        UserGamesBiodata.destroy({
          where: { id },
        });
        response(res, 200, true, `Success delete user games biodata with id = ${id}`, 1)
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  }
}