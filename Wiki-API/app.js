//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
// Setting Up connection
mongoose.connect('mongodb://localhost:27017/wikiDB' , {useNewUrlParser: true}).then(()=>{
    console.log("Mongo Connected");
}).catch(err=>{
    console.log("OH error");
    console.log(err);
});

const articleSchema = {
  title: String,
  content: String
}


const Article = mongoose.model("Article", articleSchema);
// GET - to get all articles
// POST- to create a new article 
// delete - deletes all articles
app.route("/articles")
  .get((req,res)=>{
    Article.find({},(err,articles)=>{
      if(err){
        res.send(err)
      }else{
        res.send(articles);
      }
    });
  })
  .post((req,res)=>{
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save((err)=>{
      if(err){
        res.send(err)
      }else{
        res.send("Success")
      }
    });
  })
  .delete((req,res)=>{
    Article.deleteMany({}, (err)=>{
      if(err){
        res.send(err)
      }else{
        res.send("deleted")
      }
    })
  });
// For a particular article
app.route("/articles/:articleTitle")
  .get((req,res)=>{
    Article.findOne({title: req.params.articleTitle}, (err,article)=>{
      if(article){
        res.send(article)
      }else{
        res.send("no article")
      }
    } )
  })
  .put((req,res)=>{
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content}, {overwrite: true},(err)=>{
        if(!err){
          res.send("updated")
        }else{
          res.send(err)
        }
      }
    )
  })
  .patch((req,res)=>{
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {$set: req.body},
      (err)=>{
        if(!err){
          res.send("updated")
        }else{
          res.send(err)
        }
      }
    )
  })
  .delete((req,res)=>{
    Article.deleteOne({title: req.params.articleTitle}, (err)=>{
      if(!err){
        res.send("deleted")
      }else{
        res.send(err)
      }
    })
  })


app.listen(3000, function() {
  console.log("Server started on port 3000");
});