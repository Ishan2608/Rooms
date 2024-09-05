import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge});
}

export const signup = async (req, res, next) => {
    try{
      // Log fields from req.body. Log file info from req.file
      // console.log("Request Body:", req.body);
      // console.log("Uploaded File:", req.file);
      const { firstName, lastName, username, email, password } = req.body;
      if (!email) {
        return res.status(400).send("Email is missing");
      }
      if (!password) {
        return res.status(400).send("Password is missing");
      }
      if (!firstName) {
        return res.status(400).send("First Name is missing");
      }
      if (!lastName) {
        return res.status(400).send("Last Name is missing");
      }
      if (!username) {
        return res.status(400).send("Username is missing");
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send("Email already exists");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });

      // Update image if provided
      if (req.file) {
        const folderPath = `/images/users`;
        const imageUrl = `${folderPath}/${req.file.filename}`;
        user.image = imageUrl;
      }

      // Save updated user
      const userData = await user.save();

      res.cookie("jwt", createToken(email, userData.id), {
        maxAge,
        secure: true,
        sameSite: "None",
      });

      // status code 200 means success for POST request
      return res.status(201).json({
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        image: userData.image,
      });
    }
    catch (err){
        console.log(err);
        return res.status(500).send("Error creating user");
    }
}

export const login = async (req, res, next) => {
    try{
        // console.log(req.body);
        const {email, password} = req.body;
        if (!email){
            return res.status(400).send("Email is missing");
        }
        if (!password){
            return res.status(400).send("Password is missing");
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send("User not found. Please Sign Up");
        }

        const auth = await bcrypt.compare(password, user.password);
        if(!auth){
            return res.status(400).send("Incorrect Password");
        }

        res.cookie("jwt", createToken(email, user.id), {
            maxAge, secure: true, sameSite: "None"
        });
        
        // status code 200 means success for GET request
        return res.status(200).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            image: user.image
        });
    }
    catch (err){
        console.log(err);
        return res.status(500).send("Login failed");
    }

}

export const getUserInfo = async (req, res, next) => {
    try{
        const userData = await User.findById(req.userId);
        if(!userData) {
            return res.status(404).send("User Not Found");
        }
        return res.status(200).json({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            image: userData.image
        })
    } catch (error){
        res.status(500).send("Some error occurred on server");
        console.log(error)
    }
}

// Helper function to delete the old profile image
const deleteOldImage = (imagePath) => {
  if (imagePath) {
    const filePath = path.join(__dirname, '..', 'public', imagePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting old image:", err);
      }
    });
  }
};

export const updateProfileInfo = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, username, email, password } = req.body;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update image if provided
    if (req.file) {
      console.log(req.file.filename);
      // Delete old image if it exists
      const oldImagePath = user.image; // Old image path in the database
      deleteOldImage(oldImagePath);

      // Save new image
      const timestamp = new Date().getTime();
      const imageUrl = `/images/users/${timestamp}-${req.file.filename}`;
      user.image = imageUrl;
    }

    // Save updated user
    const userData = await user.save();

    console.log("Profile Updated");

    // Return updated user data
    return res.status(200).json({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      image: userData.image,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating profile" });
  }
};