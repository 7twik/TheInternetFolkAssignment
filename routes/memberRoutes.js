const {AddMember, delMember} = require('../controller/memberController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/member',auth, AddMember);
router.delete('/member/:id',auth, delMember);

module.exports = router;