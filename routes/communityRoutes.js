const {createCommunity, getCommunity, getCommunityMembers, getmycommunity, getmycommunitymember} = require('../controller/communityController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/community',auth,createCommunity);
router.get('/community', getCommunity);
router.get('/community/:id/members', getCommunityMembers);
router.get('/community/me/owner',auth,getmycommunity);
router.get('/community/me/member',auth,getmycommunitymember);

module.exports = router;