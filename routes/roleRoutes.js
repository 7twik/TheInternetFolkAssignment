const {createRole,getAllRoles}=require('../controller/roleController');
const express=require('express');
const router=express.Router();


router.post('/role',createRole);
router.get('/role',getAllRoles);

module.exports=router;