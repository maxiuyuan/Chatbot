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
			sendText(sender, "Text echo: " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
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

app.listen(app.get('port'), function(){
  console.log("running: port")
})
