import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: "smtp.mac141414@gmail.com",
        pass: "yfupunenggrgytzj",
    },
});

const sendMail = async (mail, text) => {
    const info = await transporter.sendMail({
        from: 'smtp.mac141414@gmail.com',
        to: mail,
        subject: "Hello ✔",
        text: text, 
    }, (error) => {
        if (error) {
            return  error;
        }
    })
    return info
}


export default sendMail