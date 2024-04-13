const User=require("../models/userSchema.js");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {Snowflake}=require("@theinternetfolks/snowflake");
const register=async(req,res)=>{

    // 1)check if user already exist
    // 2) hash the password
    // 3) create a new user
    // 4) generate token
    // 5) send response

    try{
        const {name,password,email}=req.body;
        
    
        const finduser=await User.findOne({name:name});
        const findemail=await User.findOne({email:email});
        if(finduser)
        {
            return res.status(400).json({status:false,message:"user already exist"});
        }
        else if(findemail)
        {
            return res.status(400).json({status:false,message:"email already exist"});
        }
        else{
            const hash=await bcrypt.hash(password,7);
            const id=Snowflake.generate();
            const newuser=await User.create({id:id,name:name,email:email,password:hash});

            const token=jwt.sign({id:newuser.id,user:newuser.user},process.env.JWT_SECRET);
            const response = {
                status: true,
                content: {
                  data: {
                    id: newuser.id,
                    name: newuser.user,
                    email: newuser.email,
                    created_at: newuser.createdAt,
                  },
                  meta: {
                    access_token: token
                  }
                }
              };
            
              res.json(response);
            
        }
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({status:false,message:"internal server error"});
    }
}

const login=async(req,res)=>{

    // 1)check if user already exist
    // 2) compare the password
    // 3) generate token
    // 4) send response

    try{
        const {email,password}=req.body;
        
        const finduser=await User.findOne({email:email});
        if(finduser)
        {
            const match=await bcrypt.compare(password,finduser.password);
            if(match){
                const token=jwt.sign({id:finduser.id,name:finduser.name},process.env.JWT_SECRET);
                const response = {
                    status: true,
                    content: {
                      data: {
                        id: finduser.id,
                        name: finduser.name,
                        email: finduser.email,
                        created_at: finduser.createdAt,
                      },
                      meta: {
                        access_token: token
                      }
                    }
                  };
                
                  res.json(response);
            }
            else{
                return res.status(401).json({status:false,message:"invalid credentials"});
            }
        }
        else{
            
            return res.status(404).json({status:false,message:"no such user exist"});
        }
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
}

const me=async(req,res)=>{
    try{
        
        const user=req.user;
        const id=user.id;
        const finduser=await User.findOne({id:id});
        if(finduser)
        {
            const response={
                "status": true,
                "content": {
                  "data": {
                    "id": finduser.id,
                    "name": finduser.name,
                    "email": finduser.email,
                    "created_at": finduser.createdAt
                  }
                }
              };
            res.json(response);
        }
        else{
            res.status(404).json({message:"user not found"});
        }
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
}


module.exports={register,login,me};