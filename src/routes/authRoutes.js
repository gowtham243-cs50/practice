import express, { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import dotenv from 'dotenv'
dotenv.config()


const router = express.Router() 

//to register usrename and password
router.post('/register', (req,res) => {
    const {username,password} = req.body
    const hashedpassword = bcrypt.hashSync(password, 8)

    try{
        const insertUser = db.prepare(`INSERT into user (username,password) values(?, ?)`)
        const result = insertUser.run(username, hashedpassword)
        
        const defaultTodo = 'hello to first todo'
        const insertTodo = db.prepare(`INSERT into TODOS (user_id,task) values (?, ?)`)
        insertTodo.run(result.lastInsertRowid,defaultTodo)

        console.log('JWT_SECRET:', process.env.JWT_SECRET)
        const token = jwt.sign({id: result.lastInsertRowid},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.json({token})

    }
    catch (err){
        console.log(err.message)
        res.sendStatus(503)
    }

})

router.post('/login', (req,res) => {
    const {username,password} = req.body
    const hashedpassword = bcrypt.hashSync(password, 8)

    try{
        const getUser = db.prepare(`SELECT * from user WHERE username = ?`)
        const user  = getUser.get(username)

        if (!user){
            res.status(404).send({message : "User not found"})
            return
        }

        const passwordisvalid = bcrypt.compareSync(password,user.password)
        if(!passwordisvalid){
            res.status(404).send({message : 
                "invalid password"
            })
        }
        const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn:'24h'})
        res.json({token})

    }
    catch (err){
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router