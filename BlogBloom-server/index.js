require('dotenv').config()
const express=require('express')
const app=express()
const cors=require('cors')
const mongoose=require('mongoose')
const User=require('./models/user')
const bcrypt=require('bcryptjs')
const salt=bcrypt.genSaltSync(10)
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const multer=require('multer')
const uploadMiddleware=multer({dest:'uploads/'})
const fs=require('fs')

const Post=require('./models/post')

const SECRET=process.env.SECRET_KEY
const DB=process.env.DATABASE

app.use(cors({credentials:true,origin:'http://localhost:5173'}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads',express.static(__dirname + '/uploads'))

mongoose.connect(DB)

app.post('/register',async (req, res)=>{
    const {username,password}=req.body
    try {
        const userDoc=await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
        })
        res.json(userDoc)
    } catch (error) {
        res.status(400).json(error)
    }
   
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const userDoc = await User.findOne({ username });

        if (userDoc) {
            const passCorrect = bcrypt.compareSync(password, userDoc.password);

            if (passCorrect) {
                jwt.sign({ username, id: userDoc._id }, SECRET, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json({
                        id: userDoc._id,
                        username,
                    });
                });
            } else {
                res.status(400).json("Wrong credentials");
            }
        } else {
            // User not found in the database
            res.status(400).json("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
});



app.get('/me', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, SECRET, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(info);
    });
});


app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);

        const { token } = req.cookies;
        jwt.verify(token, SECRET, {}, async (err, info) => {
            if (err) throw err;

            const { title, summary, content } = req.body;
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });

            res.json(postDoc);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/posts', async (req, res) => {
    const query=req.query
    // console.log(query)
    const searchFilter={
        title:{$regex:query.search, $options:"i"}
    }
    const posts=await Post.find(query.search?searchFilter:null)
                    .populate('author',['username'])
                    .sort({createdAt: -1})
                    .limit(20)
    res.status(200).json(posts)
});

app.get('/post/:id',async (req,res)=>{
    const {id}=req.params
    const postDoc=await Post.findById(id).populate('author',['username'])
    res.json({postDoc:postDoc})
    
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;

    try {
      const postDoc = await Post.findByIdAndUpdate(
        id,
        {
          title,
          summary,
          content,
          cover: newPath ? newPath : postDoc.cover,
        },
        { new: true } // to get the updated document
      );

      if (!postDoc) {
        return res.status(404).json('Post not found');
      }

      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }

      res.json(postDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json('Internal Server Error');
    }
  });
});



app.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    const results = await Post.find({
      title: { $regex: new RegExp(query, 'i') },
    })
    .populate('author', ['username'])
    .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const { username} = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the username if provided
        if (username) {
            user.username = username;
        }

        // Update the password if provided
        // if (password) {
        //     const hashedPassword = bcrypt.hashSync(password, salt);
        //     user.password = hashedPassword;
        // }

        // Save the updated user information
        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        console.log('User',user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await user.deleteOne();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(3000,()=>{
    console.log("Server started")
})