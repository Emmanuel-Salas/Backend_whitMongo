import bcrypt from "bcryptjs"
import  Users  from"../models/Users";
import jwt from "jsonwebtoken";
import { SECRET, config } from "../config";


export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    const findUser = await Users.findOne({ email });

    if (findUser) {
      res.status(400).json({ message: 'User already exists with this email address' });
      return;
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the new user
    const savedUser = await newUser.save();

    // Generate token
    const token = await jwt.sign({userId: savedUser._id, email: savedUser.email} , SECRET,{expiresIn: 86400});

    return res.json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Signup failed:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const signin = async (req,res) => {
    const { email, password } = req.body;
    try {

        // encontramos un usuario en mongo
        const findUser = await Users.findOne({email:email});
        console.log(findUser);
        
        //
        if (!findUser) {
            res.status(400).json({ message: 'No user found' });
            return;
          }
        //comparamos la contraseña que llegó por req.body y la de la base de datos
        const matchPassword = await bcrypt.compare(password, findUser.password);7

        // si no coincide la contraseña, te manda a chingar a tu madre
        if(!matchPassword){
            return res.status(403).json({message:"User not found"})
        }

        const token = await jwt.sign({userId: findUser._id, email: findUser.email} , SECRET,{expiresIn: 86400});

        //si coinciden las contraseñas, retorna la informacion
        return res.status(200).json({token});
    } catch (error) {
        res.status(500).json({msg:"The password is incorrect"})
        console.error("Login not generated: ",error.message);
    }
}

export default{
    SECRET: 'findfood'
};