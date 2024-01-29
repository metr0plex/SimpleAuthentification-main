import nodemailer from "nodemailer";
import dotenv from "dotenv";
import user from "./Models/User.js";


const verifmail = async (email, link)=>{
    try{
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth:{
                user: 'rakitin-den123@mail.ru',
                pass: 'afypsdrKM7F1EnPTub0c',
            },
        })
        await transporter.sendMail({
            from:'rakitin-den123@mail.ru',
            to:user.email,
            subject:"Подтверждение аккаунта",
            text:"Привет",
            html:`<div><a href=${link}>Перейдите для активации аккаунта</a> </div>`
        })
        console.log('mail отправлен')
    }catch (error){
        console.log(error,'mail не отправлен')

    }
}
export {verifmail};

