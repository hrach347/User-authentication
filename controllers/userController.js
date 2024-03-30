import User from "../schemes/userSchema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import sendMail from "../helpers/mailer.js"

const jwtKey = "admin"
async function register(req, res) {
    try {
        const userWithSameUsername = await User.find({ username: req.body.username })
        if (!userWithSameUsername.length) {
            const oneTimePassword = Math.floor(Math.random() * 89999 + 10000)
            sendMail(req.body.email, `http://${req.headers.host}/verifyEmail/?pass=${oneTimePassword}`)
            const user = await User.create({
                ...req.body,
                oneTimePassword,
                status: 0,
                createdTime: new Date(),
            })
            user.password = bcrypt.hashSync(String(req.body.password), bcrypt.genSaltSync(10))
            await user.save()
            res.json({ message: `We sent email to you, please verify that it's you ${user.fullName}!` })
        }
        else {
            res.json({ message: `Username '${req.body.username}' taken, try another username!` })
        }
    }
    catch (error) {
        res.json({ error: error.message })
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (user) {
            if (user.status) {
                if (bcrypt.compareSync(String(req.body.password), user.password)) {
                    const token = jwt.sign({ user }, jwtKey, { expiresIn: "1h" })
                    res.json({
                        message: "Login successfull!",
                        token
                    })
                }
                else {
                    res.json({
                        message: "Password is wrong try again!"
                    })
                }
            }
            else {
                res.json({
                    message: "User does not exist!"
                })
            }
        }
    }
    catch (error) {
        res.json({ error: error.message })
    }
}


async function verifyEmail(req, res) {
    try {
        await User.findOneAndUpdate({ oneTimePassword: req.query.pass }, {
            status: 1,
            oneTimePassword: null
        })
        res.json({
            message: "Email verified"
        })
    } catch (error) {
        res.json(error.message)
    }
}

async function forgotPass(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user && typeof req.body.password === 'string' && req.body.password.length >= 8) {
            const oneTimePassword = Math.floor(Math.random() * 89999 + 10000)
            sendMail(req.body.email, `http://${req.headers.host}/changePass/?pass=${oneTimePassword}`)
            user.oneTimePassword = oneTimePassword
            user.newPasswordRequest = bcrypt.hashSync(String(req.body.password), bcrypt.genSaltSync(10))
            await user.save()   
            res.json("Email sent to " + req.body.email)
        }
        else{
            res.json('Something went worng !')
        }
    } catch (error) {
        res.json({ error: error.message })
    }
}

async function changeForgotenPass(req, res) {
    try {
        const user = await User.findOne({ oneTimePassword: req.query.pass })
        if (user) {
            user.password = user.newPasswordRequest
            await user.save()
            res.json("Changed the password successfully !")
        }
        else {
            res.json("Someting went wrong!")
        }
    } catch (error) {
        res.json({ error: error.message })
    }
}

export { register, login, verifyEmail, forgotPass, changeForgotenPass }