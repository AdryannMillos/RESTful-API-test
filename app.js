///// Standard header for express, bodyParser, mongoose, ejs and lodash/////////
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

///////////////connecting, setting up mongoose and the schema///////////////////
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("article", articleSchema);

////////////////// "/articles" methods -> targeting all articles ///////////////
app.route("/articles")

  .get(function(req, res) {

    Article.find({}, function(err, allArticles) {
      if (!err) {
        res.send(allArticles);
      } else {
        console.log(err);
      }
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      name: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Success in adding a new article!")
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Success in deleting all articles!");
      }
    });
  });

////////////////// "/articles/something" methods -> targeting an specific article /////

app.route("/articles/:articleTitle")

.get(function(req, res){

Article.findOne({title: req.params.articleTitle}, function(err, specifiedArticle){
if(specifiedArticle){
  res.send(specifiedArticle);
}  else{
  res.send("Article not found!")
}
});
})

.put(function(req, res){
  Article.update(
   {title: req.params.articleTitle},
   {title: req.body.title, content: req.body.content},
   {overwrite: true}, function(err){
     if(!err){
       res.send("Sucessfully updated");
     }
   }
 );
})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.deleteOne({title: req.body.title}, function(err){
    if(!err){
      res.send("sucessfully deleted!");
    }
  });
});



app.listen(3000, function() {
  console.log("server running on port 3000");
});
