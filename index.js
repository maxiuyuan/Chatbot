'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

const token = "EAAE5Hez6YUsBALJBKBDr8TgZBid7utHQPt3Xmp4zbO2LFoMCzrqQ96ZCHhAbnryP8qkTREIPhaD2cKkIZBrfIWBmMuxOv2gwD2e5nncNubiQ9M0hLPhgreXv31zmuwpJDx0ksqoygu2jmjD9xmwKrfZB2EeAG7hqoZBQ5hRI7UtuZCcNYmF5ZC7"

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// routes

app.get('/', function(req, res){
  res.send("hello")
})

//For FB

app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === "XM_chatbot_setup"){
    res.send(req.query['hub.challenge'])
  }
  res.send("wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
      text = text.toLowerCase()
      decideMessage(sender, text)

    /*  if(text.includes("weather")){

        var YQL = require('yql');
        var query = new YQL('select item.condition from weather.forecast where woeid = 4118 and u="c"');

            query.exec(function(err, data) {
                var condition = data.query.results.channel.item.condition;
                var date = condition.date.substring(0, 16);
                var time = condition.date.substring(17, 25);

                text = "The current weather in Toronto on " + date + " at "+ time + " is " + condition.temp + "°C. The current condition is: " + condition.text.toLowerCase()

                sendText(sender, text.substring(0, 1000))
         })

      }
      else{
        text = "Sorry, The command you entered is not valid. Please Type one of these commands: weather"
        sendText(sender, text.substring(0, 100))
      }
			//sendMessage(sender, text.substring(0, 100))
		}*/
  }
    if(event.postback){
      let text = JSON.stringify(event.postback)
      decideMessage(sender, text)
      continue
    }
}
	res.sendStatus(200)
})

function decideMessage(sender, text){

        if(text.includes("weather")){

          var YQL = require('yql');
          var query = new YQL('select item.condition from weather.forecast where woeid = 4118 and u="c"');

              query.exec(function(err, data) {
                  var condition = data.query.results.channel.item.condition;
                  var date = condition.date.substring(0, 16);
                  var time = condition.date.substring(17, 25);

                  text = "The current weather in Toronto on " + date + " at "+ time + " is " + condition.temp + "°C. The current condition is: " + condition.text.toLowerCase()

                  sendText(sender, text.substring(0, 1000))
                  sendOutfitButton(sender)

           })

        }
        else if(text.includes("yes")){
          var url = getOutfit(text)
          sendOutfitImage(sender, url)
        }


        else{
          text = "Sorry, The command you entered is not valid. Please Type one of these commands: weather"
          sendText(sender, text.substring(0, 100))
        }
  			//sendMessage(sender, text.substring(0, 100))
  		}

function getOutfit(text){
  var outfit = ["https://i.imgur.com/M7dHcQN.png",
                "https://i.imgur.com/F8wmHCY.jpg",
                "https://i.imgur.com/4bTGCSh.jpg",
                "https://i.imgur.com/IaNMgFG.jpg",
                "https://i.imgur.com/QAYPso1.jpg",
                "https://i.imgur.com/TmgoHNe.jpg",
                "https://i.imgur.com/RojUhWO.jpg",
                "https://i.imgur.com/ERn6j8x.jpg",
                "https://i.imgur.com/Sg42ocL.jpg",
                "https://i.imgur.com/rRPv18m.png",
                "https://i.imgur.com/tdmfl2S.jpg",
                "https://i.imgur.com/dzklp49.jpg",
                "https://i.imgur.com/LIEW0Fy.jpg",
                "https://i.imgur.com/jW6mgEV.jpg",
                "https://i.imgur.com/dmb2imY.jpg",
                "https://i.imgur.com/XIBDt3b.jpg",
                "https://i.imgur.com/BBCJtC9.jpg",
                "https://i.imgur.com/nrMh2ZD.jpg",
                "https://i.imgur.com/UthAQ4o.jpg",
                "https://i.imgur.com/Bz9JtU0.jpg"
                ]
var i =Math.floor(Math.random() * 20);
return outfit[i]
}

function sendText(sender, text) {
	let messageData = {text: text}
  sendRequest(sender, messageData)
/*	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})*/
}

function sendOutfitButton(sender){
  let messageData = {
  "attachment":{
  "type":"template",
  "payload":{
    "template_type":"button",
    "text":"Would you like an outfit recommendation for today?",
    "buttons":[
      {
        "type":"postback",
        "title":"Yes",
        "payload":"yes"
      },
      {
        "type":"postback",
        "title":"No",
        "payload":"asdsadasd"
      }
    ]
  }
}
  }
  sendRequest(sender, messageData)
}

function sendOutfitImage(sender, url){
  let messageData = {
    "attachment": {
      "type": "image",
      "payload": {
          "url": url
      }
    }
  }
  sendRequest(sender, messageData)
}

function sendRequest(sender, messageData){
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs : {access_token: token},
    method: "POST",
    json: {
      recipient: {id: sender},
      message : messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("sending error")
    } else if (response.body.error) {
      console.log("response body error")
    }
  })
}

/*function sendMessage(sender, text1){
  let text = text1.toLowerCase()
  if (text.include("weather")){

  else{
    sendText(sender, "Sorry thats not one of the options. Try typing: Weather")
  }
}*/

app.listen(app.get('port'), function(){
  console.log("running: port")
})
