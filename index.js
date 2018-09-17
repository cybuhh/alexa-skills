const express = require('express');
const alexa = require('alexa-app');

const tvApi = require('./tv-api')(process.env.TV_IP);

const port = process.env.port || 3000;
const app = express();

const alexaApp = new alexa.app('tv');

// setup the alexa app and attach it to express before anything else
alexaApp.express({
    expressApp: app,
    checkCert: false,
    debug: true
});

// ask my remote to turn on
alexaApp.intent('turn', {
    'slots': { 'status': 'status' },
    'utterances': ['turn {status}']
  },
  async function(request, response) {
    const status = request.slot('status');
    console.log('status', status);
    response.say(`You asked to change status to ${status}`);
    if (status === 'off') {
      if (tvApi.isAlive()) {
        await tvApi.powerOff();
      } else { 
        response.say('TV is offline');

      }
    }
  }
);

alexaApp.intent("AMAZON.HelpIntent", {
    "slots": {},
    "utterances": []
  },
  function(request, response) {
    var helpOutput = "You can say 'ask my remote to turn on'. You can also say stop or exit to quit.";
    var reprompt = "What would you like to do?";
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  }
);
 
alexaApp.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var stopOutput = "Don't You Worry. I'll be back.";
    response.say(stopOutput);
  }
);
 
alexaApp.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var cancelOutput = "No problem. Request cancelled.";
    response.say(cancelOutput);
  }
);

alexaApp.launch(function(request, response) {
    response.say("You launched the app!");
});
  
// now POST calls to /sample in express will be handled by the app.request() function
// GET calls will not be handled

app.get('/', function (req, res) {
    res.send('Hello World')
});

// from here on, you can setup any other express routes or middleware as normal
app.listen(port);
console.log(`Listening on port ${port} try http://localhost:${port}`);
