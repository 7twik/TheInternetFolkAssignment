const Role=require('../models/roleSchema');
const {Snowflake}=require("@theinternetfolks/snowflake");
const createRole=async(req,res)=>{
    try{
        const {name}=req.body;
        const findrole=await Role.findOne({name:name});
        if(findrole)
        {
            return res.status(400).json({status:false,message:"role already exist"});
        }
        else{
            const id=Snowflake.generate();
            const newrole=await Role.create({id:id,name:name});
            const response={
                "status": true,
                "content": {
                  "data": {
                    "id": newrole.id,
                    "name": newrole.name,
                    "created_at": newrole.createdAt,
                    "updated_at": newrole.updatedAt
                  }
                }
              };
            return res.json(response);
        }
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({status:false,message:"internal server error"});
    }
}

const getAllRoles=async(req,res)=>{
    try{
        let {page=1}=req.query;
        const totroles=await Role.find().count();
        const roles=await Role.find().skip((page-1)*10).limit(10);
        const response={
            "status": true,
            "content": {
              "meta": {
                "total": totroles,
                "pages": Math.ceil(totroles/10),
                "page": page
              },
              "data": roles
            }
            };
        return res.json(response);
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({status:false,message:"internal server error"});
    }
}


module.exports={
    createRole,
    getAllRoles
}