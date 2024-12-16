const User = require('../model/User')
const bcrypt = require('bcrypt');

const handleNewUser = async(req,res)=>{
    const {username,password} = req.body;
    if(!username ||!password)
        return res.status(400).json({"message":"Username and password are required."})
    const duplicate = await User.findOne({username:username}).exec()
    if(duplicate)
        return res.sendStatus(409)
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const result = User.create({
            username: username,
            password: hashedPassword
        })
        res.status(201).json({"message":`User ${username} created successfully.`})
    } catch (error) {
        res.status(500).json({"message":"Internal Server Error"})
    }

}

module.exports = {handleNewUser}