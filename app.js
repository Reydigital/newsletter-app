const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "c767a489bcde2af9f0c5131fcbd37ba2-us9",
  server: "us9",
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();

const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: "c767a489bcde2af9f0c5131fcbd37ba2-us9",
  server: "us9",
});

const data = async () => {
  const response = await client.lists.batchListMembers("52db5e2e3d", {
      members : [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            }
          }
        ]
      });

  console.log(response);
};

run();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  var firstName = req.body.firstName
  var lastName = req.body.lastName
  var email = req.body.email

  const jsonData = JSON.stringify({
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    }
  });

  const url = "https://us9.api.mailchimp.com/3.0/lists/52db5e2e3d/members";

  const options = {
    method: "POST",
    auth: "reydigital1:c767a489bcde2af9f0c5131fcbd37ba2-us9",
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});



app.listen(3000, function(){
  console.log("Server is running on port 3000");
});


//API Key
//c767a489bcde2af9f0c5131fcbd37ba2-us9

//unique ID
//52db5e2e3d
