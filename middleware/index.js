require('dotenv').config();
const jwt = require('jsonwebtoken')
const privateKey = process.env.PRIVATE_KEY;
const { UserGames, UserGamesBiodata, UserGamesHistory,Endpoint, RoleUser, RoleToEndpoint } = require("../models");


exports.verifyJwt = (req, res, next) => {
    const authHeader = req?.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({
            success:false,
            message: 'Unauthorize',
            data:null
        })
    }
    const token = authHeader

    if (token == null) return res.status(401).json({
            success:false,
            message: 'Unauthorize',
            data:null
    })

    jwt.verify(token, privateKey, async (err, user) => {
        //console.log(token)
        const newStr = token.replace('Bearer ', '');
        const decode  = jwt.decode(newStr);
        //console.log('DECODE NYA',decode);
        const roleToEndpoint = await RoleToEndpoint.findOne({
            where:{
                role_id : decode.role_id
            },
            include:{
                model: Endpoint, as: 'endpoint',
                where: {
                  method: req.method,
                  endpoint:  req.path
                }
            }
        })
        //console.log(roleToEndpoint);
        //console.log('methodnya NYA',req.method);
        //console.log('PATH NYA',req.path);
        if(!roleToEndpoint){
           return res.status(403).json({
            success:false,
            message: 'check permission',
            data:null
        })
        }
        authorization(req, res, next);
        //next()
    })
}


const authorization = async (req, res, next) => {
    try {
        const token = req?.headers['authorization']
        const newStr = token.replace('Bearer ', '');
        const decode  = jwt.decode(newStr);
        //console.log(decode)
        let reqid = req.query.id;
        if(decode.role_id != 1 ){
            const data = await UserGames.findOne({
                where:{
                    id:decode.id
                },
                include:[
                    { model: UserGamesBiodata, as: "biodata"},
                    { model: UserGamesHistory, as: "history"},
                ]
            })
            if(!data){
                return res.status(403).json({
                    success:false,
                    message:`you don't have permission`,
                    data:null
                })
            }else{
                if(req.path=='/user-games' || req.path=='/user-games-biodata' ||req.path=='/user-games-history' || req.method=='POST'){
                    //console.log('REQ IDNYA IF',reqid)
                    next()
                }else{
                    //console.log('REQ IDNYA ELSE',reqid)
                    if(reqid == decode.id  ){
                        next()
                    }else if(data.dataValues.biodata.dataValues.id == reqid){
                        next()
                    }else if(data.dataValues.history != null){
                        const datahistory = await UserGamesHistory.findOne({
                            where:{
                                id : reqid,
                                user_id: decode.id}
                        })
                        if(!datahistory){
                            return res.status(403).json({
                                success:false,
                                message:`you don't have permission`,
                                data:null
                            })
                        }else{
                            next()
                        }
                    }else{
                        return res.status(403).json({
                            success:false,
                            message:`you don't have permission`,
                            data:null
                        })
                    }
                }
                //next()
            }   
        }else{
            next()
        }
    } catch (error) {
        console.log(error.message)
        return res.status(403).json({
            success:false,
            message:`you don't have permission yet`,
            data:null
        })
    }
}