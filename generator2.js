Iconst dgram = require('dgram');


var express = require("express");
var bodyParser = require("body-parser");
 
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static(__dirname));

var flag=true;

app.post("/flow", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
	if(request.body.type!="flowstart") return;
    console.log("Flow envoked. "+request.body.ip+":"+request.body.port+" ("+request.body.buffersize+" bytes) x"+request.body.amount+" delayed "+request.body.delay+" ms."+((request.body.limited=="true")?"":"Unlimited"));
	const client = dgram.createSocket('udp4');
	response.send('Flow started');
	var i=0;
	var buf = new Buffer(request.body.buffersize*1);
	flag=true;
	
	function sendp(){
			if(!flag) return;
			client.send(buf, request.body.port, request.body.ip, function(err, bytes){
				        if (err) { 
							consloe.log("Error while sending")
                        } 
						})
			i++;
			console.log(i)
		
		if((request.body.limited=="false")||(i<request.body.amount))
			if(flag)
				setTimeout(sendp, request.body.delay);
		else{
			console.log("Flow ended");
			client.close();
		}
	} 

sendp();
});

app.post("/stopflow", urlencodedParser, function (request, response) {
    //if(!request.body) return response.sendStatus(400);
    console.log("Flow stopped");
	response.send('All flows stopped');
	flag = false;
});

app.listen(3000);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if(input=="stop"){
    console.log("Flow stopped");
	flag = false;	  
  }
  if(input=="exit"){
	  process.exit(); 
  }
});

//client.close();