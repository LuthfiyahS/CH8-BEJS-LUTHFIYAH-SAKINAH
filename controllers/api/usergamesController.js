const { UserGames, UserGamesBiodata, UserGamesHistory, RoleUser } = require("../../models");
const response = require('../../utils/formatResponse')
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid')
//API media 
const isBase64 = require('is-base64');
const base64Img = require('base64-img');
const fs = require('fs');

module.exports = {
  getUserGames: async (req, res) => {
    const user = await UserGames.findAll({
      include:
        [
          { model: UserGamesBiodata, as: "biodata" },
          { model: UserGamesHistory, as: "history" },
          { model: RoleUser, as: "role" }
        ]
    });
    const mappedUser = user.map((m) => {
      if (!m.profil) {
        return m;
      } else {
        m.profil = `${req.get('host')}/file/${m.profil}`;
        return m;
      }
    })
    return response(res, 200, true, 'Success get data user games', mappedUser)
  },

  createUserGames: (req, res) => {
    const { username, password, email, role_id, profil } = req.body;
    const now = new Date();
    const uid = uuidv4()

    if (profil == null) {
      UserGames.findOne({ where: { username: username } })
        .then(user => {
          if (user) {
            return response(res, 400, true, 'Failed! Username is already in use!', null)
          }
          // Email
          UserGames.findOne({ where: { email: email } })
            .then(user => {
              if (user) {
                return response(res, 400, true, 'Failed! Email is already in use!', null)
              }
              UserGames.create({
                uid,
                username,
                password: bcrypt.hashSync(password, 8),
                role_id,
                sign_with: 'Form App',
                email,
                now,
                now,
              })
                .then((data) => {
                  response(res, 201, true, 'Success insert data user games', data)
                })
                .catch((error) => {
                  return response(res, 500, false, error.message, null)
                });
            });
        });
    } else {
      if (!isBase64(profil, { mimeRequired: true })) {
        return res.status(400).json({ status: 'error', message: 'Invalid base64' });
      }

      base64Img.img(profil, './public/file/images', `profil-${Date.now()}`, (error, filepath) => {
        if (error) {
          return res.status(400).json({ status: 'error', message: error.message });
        }

        const filename = filepath.split("\\").pop().split("/").pop();

        UserGames.findOne({ username }).then(user => {
          if (user) {
            return response(res, 400, true, 'Failed! Username is already in use!', null)
          }
          // Email
          UserGames.findOne({ email }).then(user => {
            if (user) {
              return response(res, 400, true, 'Failed! Email is already in use!', null)
            }
            UserGames.create({
              uid,
              username,
              password: bcrypt.hashSync(password, 8),
              email,
              profil: filename,
              sign_with: 'Form App',
              now,
              now,
            })
              .then((data) => {
                response(res, 201, true, 'Success insert data user games', data)
              })
              .catch((error) => {
                return response(res, 500, false, error.message, null)
              });
          });
        });
      })
    }
  },

  getUserGamesById: (req, res, next) => {
    const id = req.query.id;
    UserGames.findByPk(id, {
      include:
        [
          { model: UserGamesBiodata, as: "biodata" },
          { model: UserGamesHistory, as: "history" }
        ]
    })
      .then((usergames) => {
        if (!usergames) {
          return response(res, 404, false, `Could not find user games with id = ${id}`, null)
        }
        return response(res, 200, true, `Success find user games  with id = ${id}`, usergames)
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  },

  updateUserGames: (req, res, next) => {
    const id = req.query.id;
    const { username, password, email, role_id, profil } = req.body;
    const now = new Date();
    UserGames.findByPk(id)
      .then((usergames) => {
        if (!usergames) {
          return response(res, 404, false, `Could not find user games with id = ${id}`, null)
        }
        if (profil == null) {
          UserGames.update(
            {
              username,
              password: bcrypt.hashSync(password, 8),
              email,
              role_id,
              now,
            },
            {
              where: { id },
            }
          );
          response(res, 200, true, `Success update user games  with id = ${id}`, usergames)
        } else {
          if (!isBase64(profil, { mimeRequired: true })) {
            return res.status(400).json({ status: 'error', message: 'Invalid base64' });
          }

          base64Img.img(profil, './public/file/images', `profil-${Date.now()}`, (error, filepath) => {
            if (error) {
              return res.status(400).json({ status: 'error', message: error.message });
            }

            const filename = `${filepath.split("\\").pop().split("/").pop()}`;
            UserGames.update(
              {
                username,
                password: bcrypt.hashSync(password, 8),
                email,
                profil: filename,
                now,
              },
              {
                where: { id },
              }
            );
            response(res, 200, true, `Success update user games  with id = ${id}`, usergames)
          })
        }
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });

  },

  deleteUserGames: (req, res, next) => {
    const { id } = req.query;
    UserGames.findByPk(id)
      .then((data) => {
        if (!data) {
          return response(res, 404, false, `Could not find user games with id = ${id}`, null)
        }

        if (!data.profil) {
          UserGames.destroy({
            where: { id },
          })

          response(res, 200, true, `Success delete user games  with id = ${id}`, 1)
        } else {
          fs.unlink(`./public/file/images/${data.profil}`, (error) => {
            if (error) {
              return response(res, 404, false, error.message, null)
            }

            UserGames.destroy({
              where: { id },
            })
            response(res, 200, true, `Success delete user games  with id = ${id}`, 1)
          });
        }
      })
      .catch((error) => {
        return response(res, 500, false, error.message, null)
      });
  },
}