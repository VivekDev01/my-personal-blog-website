//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Welcome to my brand new Blog-Website. Here you can see all my blog posts in brief. If you want to see full detailed post then click on 'Read More'. Hope you like it. ";
const aboutContent = "I am Vivek Dev Shah, a student of IIIT Ranchi. I am pursuing my B.Tech from computer Science and Engineering branch. Currently I am in 3rd year.";
const contactContent = "You can contact me by Email: vivek65.ugcs20@iiitranchi.ac.in | Phone: +91-8718836845";

mongoose.connect("mongodb+srv://VivekDevShah:987321@cluster0.gpzhl96.mongodb.net/blogsDB");

const postSchema= new mongoose.Schema({
  title: String,
  postContent: String
});

const Post= mongoose.model("Post",postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  Post.find({},function(err, posts){
    if(err)
    {
      console.log(err);
    }
    else{
      res.render("home", {startingContent: homeStartingContent, posts: posts});
    }
  })
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: _.capitalize(req.body.postTitle),
    postContent: req.body.postBody
  });
  post.save();

  res.redirect("/");

});

app.get("/posts/:postID", function(req, res){
  const requestedID = req.params.postID;
  Post.findOne({_id:requestedID}, function(err, post){
    if(err){
      console.log(err);
    }
    else{
      res.render("post", {title: post.title,content: post.postContent});
    }
  });
});

app.get("/posts", function(req,res){
  
    Post.find({},function(err, posts){
      if(err){
        console.log(err);
      }
      else{
        res.render("posts", {posts:posts});
      }
    });
 
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, function() {
  console.log("Server started on port 5000");
});
