import nodemailer from "nodemailer";
import dotenv from "dotenv";
import user from "./Models/User.js";

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
    }
})

export const sendActivationMail = async (to,link) =>{
    await transporter.sendMail({
        from:'',//mail
        to:to,
        subject:"Подтверждение аккаунта",
        text:"Привет",
        html:`<div><a href=${link}>Перейдите для активации аккаунта</a> </div>`
    })
}



