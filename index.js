var restify = require('restify');
var builder = require('botbuilder');
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
// var connector = new builder.ChatConnector({
//     appId:"70fff0fb-b4e2-4cb4-b173-7ed7a039b1de",
//     appPassword: "jWA2rdit691u8MgRvLCEPfY"
// });

var connector = new builder.ChatConnector({
    appId:"a674f5b8-4bba-49a2-87ab-7fddf4fe6e27",
    appPassword: "YfcxWVbDegqr6n5uVdrZ9Bg"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
bot.dialog('/', intents);

intents.matches(/request/i, [
    function (session) {
        session.beginDialog('/request');
    },
    function (session, results) {
        session.send('Thanks for your question ,it was lovely chatting with you:)');
    }
]);


intents.onDefault([
     function (session) {
       if(!session.userData.name){
               session.beginDialog('/getName');
       }
       else{
             session.beginDialog('/redirect');
       }
       
    },
    function (session, results) {
      
    }
]);

bot.dialog('/request', [
    function (session) {
        builder.Prompts.choice(session, "Whom do you want to raise request for?", ["Myself", "Some one else"]);
    },
    function (session, results) {
        session.userData.answerforRequest = results.response.entity;
        if(session.userData.answerforRequest=="Myself"){
          builder.Prompts.text(session,'login with your username and password ,click on request for self on the side menu.Tell me when your done :)');
        }
        else{
          builder.Prompts.text(session,'login with your username and password ,click on request for others on the side menu.Tell me when your done :)');
        }
        //session.endDialog();
       // builder.Prompts.prompt(session, "Let me know when your done :)");
    },
    function (session, results,next) {
          if(session.userData.answerforRequest!="Myself"){
         //
         builder.Prompts.text(session,'search the user for whom you would like to raise a request and click next.Tell me when your done');
         // builder.Prompts.prompt(session, "Let me know when your done :)");
        }
        else{
          next();
        }
        

    },
    function (session, results,next) {
      session.send('From the drop down on the left hand side select the type of item you need,add it to cart and submit ');

      session.send('Waala your done!!');
      session.endDialog();
    }
]);

bot.dialog('/getName',[

  function (session) {
        builder.Prompts.text(session, "Well hi there!!!,What is your name?");
    },
    function (session,results) {
        session.userData.name=results.response;

          session.send('Nice to meet you %s ,currently we can answer questions related only to request feature, if you wanna know about requests just say the word.',session.userData.name);
          session.endDialog();
    }
])

bot.dialog('/redirect', [
  function (session,results) {

          session.send('Hi  %s ,currently we can answer questions related only to request feature, if you wanna know about requests just say the word.',session.userData.name);
          session.endDialog();
    }

])