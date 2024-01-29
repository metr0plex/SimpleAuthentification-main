import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import {generateAccessToken} from "../utils.js";
import {generateRefreshToken} from "../utils.js";
import Token from "../Models/Token.js";
import * as crypto from "crypto";
import {sendActivationMail} from "../sendEmail.js";


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
    const link = `http://localhost:8000/api/users/confirm/${token.token}`
    await sendActivationMail((await user).email, link)
    res.status(200).send({
        message:"Проверьте свой почтовый ящик"
    })
})
router.get("/confirm/:token", async (req, res) => {
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
        return res.send("Ссылка устарела или недействительна");
    }
    await User.findByIdAndUpdate(token.userId, { is_confirmed: true });
    res.send("Аккаунт успешно подтвержден");
});
router.post("/changePasswordByEmail", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.send("Пользователь не найден");
    }
    const token = await Token.findOne({ userId: user._id });
    if (!token) {
        return res.send("Токен не найден");
    }
    if (bcrypt.compare(req.body.password, user.password)) {
        user.password = await bcrypt.hash(req.body.password, 5);
        await user.save();
        await Token.findOneAndDelete({ userId: user._id });
        const newToken = generateRefreshToken(user);
        const link = `http://localhost:8000/confirm/${newToken.token}`;
        await sendActivationMail(user.email, link);
        res.send("Пароль успешно изменен");
    } else {
        res.send("Старый пароль не совпадает");
    }
});
router.post("/change-password", async (req, res) => {
    const { email, password, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).send("Неверный email");
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send("Неверный пароль");
    }

    user.password = await bcrypt.hash(newPassword, 5);
    await user.save();

    res.status(200).send("Пароль успешно изменен");
});

//Вход
router.post("/login",
async(req,res)=> {
    const user = await User.findOne({email:req.body.email});
    if (user && user.is_confirmed)
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