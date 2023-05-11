var express = require('express');
const { writeFileSync } = require("fs");
const bodyParser = require("body-parser");
var app = express();
var cors = require('cors')
var user_templates = require("./user_templates.json");
var demo_templates = require("./demo_templates.json");
// to write
const path_user = "./user_templates.json";
const path_demo = "./demo_templates.json";

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

app.get('/user/get-all-templates', function(req, res){

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


// app.post('/user/create-template', function(req, res){
//    console.log("create");
//    demo_templates['demo_templates'].push(req.body.data);
        
//    try {
//        writeFileSync(path_demo, JSON.stringify(demo_templates, null, 2), "utf8");
//        return res.json("Data successfully saved");
//    } catch (error) {
//       return res.json("An error has occurred ", error);
//    }
// });
app.listen(3000);