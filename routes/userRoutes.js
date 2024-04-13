const {register,login,me}=require('../controller/userController');
const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');

router.post('/auth/signup',register);
router.post('/auth/signin',login);
router.get('/auth/me',auth,me);

module.exports=router;
