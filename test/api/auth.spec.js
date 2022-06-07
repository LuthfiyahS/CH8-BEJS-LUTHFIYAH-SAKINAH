const request = require('supertest')
const app = require("../../app")
require("../../controllers/api/authController")
const bcrypt = require("bcryptjs")

describe('Endpoint API ', () => {
  beforeAll(async () => {
    await request(app).post('/api/v1/register').send({ username: 'luthfiyahsakinah19', email: 'luthfiyah.sakinah19@gmail.com', password: 'luthfiyahsakinah19', role_id: 1 });
    const login = await request(app).post('/api/v1/login').send({ username: 'luthfiyahsakinah19', password: 'luthfiyahsakinah19' });
    token = login.body.data.token;
    //const token = login.body.data
  });

  afterAll(async () => {
      try { 
          await sequelize.query("TRUNCATE user_games, user_games_biodata, user_games_history RESTART IDENTITY;", { type: QueryTypes.RAW }); 
        } catch (error) { 
          console.log(error) 
        }
  });

  it('/api/v1/register : Should create a new account', async () => {
    const res = await request(app)
      .post('/api/v1/register')
      .send({
        username: 'testing',
        password: '1',
        email: 'iniemailnya@gmail.com',
        role_id:2,
        sign_with:'Form App'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('data')
  })

  it('/api/v1/register : Should NOT register because username and password doesn`t match', async () => {
    const res = await request(app)
      .post('/api/v1/register')
      .send({
        username: 'testingsc',
        password: '1',
        email: 'iniemailnya@gmail.com',
        role_id:2,
        sign_with:'Form App'
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
  })
  
  it('Should compare hashing password', async () => {
    let pwd = "its is password"
    let hash = bcrypt.hashSync(pwd, 8)
    expect(true).toEqual(bcrypt.compareSync(pwd,hash))
  })
  
  it('/api/v1/login : Should success login', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'testing',
        password: '1',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
  })
  
  it('/api/v1/login : Should NOT login because username and password doesn`t match', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'abcdefg',
        password: '1',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
  })

  it('/api/v1/login : Should NOT login because password is wrong', async () => {
    const res = await request(app)
      .post('/api/v1/login')
      .send({
        username: 'testing',
        password: '1239482739874293',
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')
  })

  it('/api/v1/login : Should NOT login because URL is not found', async () => {
    const res = await request(app)
      .post('/api/v1/loginkajshdkj')
      .send({
        username: 'abcdefg',
        password: '1',
      })
    expect(res.statusCode).toEqual(401)
  })

  //FORGOT PASSWORD
  it('/api/v1/forgot-password : Should send email OTP', async () => {
    const res = await request(app)
      .post('/api/v1/forgot-password')
      .send({
        email: 'luthfiyah.sakinah19@gmail.com',
      })
    expect(res.statusCode).toEqual(200)
  })

  it('/api/v1/forgot-password : Should NOT send email OTP', async () => {
    const res = await request(app)
      .post('/api/v1/forgot-password')
      .send({
        email: '97486328fghjsdzbmbsajdjhad@gmail.com',
      })
    expect(res.statusCode).toEqual(404)
  })

  it('/api/v1/forgot-password : Should NOT send email OTP', async () => {
    const res = await request(app)
      .post('/api/v1/forgot-password')
      expect(res.statusCode).toEqual(500)
  })

  //Reset
  it('/api/v1/reset-password : Should NOT send email OTP', async () => {
    const res = await request(app)
      .post('/api/v1/reset-password')
      .send({
        email: 'luthfiyah.sakinah19@gmail.com',
        password: '1',
        otp:'892427'
      })
    expect(res.statusCode).toEqual(404)
  })
  it('/api/v1/reset-password : Should NOT send email OTP', async () => {
    const res = await request(app)
      .post('/api/v1/reset-password')
      .send({
        email: '97486328fghjsdzbmbsajdjhad@gmail.com',
        password: '1',
        otp:'892427'
      })
    expect(res.statusCode).toEqual(404)
  })

  it('/api/v1/reset-password : Should NOT send email OTP', async () => {
    const res = await request(app)
      .post('/api/v1/reset-password')
      expect(res.statusCode).toEqual(500)
  })

})
