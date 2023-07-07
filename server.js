const express = require("express")
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const Userdata = require('./model')
app.use(express.json())
app.use(
    express.urlencoded({ extended: true })
);

app.use(cors());
mongoose.connect('mongodb+srv://Ecommerce:Ecommerce@cluster0.0fug6mf.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("server running")).catch(err => console.log(err))
    

// Get Request


app.get("/users", async (req, res) => {
    try {
        const alldata = await Userdata.find()
        return res.json(alldata)
    }
    catch (err) {
        res.json(err.message)
    }


})


app.get("/users/:id", async (req, res) => {
    try {
        const data = await Userdata.findById(req.params.id)
        return res.json(data)
    }
    catch (err) {
        res.json(err.message)
    }
})


// POST Request

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body
    
    const existingUser = await Userdata.findOne({ name });
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }
    try {

        // const salt = await bcrypt.genSalt(10);
    
        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newData = new Userdata({name,email,password:hashedPassword})    
        await newData.save();
        return res.json( await Userdata.find())
    }
    catch (err) {
        res.json(err.message)
    }
})


// LOGIN
app.post("/userslogin", async (req, res) => {
    
    const { name,password} = req.body;

    try {
        // Find the user by username in the database
        const user = await Userdata.findOne({ name });
    
        // If user not found, return an error response
       
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({message:"Invalid username or password"});
          }

      res.status(200)  
    
        // Generate a JWT token
        const token = jwt.sign({ name: user.name, userId: user._id },`${process.env.JWT_SECRET_KEY}`, { expiresIn: '1h' });

     return res.json({token})
        // Return the token in the response
        
      } catch (error) {
        console.error('Error during login:', error);
         res.status(500).json({ message: 'An error occurred during login' });
      }


})
// PUT Request

app.put('/users/:id' , async (req, res) => {
  try {
    const { id } = req.params;
    const  name  = req.body.name;

    // Update the username in the database
    const updatedUser = await Userdata.findByIdAndUpdate(id, { name }, { new: true });
      
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the updated user as the response
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
   
       
        
// DELETE Request
app.delete('/deleteusers/:id', async (req, res) => {
    const id =req.params.id
  
    // Example logic to delete a user with the given ID from a database
    try {
        const deletedUser = await Userdata.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
          }
        res.json({ message: 'Account deleted successfully' });
      } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
   