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

const SECRET='fdhjsfgjshfs34384gdf'

app.use(cors({credentials:true,origin:'http://localhost:5173'}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads',express.static(__dirname + '/uploads'))

mongoose.connect('mongodb+srv://adarsh5122002:oIPJooEM76JVU7uZ@cluster0.scnp9fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

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
     
    res.json(
        await Post.find()
                .populate('author',['username'])
                .sort({createdAt: -1})
                .limit(20)
    );
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



app.listen(3000,()=>{
    console.log("Server started")
})