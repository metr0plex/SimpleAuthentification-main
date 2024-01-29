import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import {generateAccessToken} from "../utils.js";
import {generateRefreshToken} from "../utils.js";
import Token from "../Models/Token.js";
import * as crypto from "crypto";
import {verifmail} from "../sendEmail.js";


const router = express.Router();
//Регистрация
router.post("/registration",
async(req,res)=>{
    let user = await User.findOne({email : req.body.email});
    if (user)
    return res.send("Email уже занят");
    if (!/[a-z]/.test(req.body.password) || !/[A-Z]/.test(req.body.password) || !/[0-9]/.test(req.body.password)|| !/[!@#$%^&*]/.test(req.body.password))
        return res.send("Пароль должен содержать латинские символы, один заглавный символ, цифры и один спецсимвол")

  
 user= new User({
     name: req.body.name,
     surname: req.body.surname,
     middlename: req.body.middlename,
     email: req.body.email,
     username: req.body.username,
     password: await bcrypt.hash(req.body.password, 5),
     is_confirmed: req.body.is_confirmed,
}).save();





//Генерация токена
    const token = new Token (
        {userId:(await user)._id, token:crypto.randomBytes(16).toString('hex')})
    await token.save()
    console.log(token)
    const link = ` http://loclahost:8000/api/users/confirm/${token.token}`
    await verifmail(email, link)
    res.status(200).send({
        message:"Проверьте свой почтовый ящик"
    })
}
)
//Вход
router.post("/login",
async(req,res)=> {
    const user = await User.findOne({email:req.body.email});
    if (user)
    {
        if(bcrypt.compare(req.body.password, user.password))
        {
            res.send(
                {
                    _id:user._id,
                    name: req.body.name,
                    surname: req.body.surname,
                    middlename: req.body.middlename,
                    email: req.body.email,
                    username: req.body.username,
                    password:user.password,
                    is_confirmed: req.body.is_confirmed,
                    RefreshToken: generateRefreshToken(user),
                    AccessToken: generateAccessToken(user),

                }
            )
        }
    }
    res.send(user);

});

export default router;