const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const mid=require('../middleware/auth')




router.post('/user',userController.user)
router.post('/login',userController.loginUser)
router.delete('/user',mid.authenticate,userController.deleteUser)





router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,msg:" Please provide a correct url "})
})


module.exports=router;