const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://Cluster90555:test123@cluster90555.ymlphtg.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster90555'
);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

const homeStartingContent =
  'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
let posts = [];

async function getPost() {
  const posts = await Post.find({});
  return posts;
}

app.get('/', function (req, res) {
  getPost().then(function (foundPosts) {
    res.render('home', { homecontent: homeStartingContent, posts: foundPosts });
  });
});

app.get('/about', function (req, res) {
  res.render('about', { content: aboutContent });
});
app.get('/contact', function (req, res) {
  res.render('contact', { content: contactContent });
});
app.get('/compose', function (req, res) {
  res.render('compose');
});

async function findPost(reqPostID) {
  const post = await Post.findOne({ _id: reqPostID });
  return post;
}

app.get('/posts/:postID', function (req, res) {
  var reqPostID = req.params.postID;
  console.log(reqPostID);
  findPost(reqPostID).then(function (post) {
    res.render('post', { post: post });
    //console.log(post);
  });
});

app.post('/compose', function (req, res) {
  const blog = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  blog.save();
  // const post ={title : req.body.postTitle ,
  //     content : req.body.postBody
  // }
  // posts.push(post);
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Post.deleteOne({ _id: req.params.id });
  return res.redirect('/');
});

app.listen('3000', () => {
  console.log('Server is running on port 3000');
});
