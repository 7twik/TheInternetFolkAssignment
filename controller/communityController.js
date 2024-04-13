const Community = require('../models/communitySchema');
const Member = require('../models/memberSchema');
const User = require('../models/userSchema');
const {Snowflake} = require("@theinternetfolks/snowflake");
const Role = require('../models/roleSchema');

const createCommunity = async (req, res) => {
    const user=req.user;
    const { name} = req.body;
    const slug = name.replace(/ /g, "-").toLowerCase();
    const id=Snowflake.generate();
    const userid=user.id;
    try {
        const findcommunity = await Community.findOne({ name: name });
        if (findcommunity) {
            return res.status(400).json({ status: false, message: "community already exist" });
        }
        else {
            const newcommunity = await Community.create({ id: id, name: name, slug: slug, owner: userid });
            const role=await Role.findOne({name:"Community Admin"});
            if(!role)
            {
                return res.status(400).json({status:false,message:"role not found"});
            }
            const memid=Snowflake.generate();
            const newmember = await Member.create({ id: memid, user: userid, role: role.id,community:id});
            const response = {
                status: true,
                content: {
                    data: {
                        id: newcommunity.id,
                        name: newcommunity.name,
                        slug: newcommunity.slug,
                        created_at: newcommunity.createdAt,
                        owner: newcommunity.owner,
                        updated_at: newcommunity.updatedAt
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

const getCommunity = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        if (!page) {
            page = 1;
        }
        const totcommunities = await Community.find().count();
        const communities = await Community.find().skip((page - 1) * 10).limit(10);
        const modcommunities=[];
        for(let i=0;i<communities.length;i++)
        {
            const owner=await User.findOne({id:communities[i].owner});
            modcommunities.push({id:communities[i].id,name:communities[i].name,slug:communities[i].slug,owner:{
                name:owner.name,
            id:owner.id},created_at:communities[i].createdAt,updated_at:communities[i].updatedAt});
        }
        const response = {
            status: true,
            content: {
                meta: {
                    total: totcommunities,
                    pages: Math.ceil(totcommunities / 10),
                    page: page
                },
                data: modcommunities
            }
        };
        return res.json(response);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "internal server error" });
    }
}

const getCommunityMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const {page=1}=req.query;
        const findcommunity = await Community.findOne({ slug: id });
        if (!findcommunity) {
            return res.status(404).json({ status: false, message: "community not found" });
        }
        const totmembers=await Member.find({community:findcommunity.id}).count();
        
        const members = await Member.find({ community: findcommunity.id }).skip((page - 1) * 10).limit(10);
        const modmembers=[];

        for(let i=0;i<members.length;i++)
        {
            const user=await User.findOne({id:members[i].user});
            const role=await Role.findOne({id:members[i].role});
            modmembers.push({
                id:members[i].id,
                community: id,
                user:{
                    name:user.name,
                    id:user.id
                },role:{
                    name:role.name,
                    id:role.id
                },created_at:members[i].createdAt,updated_at:members[i].updatedAt});
        }
        const response = {
            status: true,
            content: {
                meta: {
                    total: totmembers,
                    pages: Math.ceil(totmembers / 10),
                    page: page
                },
                data: modmembers
            }
        };
        return res.json(response);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "internal server error" });
    }
}

const getmycommunity = async (req, res) => {
    try {
        const user = req.user;
        const {page=1}=req.query;
        const id = user.id;
        const totcomms=await Community.find({owner:id}).count();
        const comms = await Community.find({ owner: id }).skip((page - 1) * 10).limit(10);
        const response={
            status:true,
            content:{
                meta:{
                    total:totcomms,
                    pages:Math.ceil(totcomms/10),
                    page:page
                },
                data:comms
            }
        };
        res.json(response);
        }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
}

const getmycommunitymember = async (req, res) => {
    try {
        const user = req.user;
        const {page=1}=req.query;
        const id = user.id;
        const totmems=await Member.find({user:id}).count();
        const mems = await Member.find({ user: id }).skip((page - 1) * 10).limit(10);
        const modmems=[];
        for(let i=0;i<mems.length;i++)
        {
            const comm=await Community.findOne({id:mems[i].community});
            const user=await User.findOne({id:comm.owner});
            modmems.push({
                id:comm.id,
                name:comm.name,
                slug:comm.slug,
                owner:{
                    name:user.name,
                    id:user.id
                },
                created_at:comm.createdAt,
                updated_at:comm.updatedAt});
                
        }
        const response={
            status:true,
            content:{
                meta:{
                    total:totmems,
                    pages:Math.ceil(totmems/10),
                    page:page
                },
                data:modmems
            }
        };
        res.json(response);
        }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" });
    }
}

module.exports = { createCommunity, getCommunity, getCommunityMembers, getmycommunity, getmycommunitymember };