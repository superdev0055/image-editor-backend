var express = require('express');
const { writeFileSync } = require("fs");
const bodyParser = require("body-parser");
var app = express();
var cors = require('cors');

app.use(cors());
var user_templates = require("./user_templates.json");
var demo_templates = require("./demo_templates.json");
var element_templates = require("./element_templates.json");
var short_tags = require("./short_tags.json");

// to write
const path_user = "./user_templates.json";
const path_demo = "./demo_templates.json";
const path_element = "./element_templates.json";

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get("/test",function (req,res) {
   console.log("test");
   res.json("test");
});

app.get('/user/get-all-templates', function(req, res){
   console.log("aa")
   var data = user_templates.user_templates.map((item ,i)=> {
      return {
        template_id:item.template_id,
        template_name:item.template_name,
        template_image_url:item.template_image_url
      };         
    });   

   return res.json(data);
});

app.get('/user/get-specific-template/:id', function(req, res){

   var template = user_templates['user_templates'].filter((item)=>{
      return item.template_id == req.params.id;
   });
   return res.json(template[0]);   
});

app.post('/user/update-template/:id', function(req, res){
   var index = user_templates['user_templates'].findIndex((item)=>{
      return item.template_id == req.params.id;
   });   
   user_templates['user_templates'][index] = req.body.data;
   try {

       writeFileSync(path_user, JSON.stringify(user_templates, null, 2), "utf8");
       return res.json("Data successfully saved");

   } catch (error) {

      return res.json("An error has occurred ", error);

   }
});

app.post('/user/create-template', function(req, res){
   user_templates['user_templates'].push(req.body.data);
        
   try {
       writeFileSync(path_user, JSON.stringify(user_templates, null, 2), "utf8");
       return res.json("Data successfully saved");
   } catch (error) {
      return res.json("An error has occurred ", error);
   }
});
//demo
app.get("/demo/get-all-templates",function(req,res){
   var data = demo_templates.demo_templates.map((item ,i)=> {
      return {
        template_id:item.template_id,
        template_name:item.template_name,
        template_image_url:item.template_image_url
      };         
    });      
 
   return res.json(data);
});

app.get("/demo/get-specific-template/:id",function(req,res){
   console.log(req.params.id);
   var template = demo_templates['demo_templates'].filter((item)=>{
      return item.template_id == req.params.id;
   });
   return res.json(template[0]);
});

//product
app.post("/product/get-preview-image",function(req,res){
   var product_images = require("./product_images.json")
   product_images = product_images['product_images'];
   function randomNum_create(max,min){
      let arr=[];
      for (i = 0; i < max; i++) {
          x = Math.floor( Math.random() * max) + min;
          if(arr.includes(x) == true){
              i=i-1;
          }else{
              if(x>max==false){
                  arr.push(x);
              }
          }
      }
      return arr;
   }
   function getProductByRandom(randomNum){
      let data = [];
      [0,0,0,0,0].forEach((arg,i)=>{

         product_images.forEach((element,index) => {

             if(index == randomNum[i]){
               data.push(element);
             }

         });

         if(i==4){
            return false;
         }

      });
      return res.json(data);
   }   
   if(req.body.keyword == ''){

      let randomNum = randomNum_create(8,0);
      getProductByRandom(randomNum);
      return res.json(data);      
      
   }else{
      var data = [];
      product_images.forEach((item,index)=>{
         if(item.id.indexOf(req.body.keyword) != -1 || item.title.indexOf(req.body.keyword) != -1 || item.brand.indexOf(req.body.keyword) != -1){
            data.push(item);
         }
      });
      if(data.length == 0){
         let randomNum = randomNum_create(8,0);
         getProductByRandom(randomNum);         
      }else{
         return res.json(data);
      }

   }
   
});

//element
app.get("/element/get-all-elements",function(req,res){
   var data = element_templates.element_templates.map((item ,i)=> {
      return {
        id:item.id,
        name:item.name,
        image_url:item.image_url
      };         
    });      
   return res.json(data);
});

app.get("/element/get-specific-element/:id",function(req,res){
   var element = element_templates['element_templates'].filter((item)=>{
      return item.id == req.params.id;
   });
   return res.json(element[0]);
});

//get ShortTag
app.get("/tags/get-all-tags",function(req,res){
   var data = short_tags.short_tags;
   return res.json(data);
});

app.listen(3000, function() {
   console.log('listening on 3000')
 });