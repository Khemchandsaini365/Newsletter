const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); // you need to add dependency first. See tips.
 
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
 
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
 
client.setConfig({
  apiKey: "1d7a3f0b82911b2cd01d56c1eb20d1da-us21",
  server: "us21",
});
 
app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }
 
  const run = async () => {
    try {
      const response = await client.lists.addListMember("f076b5ba8e", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  };
 
  run();
});
 
app.post("/failure", function(req, res) {
  res.redirect("/");
});
 
app.listen( process.env.PORT|| 3000, function() {
  console.log("Server is running on port 3000.");
});




/* //jshint esversion: 6
const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
const client = require("@mailchimp/mailchimp_marketing");
const https=require("https");


const app=express();
app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended:true}))

app.get("/", function(req, res){
    res.sendFile((__dirname+"/signup.html"))
})


client.setConfig({apiKey: "1d7a3f0b82911b2cd01d56c1eb20d1da-us21", server: "us21",});


app.post("/", function(req,res){
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.email;
    console.log(firstname, lastname, email);

    
   const data={
    members:[
        {
            email_address: email ,
            status: "subscribed",
            merge_fields:{
                FNAME: firstname,
                LNAME: lastname
            }
        }
    ]
   }  ;

   const jsonData=JSON.stringify(data);
   const url="https://us21.api.mailchimp.com/lists/f076b5ba8e";
   const Option={
    method: "POST",
    auth: "khemu:1d7a3f0b82911b2cd01d56c1eb20d1da-us21"
   }
   const request= https.request(url, Option, function(response){
        if (response.statusCode===200) {
            res.sendFile(__dirname+"/success.html")
        }  else{
            res.sendFile(__dirname+"/failure.html")
        }  
    
    response.on("data", function(data){
            console.log(JSON(data));
        });
   });
   request.write(jsonData);
   request.end();
   

  
}) ;

app.listen(3000, function(){
    console.log("server at port 3000");
});
//apikey=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
//listid=f076b5ba8e,f076b5ba8e
//api=652a5fbe9c89246952a47b679878c0c6-us21
//https://us21.admin.mailchimp.com/lists/
//api=1d7a3f0b82911b2cd01d56c1eb20d1da-us21 */