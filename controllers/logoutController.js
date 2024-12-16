const User = require('../model/User')

const handleLogout = async(req,res)=>{
    const cookies = req.cookies;
    if(!cookies) return res.sendStatus(204)
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({refreshToken:refreshToken}).exec()
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly:true,sameSite:'none',secure:'true'})
        return res.sendStatus(204)
    }
    
    foundUser.refreshToken = "";
    const result = await foundUser.save()
    console.log(result)

    res.clearCookie('jwt',{httpOnly:true})
    res.status(204).json({"message":`${foundUser.username} logged out successfully`})
}
module.exports = {handleLogout}