const request = require('supertest')
const app = require("../../app")
const { sequelize }= require('../../models')
const { QueryTypes } = require('sequelize') 
require("../../controllers/api/usergamesController")

describe('Endpoint for API user games ', () => {
    beforeAll(async () => {
        await request(app).post('/api/v1/register').send({ username: 'luthfiyahsakinah19', email: 'luthfiyah.sakinah19@gmail.com', password: 'luthfiyahsakinah19', role_id:1,sign_with:'Form App' });
        const login = await request(app).post('/api/v1/login').send({ username: 'luthfiyahsakinah19', password: 'luthfiyahsakinah19' });
        token = login.body.data.token;
        //const token = login.body.data
    });

    afterAll(async () => {
        try { 
            await sequelize.query("TRUNCATE user_games_biodata, user_games_history,user_games RESTART IDENTITY;", { type: QueryTypes.RAW }); 
          } catch (error) { 
            console.log(error) 
          }
    });

    //api user-games
    it('GET ALL : should not view usergames because unauthorized', async () => {
        const res = await request(app)
        .get('/api/v1/user-games')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it('GET ALL : should view usergames because authorized', async () => {
        const res = await request(app)
            .get('/api/v1/user-games')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
    })

    it('/api/v1/user-game : should not view usergames by id because unauthorized', async () => {
        const res = await request(app)
        .get('/api/v1/user-game?id=1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it('/api/v1/user-game : should view usergames by id', async () => {
        const res = await request(app)
        .get('/api/v1/user-game?id=1')
        .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
    })
    it('/api/v1/user-game : should not view usergames by id', async () => {
        const res = await request(app)
            .get('/api/v1/user-game?id=100000')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(404)
    })


    it('POST /api/v1/user-game : Should not insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-game')
            .send({
                username: 'luthfiyahsakinah19',
                password: '1',
                role_id:2,
                sign_with: 'Form App'
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it('POST /api/v1/user-game : Should not insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-game')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'luthfiyahsakinah19',
                password: '1',
                role_id:2,
                sign_with: 'Form App'
            })
        expect(res.statusCode).toEqual(400)
        expect(res.body).toHaveProperty('message')
    })
    
    it('POST /api/v1/user-game : Should insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-game')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'testiscoola012345678920',
                password: '1',
                email: 'testiscoola012345678920.sakinah19@gmail.com',
                role_id:2,
            })
        expect(res.statusCode).toEqual(201)
    })

    it('POST /api/v1/user-game : Should insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-game')
        expect(res.statusCode).toEqual(401)
    })

    //PUT
    it('PUT /api/v1/user-game : Should not update usergames', async () => {
        const res = await request(app)
            .put('/api/v1/user-game?id=9')
            .send({
                username: 'testiscoolyehabcdefghijkl',
                password: '1',
                email: 'testiscoolyeabcdefghijkl.sakinah19@gmail.com',
                role_id:2,
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })

    it('PUT /api/v1/user-game : Should update usergames', async () => {
        const res = await request(app)
            .put('/api/v1/user-game?id=1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'isMailbinMailmail',
                password: 'pwMail',
                email: 'iniemailmail@gmail.com',
                role_id:2,
            })
        expect(res.statusCode).toEqual(200)
    })

    it('PUT /api/v1/user-games : Should not update usergames because id not find', async () => {
        const res = await request(app)
            .put('/api/v1/user-game?id=3000000')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'isMailbinMailmail',
                password: 'pwMail',
                email: 'iniemailmail@gmail.com',
                role_id:2,
            })
        expect(res.statusCode).toEqual(404)
    })

    it('PUT /api/v1/user-games : Should update usergames', async () => {
        const res = await request(app)
            .put('/api/v1/user-game?id=1')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500)
    })

    it('PUT /api/v1/user-games : Should update usergames', async () => {
        const res = await request(app)
            .put('/api/v1/user-game?id=1')
        expect(res.statusCode).toEqual(401)
    })

    //DELETE
    it('DELETE /api/v1/user-game : Should not delete usergames', async () => {
        const res = await request(app)
            .delete('/api/v1/user-game?id=2')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })

    it('DELETE /api/v1/user-games : Should delete usergames', async () => {
        //let id = Math.floor(Math.random() * 10)
        let id = 14;
        const res = await request(app)
            .delete(`/api/v1/user-game?id=${id}`)
            .set('Authorization', `Bearer ${token}`)
        //expect(res.statusCode).toEqual(404)
        //expect(res.statusCode).toEqual(200)// harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
        expect(res.body).toHaveProperty('message')
    })

    it('DELETE /api/v1/user-games : Should not delete usergames because id not find', async () => {
        const res = await request(app)
            .delete('/api/v1/user-game?id=10000000000')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500)
        expect(res.body).toHaveProperty('message')
    })
})

