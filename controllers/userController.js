import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function saveUser(req,res){

    if(req.body.role  == "admin"){
        if(req.user == null){
            res.status(403).json({
                message: "Please login as admin to create a new user"
            });
            return;
        }
        if(req.user.role != "admin"){
            res.status(403).json({
                message: "You are not authorized to create a new admin account "
            });
            return;
        }

    }
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashPassword);

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashPassword,
        phone: req.body.phone,
        role : req.body.role,
    });

    user.save()
        .then(() => {
            res.status(201).json({
                message: "User saved successfully",
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error saving user",
                error: error.message
            });
        });
}
export function loginUser(req, res) {
    const  email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email : email
    }).then((user) => {
        if(user == null){
            res.json({
                message: "User not found"
            })
        }else{
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if(isPasswordCorrect){
               
                const userData = {
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    role : user.role,
                    phone : user.phone,
                    isDisabled : user.isDisabled,
                    isEmailVerified : user.isEmailVerified
                };
              const token = jwt.sign(userData,process.env.JWT_KEY)
                res.json({
                    message: "Login successful",
                    token: token
                });  
        }else{
            res.json({
                message: "Incorrect password"
            });
        }
    }
})
}
    

