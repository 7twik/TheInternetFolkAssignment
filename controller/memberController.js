const Member = require('../models/memberSchema');
const User = require('../models/userSchema');
const Community = require('../models/communitySchema');
const {Snowflake} = require("@theinternetfolks/snowflake");
const AddMember = async (req, res) => {
    const userr = req.user;

    const { community, user, role } = req.body;
    const userid = userr.id;

    try {
        const findcomm = await Community.findOne({ id: community });
        if (!findcomm) {
            return res.status(400).json({ status: false, message: "community not found" });
        }
        else if(findcomm.owner!=userid)
        {
            return res.status(400).json({status:false,message:"NOT_ALLOWED_ACCESS"});
        }
        else {
            const newmember = await Member.create({ id: Snowflake.generate(), community: community, user: user, role: role });
            const response = {
                status: true,
                content: {
                    data: {
                        id: newmember.id,
                        community: newmember.community,
                        user: newmember.user,
                        role: newmember.role,
                        created_at: newmember.createdAt
                    }
                }
            };
            res.json(response);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "internal server error" });
    }
}

const delMember = async (req, res) => {
    const userr = req.user;
    const { id } = req.params;
    const userid = userr.id;
    try {
        const findmember = await Member.findOne({ id: id });
        if (!findmember) {
            return res.status(400).json({ status: false, message: "member not found" });
        }
        const findcomm = await Community.findOne({ id: findmember.community });
        if (!findcomm) {
            return res.status(400).json({ status: false, message: "community not found" });
        }
        else if(findcomm.owner!=userid)
        {
            const delguy=await Member.findOne({user:userid,community:findmember.community});
            if(!delguy)
                return res.status(400).json({status:false,message:"NOT_ALLOWED_ACCESS"});
            const roleofdelguy=await Role.findOne({id:delguy.role});
            if(roleofdelguy.name!="Community Moderator")
                return res.status(400).json({status:false,message:"NOT_ALLOWED_ACCESS"});
            else {
                await Member.deleteOne({ id: id});
                res.json({ status: true});
                }
        }
        else {
            await Member.deleteOne({ id: id });
            res.json({ status: true});
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "internal server error" });
    }
}

module.exports = { AddMember, delMember };