$(document).ready(function(){
	
//document.body.onmousedown = function() {return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
	
	function addNotes(mess){notes += "  -" + mess + "~"}
	var notes = "Last update: June 3rd 2015 ~~New stuff: ~~"
	addNotes("More Levels!");
	addNotes("Tweaks to UI for elevators");
	addNotes("Bug Fix for prompts");
	addNotes("Sledge Hammers and Hazmat Suits!");
	addNotes("Swappable guns!");
	addNotes("Manual Reloading");
	addNotes("Updated gun sounds");
	addNotes("Speech Bubbles");
	addNotes("Collision Bug fix")
	addNotes("Fix to a couple cutscenes");
	
	addNotes("UI Overhaul for the editor");
	addNotes("Up to 33 Levels!");
	addNotes("This update screen");
	addNotes("Cool bio textures, tons of them");
	addNotes("More level: 24, 25, 26, 27, 28");
	
	notes += "~~Stuff in Testing: ~~"
	addNotes("Not much ATM");
	
	notes += "~~TO DO: ~~";
	addNotes("Save games");
	addNotes("Tweeks to collision detection");
	addNotes("More sounds");
	addNotes("More Levels");
	addNotes("Redo rear leg of small bug animation");
	addNotes("End game condition");
	addNotes("Ingame option button for saves/options");
	addNotes("System to get from main game to main menu and back again.");
	addNotes("Mid wall pipe joiners");
	addNotes("Thin horizontal pipes");
	addNotes("Bio Floors");
	
	var numObjects = 0;
	var numObjectsLoaded =0;
	
	var paintDelay = 0;
	var tStart = 0;
	var tEnd = 0;
	
	
	var mapD = 10
	var mapW = Math.round((w * 2)/(100/mapD));
	var mapH = Math.round((h * 2)/(100/mapD));
	var mapX = w - mapW;
	var mapY = h - mapH;
	var mapAni = 0;
	var mapAlpha = 0;
	
	var allyX = 10;
	var allyY = 10;
	
	var switching = true;
	var w1 = null
	var w2 = null
	
	var terminalVel = 20
	
	var screen = 0;
	var cS = 0;
	var playerCharacter;
	var allies = []
	var ctxOx = 0;
	var ctxOy = 0;
	var castOx = 0;
	var castOy = 0;
	var rumble = 0;
	
	var dPx, dPy;
	
	var dataX = 300
	var dataY = h - 100
	
	var aniDelay = 1;
	var ani = 0;
	
	var pans =1

	var parax = 0//(creature[0].x - w/2)*0.1 + ctxOx*5
	var paray = 0//(creature[0].y - h/2)*0.1 + ctxOy*5
	
	var firing = 0;
	var recoil = false;
	var mDown = false;
	
	var cLevel = 0;
	var level = [];
	var levelName = "";
	var scene = 0
	
	var rLights = [];
	var dLights = [];
	var pulseLights = [];
	var lamps = [];
	var wall = [];
	var wallPanels = [];
	var creature = [];
	var items = [];
	var foreGround = [];
	var foreGroundDark = [];
	var elevators = [];
	var exits = [];
	
	var cutscene = [];
	
	
	//UI stuff
	var ridingElevator = false;
	var transit = false;
	
	
	//Prompt stuff
	var talking = false;
	var prompting = false;
	var promptMessage = [];
	var promptTitle = []
	var promptIndex = -1;
	var promptAni = 0;
	var promptScroll = 0
	var promptLines = 0;
	var promptHeight = 220
	var promptCreature = []
	
	var aniFast = 0; // max value of 10
	
	function makePrompt(t, m, c){
		promptIndex = 0;
		promptMessage.push(m);
		promptTitle.push(t);
		
		var mess = m;
		var i =0;
		var cSpeak = ""
		var slicer = -1;
		while (i < mess.length){
			if(mess[i] == '$'){
				slicer = i;
				while(i < mess.length - 1){
					i++;
					cSpeak += mess[i];
				}
			}
			i++;
		}
		
		
		if(cSpeak.length > 0) {
			if(cSpeak == 99) promptCreature.push(creature.length-1);
			else if(cSpeak == 98) promptCreature.push(creature.length-2);
			else if(cSpeak == 97)promptCreature.push(creature.length-3) ;
			else promptCreature.push(Number(cSpeak)) ;
			mess = mess.slice(0,slicer);
			promptMessage[promptMessage.length -1] = mess;
		}else promptCreature.push(null);
		
		prompting = true;
		

	}
	
	
	function speak(m){
		if ('speechSynthesis' in window) {
		// Synthesis support. 
			var speaker = ""
			for(var i=0; i < m.length;i++){
				if(m[i] != '~'){
					speaker += m[i];
				}
			}
		
			msg.text = speaker
			speechSynthesis.speak(msg);
			
		}
	}
	
	var slogan = []
	slogan.push("Why change the world when you can change its people? --")
	slogan.push("Home is where the heart is.");
	slogan.push("Build a better heart, build a better home");
	slogan.push("Send them where they're happiest");
	slogan.push("Lets send them home");
	slogan.push("It just makes sense");
	slogan.push("Its best for everybody");
	slogan.push("Increase happiness, increase profits!");
	slogan.push("A better world for everyone");
	slogan.push("Join the colonies!");
	slogan.push("Room for all -- the colonies need you today --");
	slogan.push("Its time to do whats right for everyone --");
	
	
	//Names
	var ranks = []
	ranks.push("Pvt.");
	ranks.push("Lt.");
	ranks.push("Cpt.");
	ranks.push("Cpl.");
	ranks.push("Lt Col.");
	
	var HNames = []
	HNames.push("Monroe");
	HNames.push("Bailey");
	HNames.push("Stevens");
	HNames.push("Kader");
	HNames.push("Dowe");
	HNames.push("Dering");
	HNames.push("Reade");
	HNames.push("Wynn");
	HNames.push("Holt");
	HNames.push("Cantos");
	HNames.push("Silva");
	HNames.push("Santini");
	HNames.push("Gorman");
	HNames.push("Moora");
	HNames.push("Cotte");
	HNames.push("Cooker");
	
	var PNames = [];
	PNames.push("Eve");
	PNames.push("Clara");
	PNames.push("Sil");
	PNames.push("Tess");
	PNames.push("Crys");
	PNames.push("Rena");
	PNames.push("Mora");
	PNames.push("Kasa");
	PNames.push("Tora");
	PNames.push("Nade");
	PNames.push("Lide");
	PNames.push("Luca");
	PNames.push("Vela");
	
	var nPanel = 0
	var mapGrid = []
	for(var i =0; i < Math.floor(w*2/50); i++){
		mapGrid[i] = [];
		for(var j =0; j < Math.floor(w*2/50); j++){
			mapGrid[i][j] = new tile(i,j);
		}
	}
	
	function resetMapGrid(){
		for(var i= 0; i < mapGrid.length; i++){
			for(var j =0; j < mapGrid[i].length; j++){
				//mapGrid[i][j].panels = []
				mapGrid[i][j].wall = false;
			}
		}
	}
	
	var brushes = []
	
	function Brush(i){
		this.row = []
		for(var a =0; a < i; a++){
			this.row[a] = []
			for(var b=0; b < i; b++){
				this.row[a][b] = dist(a,b, Math.floor(i/2), Math.floor(i/2));
				//if(this.row[a][b] > i / 2) this.row[a][b] = 100
			}
		
		}
	}
	
	var shimmer = 5;
	
	var lightGrid = []
	var lightRes = 15
	for(var i =0; i < Math.floor(w + lightRes*2); i++){
		lightGrid[Math.floor(i/lightRes)] = [];
		for(var j =0; j < Math.floor(h + lightRes*2); j++){
			lightGrid[Math.floor(i/lightRes)][Math.floor(j/lightRes)] = 0;
		}
	}
	
	
	var lightGridC = []
	for(var i =0; i < Math.floor(w + lightRes*2); i++){
		lightGridC[Math.floor(i/lightRes)] = [];
		for(var j =0; j < Math.floor(h + lightRes*2); j++){
			lightGridC[Math.floor(i/lightRes)][Math.floor(j/lightRes)] = new cTile(0,0,0);
		}
	}
	
	function cTile(red,green,blue){
		this.r = red
		this.g = green
		this.b = blue
		this.getCol = function(){
			var result = "#"
			this.r = Math.floor(this.r)
			this.g = Math.floor(this.g)
			this.b = Math.floor(this.b)
			if(this.r < 16) result += "0"
			result += this.r.toString(16).toUpperCase();
			
			if(this.g < 16) result += "0"
			result += this.g.toString(16).toUpperCase();
			
			if(this.b < 16) result += "0"
			result += this.b.toString(16).toUpperCase();
			
			return result;
		}
	}
	

	
	//Map editor stuff
	var snapSize = 10
	var selEdit = 1;
	var lastEdit = [];
	var PI = 0;
	var pX, pY;
	var header = "";
	var levelEdit = ""
	var lighting = false;
	var gridLines = true;
	
	
	function output(t){
		document.getElementById("output").value += t + "\n";
	}
	
	////////////////////////////////////
	//Sounds
	//////////////////////////////////
	var buttonSound1 = addSound('Sounds/metalButton.ogg', false);
	buttonSound1.setVolume(0.5);
	
	
	var heart1 = addSound('Sounds/heart1.ogg',false);
	var heart2 = addSound('Sounds/heart2.ogg',false);
	
	var heartDelay = 15;
	var heartTimer = 0;
	var hPump = true;
	
	function getHeartDelay(){
		var result = 15;
		
		//Basic Movement
		if(creature[cS].sx != 0) result -= 3;
	
		//Number of enemies
		for(var i=0; i < creature.length; i++){
			if(creature[i].stats.type != creature[cS].stats.type && creature[i].stats.health > 0) result -= 3;
		}
		
		//Player health
		if(creature[cS].stats.health < creature[cS].stats.MaxHealth * 0.25) result -= 2
	
		if(result < 4) result = 4;
		return result;
	}
	
	var backHum = addSound('Sounds/backHum.ogg',true);

	var doorSound = []
	for(var i=0; i < 5; i = i + 1)doorSound.push(addSound('Sounds/door.ogg', false));

	var pistolSound = []
	for(var i=0; i < 10; i = i + 1)pistolSound.push(addSound('Sounds/pistol1.ogg', false));
	var smgSound = []
	for(var i=0; i < 10; i = i + 1)smgSound.push(addSound('Sounds/smg1.ogg', false));
	var rifleSound = []
	for(var i=0; i < 10; i = i + 1){
		if(i%2 == 0) rifleSound.push(addSound('Sounds/rifle1.ogg', false));
		else rifleSound.push(addSound('Sounds/rifle2.ogg', false));
	}

	var alarmSound = []
	for(var i=0; i < 10; i = i + 1)alarmSound.push(addSound('Sounds/alarm1.ogg', true));

	
	var steamSound = []
	for(var i=0; i < 10; i = i + 1)steamSound.push(addSound('Sounds/steam1.ogg', false));

	var pulseLightSound = []
	for(var i=0; i < 15; i++)pulseLightSound.push(addSound('Sounds/pulseLight4.ogg', false));
	
	var florSound = []
	for(var i=0; i < 15; i++)florSound.push(addSound('Sounds/florLight.ogg', false));
	
	var spinSound = []
	for(var i=0; i < 15; i++)spinSound.push(addSound('Sounds/spinLight.ogg', false));
	
	
	
	var sparkSound = []
	for(var i=0; i < 10; i++)sparkSound.push(addSound('Sounds/sparks.ogg', false));
	
	var flickerSound = []
	for(var i=0; i < 15; i++)flickerSound.push(addSound('Sounds/flickerLight2.ogg', false));
	
	var insectDeathSound = []
	insectDeathSound.push(addSound("Sounds/deaths/insectDeath1.ogg",false))
	insectDeathSound.push(addSound("Sounds/deaths/insectDeath2.ogg",false))
	insectDeathSound.push(addSound("Sounds/deaths/insectDeath3.ogg",false))
	insectDeathSound.push(addSound("Sounds/deaths/insectDeath4.ogg",false))
	
	function playInsectDeathSound (a,b){
		var v = dist(creature[cS].x, creature[cS].y, a,b);
		
		if(v < 300){
			v = 1-(v / 300)
		for(var i=0; i < insectDeathSound.length; i++){
			if(insectDeathSound[i].soundVar.currentTime == 0) {
				insectDeathSound[i].setVolume(v);
				insectDeathSound[i].play()
				break;
			}
		}
		}
	
	}
	
	
	function stopSound(){
		for(var i=0; i < alarmSound.length; i++) alarmSound[i].stop();
		for(var i=0; i < doorSound.length; i++) doorSound[i].stop();
		for(var i=0; i < flickerSound.length; i++) flickerSound[i].stop();
		for(var i=0; i < steamSound.length; i++) steamSound[i].stop();
		for(var i=0; i < spinSound.length; i++) spinSound[i].stop();
		for(var i=0; i < florSound.length; i++) florSound[i].stop();
		for(var i=0; i < pulseLightSound.length; i++) pulseLightSound[i].stop();
		for(var i=0; i < sparkSound.length; i++) sparkSound[i].stop();
			//for(var i=0; i < Sound.length; i++) Sound[i].stop();
			
			
		
	}
	
	
	
	function getSound(arr){
		var result = -1;
		for(var i=0; i < arr.length; i++){
			if(!arr[i].claimed) return i;
		}
		return result;
	}
	
	
	var msg = new SpeechSynthesisUtterance();
	var voices = speechSynthesis.getVoices();
	msg.text = "Proceed."
	msg.lang = 'en-EN'
	
 //msg.voice = voices.filter(function(voice) { return voice.name == 'Google UK English Male'; })[0];
	//msg.voice = voices[6];
	// Note: some voices don't support altering params

	msg.volume = 0.3; // 0 to 1
	msg.rate = 1; // 0.1 to 10
	msg.pitch = 5; 

	msg.onend = function(){
		talking = false;
	}
	window.speechSynthesis.onvoiceschanged = function() {
    //window.speechSynthesis.getVoices();
    
	voices = window.speechSynthesis.getVoices();
	//voices[0].localService = true
	//voices[0].default = false
	
	msg.pitch = 8
	msg.rate = 0.5
	msg.volume = 0.1
	//msg.voice = voices.filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];
	/*msg.voice.localService = true;
	msg.voice.default = true
	for(var i=0;i < voices.length; i++){
		console.log(i + " " + voices[i].default + " " + voices[i].localService);
	}
	console.log(voices[10])*/
	
	
};
	//1 - Male direct voice
	//2- decnt computer female voice
	
	
	
	//////////////////////////////////
	//Images
	/////////////////////////////////
	var fanBlades= makePicture("Animations/Objects/Features/fanBlades.png");//blac siloette
	var fanFrame= makePicture("Animations/Objects/Features/fanFrame.png");//unlit
	var fanBlades2= makePicture("Animations/Objects/Features/fanBlades2.png");//no grate
	var fanFrame2= makePicture("Animations/Objects/Features/fanFrame2.png");//w grate
	var fanFrame3= makePicture("Animations/Objects/Features/fanFrame3.png");//black w grate
	
	
	var lampLit= makePicture("Animations/Objects/LampLit.png");
	var lampOut= makePicture("Animations/Objects/LampOut.png");
	
	var biglampLit= makePicture("Animations/Objects/Features/bigLampLit.png");
	var biglampOut= makePicture("Animations/Objects/Features/bigLampOut.png");
	
	var spinLightPic= makePicture("Animations/Objects/spinLight.png");
	
	var largeItem = [];
	
	var pipes = []
	pipes.push(makePicture("Animations/Objects/Features/Pipe1.png"));
	pipes.push(makePicture("Animations/Objects/Features/Pipe2.png"));
	pipes.push(makePicture("Animations/Objects/Features/Pipe3.png"));
	pipes.push(makePicture("Animations/Objects/Features/Pipe4.png"));
	pipes.push(makePicture("Animations/Objects/Features/Pipe5.png"));
	pipes.push(makePicture("Animations/Objects/Shadows/vPipe.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/1.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/2.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/3.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/4.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/5.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/6.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/1B.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/2B.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/3B.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/4B.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/5B.png"))
	pipes.push(makePicture("Animations/Objects/Shadows/6B.png"))
	
	var BloodSmear = [];
	BloodSmear.push(makePicture("Animations/Objects/Features/bs1.png"));
	BloodSmear.push(makePicture("Animations/Objects/Features/bs2.png"));
	BloodSmear.push(makePicture("Animations/Objects/Features/bs3.png"));
	
	var GreaseSmear = []
	GreaseSmear.push(makePicture("Animations/Objects/Features/gs1.png"));
	
	var crack = []
	crack.push(makePicture("Animations/Objects/Features/crack1.png"));
	crack.push(makePicture("Animations/Objects/Features/crack2.png"));
	crack.push(makePicture("Animations/Objects/Features/crack3.png"));
	
	var panelHall = [] 
	//panelHall.push(makePicture('Animations/Objects/WallPanel1.png'));
	//panelHall.push(makePicture('Animations/Objects/Features/panel4.png'));
	//panelHall.push(makePicture('Animations/Objects/Features/panel5.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelDense.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelOpen.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelHalf.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelFar.png'));

	panelHall.push(makePicture('Animations/Objects/Features/panelBio4.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelBio5.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelBio6.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelBio2.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelBio3.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelBio7.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelBio8.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelSquare.png'));
	panelHall.push(makePicture('Animations/Objects/Features/panelOcto1.png'));
	
	
	var panelHallClean = [] 
	//panelHallClean.push(makePicture('Animations/Objects/WallPanel1Clean.png'));
	//panelHallClean.push(makePicture('Animations/Objects/Features/panel2.png'));
	//panelHallClean.push(makePicture('Animations/Objects/Features/panel3.png'));
	
	var wallFeatures = [];
	wallFeatures.push(makePicture('Animations/Objects/Features/grate.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/grateLeft.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/grateRight.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/logo.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/sign1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/sign2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/sign3.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/Bloodsign1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/Bloodsign2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/wallTexture1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/wallTexture2.png'));
	wallFeatures.push(makePicture('Animations/Objects/WallPanelPipe.png'));
	wallFeatures.push(makePicture('Animations/Objects/WallPanelPipeNoGrate.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/Bloodsign3.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/bed1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/toilet.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/switch.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/tank1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/tank2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/tank3.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/tank4.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/tank5.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/terminal1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/bed2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/monitor2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/computer1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/computer2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/computer3.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/vent1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/trashCan.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/server.png'));//index 30
	wallFeatures.push(makePicture('Animations/Objects/Features/sneezeGuard.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/table.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/rails.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/sideBarRight.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/sideBarLeft.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/belt.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/beltOpenning.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/beltLegs.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/toolBack.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/tool1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/tool2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/drain.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/pipeEnd.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/locker1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/bunk1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/table2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/chair.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/chair2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/chair3.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/chair4.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/bed3.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/bed4.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/narrowTank1.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/narrowTank2.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/narrowTank3.png'));
	wallFeatures.push(makePicture('Animations/Objects/Features/narrowTank4.png'));
	
	var floor = [];
	floor.push(makePicture('Animations/Objects/floor1.png'));
	floor.push(makePicture('Animations/Objects/crateMed1.png'));
	floor.push(makePicture('Animations/Objects/crateSmall1.png'));
	floor.push(makePicture('Animations/Objects/floor2.png'));
	floor.push(makePicture('Animations/Objects/floor3.png'));
	floor.push(makePicture('Animations/Objects/floor1Wide.png'));
	floor.push(makePicture('Animations/Objects/ceiling1Wide.png'));
	floor.push(makePicture('Animations/Objects/floor3Wide.png'));
	floor.push(makePicture('Animations/Objects/floor4.png'));
	floor.push(makePicture('Animations/Objects/floor4wide.png'));
	floor.push(makePicture('Animations/Objects/Features/Bio/wallJoiner.png'));
	
	var doorFrame = makePicture('Animations/Objects/Features/hatch2.png')
	var doorHatch = makePicture('Animations/Objects/Features/hatch.png')
	var floorHole = [];
	floorHole.push(makePicture('Animations/Objects/Features/floor1Hole.png'));
	
	var crate = [];
	crate.push(makePicture('Animations/Objects/crateMed1.png'));
	
	var ceiling = []
	ceiling.push(makePicture('Animations/Objects/ceiling1.png'));
	
	var ceilingHole = [];
	ceilingHole.push(makePicture('Animations/Objects/Features/ceiling1Hole.png'));
	
	var vPipe = makePicture('Animations/Objects/VPipe.png')
	var hPipe = makePicture('Animations/Objects/HPipe.png')
	var TRPipe = makePicture('Animations/Objects/PipeTR.png')
	var TLPipe = makePicture('Animations/Objects/PipeTL.png')
	var BRPipe = makePicture('Animations/Objects/PipeBR.png')
	var BLPipe = makePicture('Animations/Objects/PipeBL.png')
		
	var foreGPic = [];
	foreGPic[0] = makePicture('Animations/Objects/Foreground/DeskLeft.png')
	foreGPic[1] = makePicture('Animations/Objects/Foreground/DeskRight.png')
	foreGPic[2] = makePicture('Animations/Objects/Foreground/MonitorOnRight.png')
	foreGPic[3] = makePicture('Animations/Objects/Foreground/MonitorOffRight.png')
	foreGPic[4] = makePicture('Animations/Objects/Foreground/MonitorOnLeft.png')
	foreGPic[5] = makePicture('Animations/Objects/Foreground/MonitorOffLeft.png')
	foreGPic.push(makePicture('Animations/Objects/sideWallDebris.png'));
	foreGPic.push(makePicture('Animations/Objects/sideWallDebris2.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/Med1.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/lamp.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/DeskCenter.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/miniTable.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/sideSeats.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/plantPot.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/plant1.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/plant2.png'));
	foreGPic.push(makePicture('Animations/Objects/Foreground/plant3.png'));
	foreGPic.push(makePicture('Animations/Objects/PosterArt/glass1.png'));
	foreGPic.push(makePicture('Animations/Objects/PosterArt/glass2.png'));
	foreGPic.push(makePicture('Animations/Objects/PosterArt/glass3.png'));
	foreGPic.push(makePicture('Animations/Objects/PosterArt/glass4.png'));
	foreGPic.push(makePicture('Animations/Objects/PosterArt/glass5.png'));
	foreGPic.push(makePicture('Animations/Objects/PosterArt/glass6.png'));
	foreGPic.push(makePicture('Animations/Objects/Features/bridge1.png'));
	foreGPic.push(makePicture('Animations/Objects/Features/bridge2.png'));
	foreGPic.push(makePicture('Animations/Objects/Features/bridge3.png'));
	foreGPic.push(makePicture('Animations/Objects/Features/bridge4.png'));
	foreGPic.push(makePicture('Animations/Objects/Features/bridge5.png'));
	foreGPic.push(makePicture('Animations/Objects/Features/monitorHuge.png'));
	var animators = [];
	animators.push({pic: makePicture('Animations/Objects/blood1.png'), name:"Blood Drip"});
	animators.push({pic: makePicture('Animations/Objects/waterDrip.png'), name:"Water W"});
	animators.push({pic: makePicture('Animations/Objects/waterDripLong.png'), name:"Water W Mid"});
	animators.push({pic: makePicture('Animations/Objects/waterDripDark.png'), name:"Water WD"});
	animators.push({pic: makePicture('Animations/Objects/waterDripLongDark.png'), name:"Water WD Mid"});
	animators.push({pic: makePicture('Animations/Objects/waterDripSplash.png'), name:"Water Wide Splash"});
	
	animators.push({pic: makePicture('Animations/Objects/waterPour.png'), name:"Water Stream Left"});
	animators.push({pic: makePicture('Animations/Objects/waterPour2.png'), name:"Water Stream Right"});
	animators.push({pic: makePicture('Animations/Objects/waterPourLong.png'), name:"Water Stream Mid"});
	animators.push({pic: makePicture('Animations/Objects/waterSplash.png'), name:"Water Stream Splash"});

	
	var animatorsNames = [];
	
	
	var bioPic = []
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b1.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b2.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b3.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b4.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b5.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b6.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b7.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/b8.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/w1.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/w2.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/w3.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/w4.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/w5.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/w6.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/w7.png'));
	bioPic.push(makePicture('Animations/People/body1.png'));
	bioPic.push(makePicture('Animations/People/body2.png'));
	bioPic.push(makePicture('Animations/People/body3.png'));
	bioPic.push(makePicture('Animations/People/body4.png'));
	bioPic.push(makePicture('Animations/People/body5.png'));
	bioPic.push(makePicture('Animations/People/body6.png'));
		bioPic.push(makePicture('Animations/Objects/Features/Bio/g1.png'));
		bioPic.push(makePicture('Animations/Objects/Features/Bio/bioPipeHA.png'));
		bioPic.push(makePicture('Animations/Objects/Features/Bio/bioPipeHB.png'));
		bioPic.push(makePicture('Animations/Objects/Features/Bio/bioPipeHC.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/bioPipeVA.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/bioPipeVB.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/bioPipeVC.png'));
	
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow1A.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow1B.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow2A.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow2B.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow3A.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow3B.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow4A.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/elbow4B.png'));
	
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioBigTile.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioBigTileV.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioBigTile2V.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/wallEyes1.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/wallEyes2.png'));
	
	bioPic.push(makePicture('Animations/Objects/Features/Bio/wallGeneral1.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/wallGeneral2.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/wallGeneral3.png'));
	bioPic.push(makePicture('Animations/Objects/Features/panelBio.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/joiner1.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/joiner2.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/joiner3.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/joiner4.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/joiner5.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioEdgeL.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioEdgeR.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/pipeFitV.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/bioBulkHead1.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/bioBulkHead2.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/FloorsLeftEdge.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/FloorsRightEdge.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioEdgeLT.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioEdgeRT.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioEdgeLB.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/BioEdgeRB.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/growth1.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/growth2.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/growth3.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/egg.png'));
	bioPic.push(makePicture('Animations/Objects/Features/Bio/eggHatch.png'));
	bioPic.push(makePicture('Animations/People/body7.png'));
	bioPic.push(makePicture('Animations/People/body8.png'));
	bioPic.push(makePicture('Animations/People/body9.png'));
	bioPic.push(makePicture('Animations/People/body10.png'));
	bioPic.push(makePicture('Animations/People/body11.png'));
	bioPic.push(makePicture('Animations/People/body12.png'));
	bioPic.push(makePicture('Animations/People/body13.png'));
	bioPic.push(makePicture('Animations/People/body14.png'));
	bioPic.push(makePicture('Animations/People/body15.png'));
	bioPic.push(makePicture('Animations/People/body16.png'));
	var posterArt = []
	posterArt.push(makePicture('Animations/Objects/PosterArt/art1.png'));
	posterArt.push(makePicture('Animations/Objects/PosterArt/art2.png'));
	posterArt.push(makePicture('Animations/Objects/PosterArt/art3.png'));
	posterArt.push(makePicture('Animations/Objects/PosterArt/art4.png'));
	posterArt.push(makePicture('Animations/Objects/PosterArt/art5.png'));
	posterArt.push(makePicture('Animations/Objects/PosterArt/art6.png'));
	posterArt.push(makePicture('Animations/Objects/PosterArt/art7.png'));
	
	var windowArt = []
	windowArt.push(makePicture('Animations/Objects/PosterArt/window1.png'));
	windowArt.push(makePicture('Animations/Objects/PosterArt/window2.png'));
	windowArt.push(makePicture('Animations/Objects/PosterArt/window3.png'));
	windowArt.push(makePicture('Animations/Objects/PosterArt/window4.png'));
	windowArt.push(makePicture('Animations/Objects/PosterArt/window5.png'));
	windowArt.push(makePicture('Animations/Objects/PosterArt/window6.png'));
	windowArt.push(makePicture('Animations/Objects/PosterArt/window7.png'));
	
	
	var sideWall = []
	sideWall.push(makePicture('Animations/Objects/sideWall1.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall2.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall3.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall4.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall5.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall6.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall7.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall1Tall.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall2Tall.png'));
	sideWall.push(makePicture('Animations/Objects/sideWall3Tall.png'));
	sideWall.push(makePicture('Animations/Objects/Features/Bio/bioSideWall.png'));
	
	
	
	var sideWallDebris = []
	//sideWallDebris.push(makePicture('Animations/Objects/sideWallDebris.png'));
	//sideWallDebris.push(makePicture('Animations/Objects/sideWallDebris2.png'));
	
	var door = []
	door.push(makePicture('Animations/Objects/Features/door.png'))
	door.push(makePicture('Animations/Objects/Features/door2.png'))
	/////////////////////////////
	////	WEAPON PICUTURES  & Data
	var rifleID = 2 
	var SMGID = 1
	var pistolID = 0
	
	var iconRifle = makePicture("Animations/Objects/Weapons/IconRifle.png");
	var iconSMG = makePicture("Animations/Objects/Weapons/IconSMG.png");
	var iconPistol = makePicture("Animations/Objects/Weapons/IconPistol.png");
	var blankPic = makePicture("Animations/Objects/Weapons/blank.png");
	var iconMed = makePicture("Animations/Objects/Items/medKit.png");
	var recorder = makePicture("Animations/Objects/Items/recorder.png");
	var iconArmor = makePicture("Animations/Objects/Items/armor.png");
	var HumanArmor = makePicture("Animations/People/HumanArmor.png");
	
	var riflePic = makePicture("Animations/Objects/Weapons/RIFLE.png");
	var rifleFlash = []
	rifleFlash.push(makePicture("Animations/Objects/Weapons/RIFLEFlash3.png"));
	rifleFlash.push(makePicture("Animations/Objects/Weapons/RIFLEFlash2.png"));
	rifleFlash.push(makePicture("Animations/Objects/Weapons/RIFLEFlash1.png"));
	
	var riflePicMarine = makePicture("Animations/Objects/Weapons/MarineRIFLE.png");
	var rifleFlashMarine = []
	rifleFlashMarine.push(makePicture("Animations/Objects/Weapons/MarineRIFLEFlash3.png"));
	rifleFlashMarine.push(makePicture("Animations/Objects/Weapons/MarineRIFLEFlash2.png"));
	rifleFlashMarine.push(makePicture("Animations/Objects/Weapons/MarineRIFLEFlash1.png"));
	
	var pistolPic = makePicture("Animations/Objects/Weapons/l0Pistol.png");
	var pistolFlash = [];
	pistolFlash.push(makePicture("Animations/Objects/Weapons/l0PistolFire2.png"));
	pistolFlash.push(makePicture("Animations/Objects/Weapons/l0PistolFire1.png"));
	
	var pistolPicMarine = makePicture("Animations/Objects/Weapons/MarinePistol.png");
	var pistolFlashMarine = [];
	pistolFlashMarine.push(makePicture("Animations/Objects/Weapons/MarinePistolFire2.png"));
	pistolFlashMarine.push(makePicture("Animations/Objects/Weapons/MarinePistolFire1.png"));
	
	
	var SMGPic = makePicture("Animations/Objects/Weapons/SMG.png");
	var SMGFlash = [];
	SMGFlash.push(makePicture("Animations/Objects/Weapons/SMGFlash2.png"));
	SMGFlash.push(makePicture("Animations/Objects/Weapons/SMGFlash1.png"));
	
	var SMGPicMarine = makePicture("Animations/Objects/Weapons/MarineSMG.png");
	var SMGFlashMarine = [];
	SMGFlashMarine.push(makePicture("Animations/Objects/Weapons/MarineSMGFlash2.png"));
	SMGFlashMarine.push(makePicture("Animations/Objects/Weapons/MarineSMGFlash1.png"));
	
	var iHealPic = [];
	iHealPic.push(makePicture("Animations/Objects/Weapons/iHealF6.png"))
	iHealPic.push(makePicture("Animations/Objects/Weapons/iHealF5.png"))
	iHealPic.push(makePicture("Animations/Objects/Weapons/iHealF4.png"))
	iHealPic.push(makePicture("Animations/Objects/Weapons/iHealF3.png"))
	iHealPic.push(makePicture("Animations/Objects/Weapons/iHealF2.png"))
	iHealPic.push(makePicture("Animations/Objects/Weapons/iHealF1.png"))
	var acidPic = []
	acidPic.push(makePicture("Animations/Objects/Weapons/acidSpray7.png"))
	acidPic.push(makePicture("Animations/Objects/Weapons/acidSpray6.png"))
	acidPic.push(makePicture("Animations/Objects/Weapons/acidSpray5.png"))
	acidPic.push(makePicture("Animations/Objects/Weapons/acidSpray4.png"))
	acidPic.push(makePicture("Animations/Objects/Weapons/acidSpray3.png"))
	acidPic.push(makePicture("Animations/Objects/Weapons/acidSpray2.png"))
	acidPic.push(makePicture("Animations/Objects/Weapons/acidSpray1.png"))
	var mHeadPics = []
	mHeadPics.push(makePicture("Animations/Objects/Weapons/MaggotHead.png"))
	mHeadPics.push(makePicture("Animations/Objects/Weapons/MaggotHead2.png"))
	mHeadPics.push(makePicture("Animations/Objects/Weapons/MaggotHead1.png"))
	
	var marinePunchPics = []
	marinePunchPics.push(makePicture("Animations/Objects/Weapons/MarinePunch1.png"))
	marinePunchPics.push(makePicture("Animations/Objects/Weapons/MarinePunch2.png"))
	marinePunchPics.push(makePicture("Animations/Objects/Weapons/MarinePunch3.png"))
	marinePunchPics.push(makePicture("Animations/Objects/Weapons/MarinePunch4.png"))
	
	var sciPunchPics = []
	sciPunchPics.push(makePicture("Animations/Objects/Weapons/sciSaw1.png"))
	sciPunchPics.push(makePicture("Animations/Objects/Weapons/sciSaw2.png"))
	
	var sciHammerPics = []
	sciHammerPics.push(makePicture("Animations/Objects/Weapons/sledge1.png"))
	sciHammerPics.push(makePicture("Animations/Objects/Weapons/sledge2.png"))
	sciHammerPics.push(makePicture("Animations/Objects/Weapons/sledge3.png"))
	sciHammerPics.push(makePicture("Animations/Objects/Weapons/sledge4.png"))
	sciHammerPics.push(makePicture("Animations/Objects/Weapons/sledge5.png"))
	
	var mPunchPics = []
	mPunchPics.push(makePicture("Animations/Objects/Weapons/Monster1Punch1.png"))
	mPunchPics.push(makePicture("Animations/Objects/Weapons/Monster1Punch2.png"))
	mPunchPics.push(makePicture("Animations/Objects/Weapons/Monster1Punch3.png"))
	var mPunchPics2 = []
	mPunchPics2.push(makePicture("Animations/Objects/Weapons/Monster2Punch1.png"))
	mPunchPics2.push(makePicture("Animations/Objects/Weapons/Monster2Punch2.png"))
	mPunchPics2.push(makePicture("Animations/Objects/Weapons/Monster2Punch3.png"))
	mPunchPics2.push(makePicture("Animations/Objects/Weapons/Monster2Punch4.png"))
	var punchPics = [];
	punchPics.push(makePicture("Animations/Objects/Weapons/l0Melee.png"))
	punchPics.push(makePicture("Animations/Objects/Weapons/l0Melee1.png"))
	punchPics.push(makePicture("Animations/Objects/Weapons/l0Melee2.png"))
	punchPics.push(makePicture("Animations/Objects/Weapons/l0Melee3.png"))
	var punchInsectPics = [];
	punchInsectPics.push(makePicture("Animations/Objects/Weapons/l4Melee.png"))
	punchInsectPics.push(makePicture("Animations/Objects/Weapons/l4Melee1.png"))
	punchInsectPics.push(makePicture("Animations/Objects/Weapons/l4Melee2.png"))
	punchInsectPics.push(makePicture("Animations/Objects/Weapons/l4Melee3.png"))
	
	
	
	//Character Images
	
	
	
	var ReptileWing = [];
	ReptileWing.push(makePicture('Animations/People/R3Wing.png'));
	
	var ReptileTorso = [];
	ReptileTorso.push(makePicture('Animations/People/R0Torso.png'));
	ReptileTorso.push(makePicture('Animations/People/R1Torso.png'));
	ReptileTorso.push(makePicture('Animations/People/R2Torso.png'));
	ReptileTorso.push(makePicture('Animations/People/R3Torso.png'));
	
	var ReptileLeg = [];
	ReptileLeg.push(makePicture('Animations/People/R0Legs.png'));
	ReptileLeg.push(makePicture('Animations/People/R1Legs.png'));
	ReptileLeg.push(makePicture('Animations/People/R1BLegs.png'));
	ReptileLeg.push(makePicture('Animations/People/R2Legs.png'));
	ReptileLeg.push(makePicture('Animations/People/R3Legs.png'));
	ReptileLeg.push(makePicture('Animations/People/R4Legs.png'));
		ReptileLeg.push(makePicture('Animations/People/R5Legs.png'));
	
	var ReptileHair =[] 
	ReptileHair.push(makePicture('Animations/People/I0Hair.png'));
	ReptileHair.push(makePicture('Animations/People/Hair2.png'));
	ReptileHair.push(makePicture('Animations/People/RHair.png'));
	ReptileHair.push(makePicture('Animations/People/RHair.png'));
	
	var InsectTorso = [];
	InsectTorso.push(makePicture('Animations/People/I0Torso.png'));
	InsectTorso.push(makePicture('Animations/People/I1Torso.png'));
	InsectTorso.push(makePicture('Animations/People/I2Torso.png'));
	InsectTorso.push(makePicture('Animations/People/I3Torso.png'));
	InsectTorso.push(makePicture('Animations/People/I4Torso.png'));
	
		
	InsectTorso.push(makePicture('Animations/People/MaggotTorso.png'));
	InsectTorso.push(makePicture('Animations/People/Bug1Torso.png'));
	InsectTorso.push(makePicture('Animations/People/SmallBugTorso.png'));
	
	
	var InsectWing = [];
	InsectWing.push(makePicture('Animations/People/InsectWing.png'));
	
	var wormHead = []
	wormHead.push(makePicture('Animations/People/wormHead.png'))
	wormHead.push(makePicture('Animations/People/wormHead2.png'))
	wormHead.push(makePicture('Animations/People/wormHead3.png'))
	wormHead.push(makePicture('Animations/People/wormHead2.png'))
	wormHead.push(makePicture('Animations/People/wormHeadDead.png'))
	wormHead.push(makePicture('Animations/People/wormHeadDead2.png'))
	wormHead.push(makePicture('Animations/People/wormHeadDead3.png'))
	
	var wormBody = []
	wormBody.push(makePicture('Animations/People/wormBody3.png'))
	wormBody.push(makePicture('Animations/People/wormBody.png'))
	wormBody.push(makePicture('Animations/People/wormBody2.png'))
	wormBody.push(makePicture('Animations/People/wormBody.png'))
	
	var eggBase = makePicture('Animations/People/eggBase.png')
	
	var eggBody = []
	eggBody.push(makePicture('Animations/People/eggBody3.png'))
	eggBody.push(makePicture('Animations/People/eggBody1.png'))
	eggBody.push(makePicture('Animations/People/eggBody2.png'))
	eggBody.push(makePicture('Animations/People/eggBody1.png'))
	
	var eggHead = []
	eggHead.push(makePicture('Animations/People/eggHead2.png'))
	eggHead.push(makePicture('Animations/People/eggHead3.png'))
	eggHead.push(makePicture('Animations/People/eggHead4.png'))
	eggHead.push(makePicture('Animations/People/eggHead5.png'))
	eggHead.push(makePicture('Animations/People/eggHeadDead1.png'))
	eggHead.push(makePicture('Animations/People/eggHeadDead2.png'))
	eggHead.push(makePicture('Animations/People/eggHeadDead3.png'))
	
	var egg = makePicture('Animations/Objects/Features/Bio/egg.png')
	var eggHatch = makePicture('Animations/Objects/Features/Bio/eggHatch.png')
		
	var InsectLeg = [];
	InsectLeg.push(makePicture('Animations/People/I0Legs.png'));
	InsectLeg.push(makePicture('Animations/People/I1Legs.png'));
	InsectLeg.push(makePicture('Animations/People/I2Legs.png'));
	InsectLeg.push(makePicture('Animations/People/I3Legs.png'));
	InsectLeg.push(makePicture('Animations/People/I4Legs.png'));
	InsectLeg.push(makePicture('Animations/People/SmallBugLegs.png'));
	InsectLeg.push(makePicture('Animations/People/SmallBugLegs2.png'));
	var hair = []
	/*hair.push(makePicture('Animations/People/I0Hair.png'));
	hair.push(makePicture('Animations/People/I1Hair.png'));
	hair.push(makePicture('Animations/People/I2Hair.png'));
	hair.push(makePicture('Animations/People/I3Hair.png'));
	*/
	hair.push(blankPic);
	hair.push(makePicture('Animations/People/Hair1.png'));
	hair.push(makePicture('Animations/People/Hair2.png'));
	hair.push(makePicture('Animations/People/Hair3.png'));
	hair.push(makePicture('Animations/People/Hair4.png'));
	hair.push(makePicture('Animations/People/Hair5.png'));
	hair.push(makePicture('Animations/People/Hair6.png'));
	hair.push(makePicture("Animations/People/MarineHelmet.png"));
	hair.push(makePicture("Animations/People/Hair7Hazmat.png"));
	
	
	
	var leftArm = []
	leftArm.push(makePicture('Animations/People/I0LeftArm.png'));
	leftArm.push(makePicture('Animations/People/MarineLeftArm.png'));
	var InsectAb = []
	InsectAb.push(makePicture('Animations/People/IAbdomen.png'));
	InsectAb.push(makePicture('Animations/People/IAbdomen.png'));
	InsectAb.push(makePicture('Animations/People/IAbdomen2.png'));
	
	
	
	var HumanTorso = [];
	HumanTorso.push(makePicture("Animations/People/MarineTorso1.png"));
	HumanTorso.push(makePicture("Animations/People/MarineTorso2.png"));
	HumanTorso.push(makePicture("Animations/People/MarineTorso3.png"));
	HumanTorso.push(makePicture("Animations/People/MarineTorso4.png"));
	HumanTorso.push(makePicture("Animations/People/ScientistTorso1.png"));//Male
	HumanTorso.push(makePicture("Animations/People/ScientistTorso2.png"));//Female
	HumanTorso.push(makePicture("Animations/People/ScientistTorso3.png"));//Female
	HumanTorso.push(makePicture("Animations/People/ScientistTorso4.png"));//Female w Helmet

	var HumanLeg = [];
	HumanLeg.push(makePicture("Animations/People/MarineLegs1.png"));
	HumanLeg.push(makePicture("Animations/People/ScientistLegs1.png"));
	HumanLeg.push(makePicture("Animations/People/ScientistLegs2.png"));
	HumanLeg.push(makePicture("Animations/People/ScientistLegs3.png"));
	HumanLeg.push(makePicture("Animations/People/MarineLegs2.png"));
	HumanLeg.push(makePicture("Animations/People/MarineLegs3.png"));
	HumanLeg.push(makePicture("Animations/People/MarineLegs4.png"));
	
	/////////////////
	///	Character portraits
	var mask = []
	mask.push(makePicture('Faces/Human/sMask.png'));
	
	var goggles = []
	goggles.push(makePicture('Faces/Human/goggles.png'));
	
	var portHair = []
	portHair.push(blankPic);
	portHair.push(makePicture('Faces/Human/hair1.png'));
	portHair.push(makePicture('Faces/Human/hair2.png'));
	portHair.push(makePicture('Faces/Human/hair3.png'));
	portHair.push(makePicture('Faces/Human/hair4.png'));
	portHair.push(makePicture('Faces/Human/hair5.png'));
	portHair.push(makePicture('Faces/Human/hair6.png'));
	portHair.push(makePicture('Faces/Human/hair7.png'));
	portHair.push(makePicture('Faces/Human/hair8.png'));
	
	var fBase = makePicture('Faces/Human/base.png')
	var mBase = makePicture('Faces/Human/mbase.png')
	var bugFace = makePicture('Faces/Insect/bugFace.png')
	var maggotFace = makePicture('Faces/Insect/maggotFace.png')
	
	var marineFace = makePicture('Faces/Human/marine.png')
	var marineBase = makePicture('Faces/Human/MarineBase.png')
	var doctorClothes = makePicture('Faces/Human/sciClothes.png')
	
	var portNoses = []
	portNoses.push(makePicture('Faces/Human/nose1.png'));
	portNoses.push(makePicture('Faces/Human/nose2.png'));
	portNoses.push(makePicture('Faces/Human/nose3.png'));
	portNoses.push(makePicture('Faces/Human/nose4.png'));
	portNoses.push(makePicture('Faces/Human/nose5.png'));
	portNoses.push(makePicture('Faces/Human/nose6.png'));
	portNoses.push(makePicture('Faces/Human/nose7.png'));
	
	var portEyes = []
	portEyes.push(makePicture('Faces/Human/eyes1.png'));
	portEyes.push(makePicture('Faces/Human/eyes2.png'));
	portEyes.push(makePicture('Faces/Human/eyes3.png'));
	portEyes.push(makePicture('Faces/Human/eyes4.png'));
	portEyes.push(makePicture('Faces/Human/eyes5.png'));
	
	var portMouth = []
	portMouth.push(makePicture('Faces/Human/mouth1.png'));
	portMouth.push(makePicture('Faces/Human/mouth2.png'));
	portMouth.push(makePicture('Faces/Human/mouth3.png'));
	portMouth.push(makePicture('Faces/Human/mouth4.png'));
	portMouth.push(makePicture('Faces/Insect/mouth1.png'));
	
	var portEyeBrow = []
	portEyeBrow.push(makePicture('Faces/Human/eyebrow1.png'));
	portEyeBrow.push(makePicture('Faces/Human/eyebrow2.png'));
	portEyeBrow.push(makePicture('Faces/Human/eyebrow0.png'));
	//portNoses.push(makePicture('Faces/Human/nose3.png'));
	
	
	var portBarcode = []
	portBarcode.push(makePicture('Faces/Human/barcode1.png'));
	portBarcode.push(makePicture('Faces/Human/barcode2.png'));
	portBarcode.push(makePicture('Faces/Human/barcode3.png'));
	portBarcode.push(makePicture('Faces/Human/barcode4.png'));
	
	var portInsectEyes = [];
	portInsectEyes.push(makePicture('Faces/Insect/eyes.png'));
	portInsectEyes.push(makePicture('Faces/Insect/eyes2.png'));
	portInsectEyes.push(makePicture('Faces/Insect/eyes3.png'));
	
	var portReptileEyes = [];
	portReptileEyes.push(makePicture('Faces/Reptile/eyes.png'));
	portReptileEyes.push(makePicture('Faces/Reptile/eyes2.png'));
	portReptileEyes.push(makePicture('Faces/Reptile/eyes3.png'));
	
	var portReptile = [];
	portReptile.push(makePicture('Faces/Reptile/level1.png'));
	portReptile.push(makePicture('Faces/Reptile/level2.png'));
	portReptile.push(makePicture('Faces/Reptile/level3.png'));
	
	var portInsect = [];
	portInsect.push(makePicture('Faces/Insect/level1.png'));
	portInsect.push(makePicture('Faces/Insect/level2.png'));
	portInsect.push(makePicture('Faces/Insect/level3.png'));
	
	
	
	//Buttons
var lighter = new Button(70, 10, 50,30, "Lights");
	lighter.job = function() {lighting = !lighting;}
	
		var OKButton = new ButtonGraphic(w/2 - 100, h/2 + 150, 200, 100, "OK");
	OKButton.job = function(){
		buttonSound1.play();
		promptIndex++
		promptAni = 0;
		promptScroll = 0
		aniFast = 0;
		if(promptIndex >= promptMessage.length){
		//Reached the end of the messages
			promptIndex = -1
			promptScroll = 0
			promptMessage = []
			promptTitle = []
			promptCreature = [];
			prompting = false;
		}
	}
	
	//MAin menu
	var mainMenuLevel = new Level("Main Menu");
	mainMenuLevel.wallPanels.push(new Panel(400,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(300,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(200,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(100,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(500,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(600,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(700,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(800,100, panelHall[1], 0,0.5));
	mainMenuLevel.wallPanels.push(new Panel(400,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new Panel(300,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new Panel(200,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new Panel(100,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new Panel(500,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new Panel(600,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new Panel(700,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new Panel(800,0, panelHall[1], 1,0.5));
	mainMenuLevel.wallPanels.push(new wordWall(260,80, 'PROJECT',40));mainMenuLevel.wallPanels.push(new wordWall(270,180, '6TH DAY',40));
mainMenuLevel.lamps.push(new BigLamp(410,0));
mainMenuLevel.lamps.push(new BigLamp(510,0));
mainMenuLevel.lamps.push(new FlickerLamp(240,10));
mainMenuLevel.lamps.push(new FlickerLamp(750,10));
mainMenuLevel.wall.push(createWall(200,-10, 100,50,ceiling[0]));
mainMenuLevel.wall.push(createWall(300,-10, 100,50,ceiling[0]));mainMenuLevel.wall.push(createWall(600,-10, 100,50,ceiling[0]));
mainMenuLevel.wall.push(createWall(700,-10, 100,50,ceiling[0]));
mainMenuLevel.wall.push(createWall(400,-10, 100,30,floor[3]));
mainMenuLevel.wall.push(createWall(500,-10, 100,30,floor[3]));
mainMenuLevel.wall.push(createWall(800,-10, 100,30,floor[3]));
mainMenuLevel.wall.push(createWall(100,-10, 100,30,floor[3]));
mainMenuLevel.wall.push(createWall(70,0, 30,100,sideWall[2]));
mainMenuLevel.wall.push(createWall(70,100, 30,100,sideWall[2]));
mainMenuLevel.wall.push(createWall(900,100, 30,100,sideWall[2]));
mainMenuLevel.wall.push(createWall(900,0, 30,100,sideWall[2]));
mainMenuLevel.wall.push(createWall(70,-10, 30,100,sideWall[5]));
mainMenuLevel.wall.push(createWall(900,-10, 30,100,sideWall[5]));
mainMenuLevel.wallPanels.push(new Panel(300,200, panelHall[2], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(300,300, panelHall[2], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(300,400, panelHall[2], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(600,200, panelHall[2], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(600,300, panelHall[2], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(600,400, panelHall[2], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(600,500, panelHall[2], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(300,500, panelHall[2], 0,0.5));mainMenuLevel.wallPanels.push(new ForeGround(300,300, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(600,300, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(300,400, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(600,400, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(600,500, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(300,500, wallFeatures[12]));mainMenuLevel.wall.push(createWall(200,200, 100,50,ceiling[0]));
mainMenuLevel.wall.push(createWall(700,200, 100,50,ceiling[0]));
mainMenuLevel.wall.push(createWall(100,200, 100,30,floor[3]));
mainMenuLevel.wall.push(createWall(800,200, 100,30,floor[3]));
mainMenuLevel.wall.push(createWall(70,190, 30,100,sideWall[5]));
mainMenuLevel.wall.push(createWall(900,190, 30,100,sideWall[5]));
mainMenuLevel.wallPanels.push(new ForeGround(100,0, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(800,0, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(800,100, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(100,100, wallFeatures[12]));
mainMenuLevel.wallPanels.push(new ForeGround(100,200, pipes[3]));
mainMenuLevel.wallPanels.push(new ForeGround(300,200, pipes[1]));
mainMenuLevel.wallPanels.push(new ForeGround(800,200, pipes[2]));
mainMenuLevel.wallPanels.push(new ForeGround(600,200, pipes[0]));
mainMenuLevel.wallPanels.push(new ForeGround(700,200, pipes[4]));
mainMenuLevel.wallPanels.push(new ForeGround(200,200, pipes[4]));
mainMenuLevel.lamps.push(new pulseLight(150,0));
mainMenuLevel.lamps[4].addPLight(150, 50);
mainMenuLevel.lamps[4].addPLight(150, 100);
mainMenuLevel.lamps[4].addPLight(150, 150);
mainMenuLevel.lamps[4].addPLight(150, 200);
mainMenuLevel.lamps[4].addPLight(150, 250);
mainMenuLevel.lamps[4].addPLight(200, 250);
mainMenuLevel.lamps[4].addPLight(250, 250);
mainMenuLevel.lamps[4].addPLight(300, 250);
mainMenuLevel.lamps[4].addPLight(350, 250);
mainMenuLevel.lamps[4].addPLight(350, 300);
mainMenuLevel.lamps[4].addPLight(350, 350);
mainMenuLevel.lamps[4].addPLight(350, 400);
mainMenuLevel.lamps[4].addPLight(350, 450);
mainMenuLevel.lamps[4].addPLight(350, 500);
mainMenuLevel.lamps[4].addPLight(350, 500);
mainMenuLevel.lamps[4].addPLight(350, 550);
mainMenuLevel.lamps[4].addPLight(350, 600);

mainMenuLevel.lamps.push(new pulseLight(850,0));
mainMenuLevel.lamps[5].addPLight(850, 50);
mainMenuLevel.lamps[5].addPLight(850, 100);
mainMenuLevel.lamps[5].addPLight(850, 150);
mainMenuLevel.lamps[5].addPLight(850, 200);
mainMenuLevel.lamps[5].addPLight(850, 250);
mainMenuLevel.lamps[5].addPLight(800, 250);
mainMenuLevel.lamps[5].addPLight(750, 250);
mainMenuLevel.lamps[5].addPLight(700, 250);
mainMenuLevel.lamps[5].addPLight(650, 250);
mainMenuLevel.lamps[5].addPLight(650, 300);
mainMenuLevel.lamps[5].addPLight(650, 350);
mainMenuLevel.lamps[5].addPLight(650, 400);
mainMenuLevel.lamps[5].addPLight(650, 450);
mainMenuLevel.lamps[5].addPLight(650, 500);
mainMenuLevel.lamps[5].addPLight(650, 550);
mainMenuLevel.lamps[5].addPLight(650, 600);

mainMenuLevel.wallPanels.push(new Panel(200,500, panelHall[0], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(100,500, panelHall[0], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(700,500, panelHall[0], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(800,500, panelHall[0], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(100,400, panelHall[1], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(200,400, panelHall[1], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(700,400, panelHall[1], 0,0.5));
mainMenuLevel.wallPanels.push(new Panel(800,400, panelHall[1], 0,0.5));
mainMenuLevel.wallPanels.push(new ForeGround(100,400, wallFeatures[19]));
mainMenuLevel.wallPanels.push(new ForeGround(700,400, wallFeatures[20]));
mainMenuLevel.rLights.push(new staticLight(120,570, 20));
mainMenuLevel.rLights.push(new staticLight(180,570, 20));
mainMenuLevel.rLights.push(new staticLight(220,570, 20));
mainMenuLevel.rLights.push(new staticLight(280,570, 20));
mainMenuLevel.rLights.push(new staticLight(720,570, 20));
mainMenuLevel.rLights.push(new staticLight(780,570, 20));
mainMenuLevel.rLights.push(new staticLight(820,570, 20));
mainMenuLevel.rLights.push(new staticLight(880,570, 20));

mainMenuLevel.wallPanels.push(new ForeGround(100,300, pipes[0]));
mainMenuLevel.wallPanels.push(new ForeGround(800,300, pipes[1]));
mainMenuLevel.wallPanels.push(new ForeGround(700,300, pipes[4]));
mainMenuLevel.wallPanels.push(new ForeGround(200,300, pipes[4]));
mainMenuLevel.wallPanels.push(new ForeGround(20,300, wallFeatures[2]));
mainMenuLevel.wallPanels.push(new ForeGround(20,210, wallFeatures[2]));
mainMenuLevel.wallPanels.push(new ForeGround(880,300, wallFeatures[1]));
mainMenuLevel.wallPanels.push(new ForeGround(880,200, wallFeatures[1]));
mainMenuLevel.wallPanels.push(new wordWall(750,560, 'BY ADAM GUZY',5));

	
	function loadMainMenu(){
		levelName = mainMenuLevel.name
		elevators = mainMenuLevel.elevators
		exits = mainMenuLevel.exits
	
		wall = mainMenuLevel.wall;
		for(var i =0; i < elevators.length; i++) elevators[i].initialize();
		rLights = mainMenuLevel.rLights;
		pulseLights = mainMenuLevel.pulseLights
		dLights = mainMenuLevel.dLights;
		lamps = mainMenuLevel.lamps
		wallPanels = mainMenuLevel.wallPanels
		creature = mainMenuLevel.creature
		items = mainMenuLevel.items
		foreGround = mainMenuLevel.foreGround
	}
	
	
	
	var mainMenuButtons = [];
	mainMenuButtons.push(new ButtonGraphic(w/2-100,200, 200,100,"New Game"));
	mainMenuButtons.push(new ButtonGraphic(w/2-100,500, 200,100,"Map Editor"));
	mainMenuButtons.push(new ButtonGraphic(w/2-100,300, 200,100,"UPDATES"));
	mainMenuButtons.push(new ButtonGraphic(w/2-100,400, 200,100,"Credits"));
	
	mainMenuButtons[0].job = function(){
		buttonSound1.play();
		backHum.play();
		screen = 4;
		cutscene[0].load();
		stopSound();
	}
	
	mainMenuButtons[1].job = function(){
		screen = 6;
		buttonSound1.play();
		var ind = -1;
		var levelList = ""
		for(var i=0; i < level.length; i++){
			if(level[i] != null){
				levelList+= i + "- " + level[i].name
			}else{
				levelList += i + "- Unused."
			}
			levelList+= " \r\n "
		}

		var choice = prompt("Level (L) or Cutscene (C)? or MainMenu? (M)", "C")
		
		if(choice == "L"){
		//level selected
			while(ind < 0)ind = Number(prompt(levelList + "\n Level Index?",""))
			if(ind >= level.length){
				var temp = prompt("Level Name?", "Title");
				//level.push(new Level(temp));
				//loadLevel(level.length-1);
				//output("level.push(new Level('" + temp + "'))")
				level[ind] = new Level(temp)
				loadLevel(ind);
				output("level[" + ind + "] = new Level('" + temp + "')")
			}else{
				loadLevel(ind);
				cLevel = ind;
			}
			header = "level[" + ind + "]."
			levelEdit = true;
			//output(header)
		}else if(choice == 'M'){
			header = "mainMenuLevel."
			levelEdit = true;
			loadMainMenu()
			
		}else{
		//cutscene selected
			while(ind < 0) ind = Number(prompt("Cutscene Index?","" + cutscene.length))
			if(ind >= cutscene.length){
				var temp = prompt("New Cutscene", "Title")
				cutscene.push(new Cutscene(temp));
				cutscene[cutscene.length-1].load();
				scene = cutscene.length-1
				output("cutscene.push(new Cutscene('" + temp + "'))");
			}else{
				cutscene[ind].load();
				scene = ind;
			}
			levelEdit = false;
			header = "cutscene[" + ind + "].lev."
		}
	}
	
	mainMenuButtons[2].job = function(){
		buttonSound1.play();
		//makePrompt("Not done yet", "Sorry this feature is still super TBA. ~~Try again in 6 - 8 months.")
		
		makePrompt("UPDATES", notes);
		};
	
	mainMenuButtons[3].job = function(){
		buttonSound1.play();
		makePrompt("CREDITS","Game Design & Development~     Adam 'The Programmer' Guzy ~~Sound Effects & Music~     James Paugh ~~Level Design~     Adam Guzy~     Connor Smiley~     Jaeden MacIsaac ~~~Special Thanks to all my dedicated and free testers!  You know who you are!");
		};
	
	
	
	//Editor options (based on images)
	
	//config button
	var scrollSpeed = 250
	var config = new Button(10, 10, 50,30, "CONFIG");
	var gridToggle = new Button(130,10,50,30, "GRID");
	gridToggle.job = function (){gridLines = !gridLines};
	
	var loadEdit = new Button(190, 10, 50,30, "LOAD");
	loadEdit.job = mainMenuButtons[1].job;
	
	
	var leftSlide = new Button(0, h - 145, 24,20, "<<");
	leftSlide.job = function(){
		if(selEdit == 1){
			for(var i=0; i < bgOptions.length; i++)	bgOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 2){
			for(var i=0; i < wOptions.length; i++)	wOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 3){
			for(var i=0; i < lOptions.length; i++)	iOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 4){
			for(var i=0; i < iOptions.length; i++)	iOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 5){
			for(var i=0; i < fOptions.length; i++)	fOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 6){
			for(var i=0; i < cOptions.length; i++)	cOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 7){
			for(var i=0; i < sOptions.length; i++)	sOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 8){
			for(var i=0; i < bOptions.length; i++)	bOptions[i].b.x -= scrollSpeed
		}else if (selEdit == 9){
			for(var i=0; i < aOptions.length; i++)	aOptions[i].b.x -= scrollSpeed
		}
	}
	var rightSlide = new Button(25, h - 145, 24,20, ">>");
	rightSlide.job = function(){
		if(selEdit == 1){
			for(var i=0; i < bgOptions.length; i++)	bgOptions[i].b.x += scrollSpeed
		}else if (selEdit == 2){
			for(var i=0; i < wOptions.length; i++)	wOptions[i].b.x += scrollSpeed
		}else if (selEdit == 3){
			for(var i=0; i < lOptions.length; i++)	iOptions[i].b.x += scrollSpeed
		}else if (selEdit == 4){
			for(var i=0; i < iOptions.length; i++)	iOptions[i].b.x += scrollSpeed
		}else if (selEdit == 5){
			for(var i=0; i < fOptions.length; i++)	fOptions[i].b.x += scrollSpeed
		}else if (selEdit == 6){
			for(var i=0; i < cOptions.length; i++)	cOptions[i].b.x += scrollSpeed
		}else if (selEdit == 7){
			for(var i=0; i < sOptions.length; i++)	sOptions[i].b.x += scrollSpeed
		}else if (selEdit == 8){
			for(var i=0; i < bOptions.length; i++)	bOptions[i].b.x += scrollSpeed
		}else if (selEdit == 9){
			for(var i=0; i < aOptions.length; i++)	aOptions[i].b.x += scrollSpeed
		}
	}
	var fOptions = []
	var pOptions = [];
	var bgOptions = [];
	var cOptions = [];
	//Background wall panels
	for(var i=0; i < panelHall.length; i++) {
		bgOptions.push(new editOption(100 + i * 60, h - 100, panelHall[i]));
		bgOptions[bgOptions.length-1].imageText = "panelHall[" + i + "]"
		bgOptions[bgOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new Panel(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", " + this.spec + "," + this.spec2 + "));"
			wallPanels.push(new Panel( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic, this.spec, this.spec2))
		
			lastEdit.push(4)
		}
		bgOptions[bgOptions.length-1].spec = 0 //top1, bottom2
		bgOptions[bgOptions.length-1].spec2 = 0.5; //Cleanliness
		bgOptions[bgOptions.length-1].config = function(){
			this.spec = prompt("Top (T) Bottom (B) else regular (any key)", "");
			if(this.spec == "T") this.spec = 1
			else if(this.spec == "B") this.spec = 2
			else this.spec = 0
			this.spec2 = Number(prompt("How clean and dank?  0 - very dank, 1 - very clean, 0.5 - No effect", ""));
		}
	
	}
	
		bgOptions.push(new editOption(100 + i * 60, h - 100, null));
		bgOptions[bgOptions.length-1].imageText = "ceiling[0]"
		bgOptions[bgOptions.length-1].name = "Elevator"
		bgOptions[bgOptions.length-1].insert = function(){
			this.text = "elevators.push(new elevator(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.spec + "," + this.spec2 + "));" + header+"wall.push(createWall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", 100,30," + this.imageText + "));"
			elevators.push(new elevator( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
			//wall.push(createWall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,100,30,ceiling[0]))
			elevators[elevators.length-1].initialize();
			lastEdit.push(9)
		}
		bgOptions[bgOptions.length-1].spec = 0 //position
		bgOptions[bgOptions.length-1].spec2 = 100; //max height
		bgOptions[bgOptions.length-1].config = function(){
			this.spec = Number (prompt("initial position? 0= bottom units in pixels", ""));
			this.spec2 = Number(prompt("max height? 100 , 200, etc", ""));
		}
	
	bgOptions.push(new editOption(100 + i * 60, h - 100, null));
		bgOptions[bgOptions.length-1].imageText = "ceiling[0]"
		bgOptions[bgOptions.length-1].name = "W Elev"
		bgOptions[bgOptions.length-1].insert = function(){
			this.text = "elevators.push(new CargoElevator(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.spec + "," + this.spec2 + "));"
			elevators.push(new CargoElevator( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
			elevators[elevators.length-1].initialize();
			lastEdit.push(9)
		}
		bgOptions[bgOptions.length-1].spec = 0 //position
		bgOptions[bgOptions.length-1].spec2 = 100; //max height
		bgOptions[bgOptions.length-1].config = function(){
			this.spec = Number (prompt("Initial position? 0= bottom units in pixels", ""));
			this.spec2 = Number(prompt("Max height? 100 , 200, etc", ""));
		}
		
		
		bgOptions.push(new editOption(100 + i * 60, h - 100, null));
		bgOptions[bgOptions.length-1].imageText = "ceiling[0]"
		bgOptions[bgOptions.length-1].name = "Stairs"
		bgOptions[bgOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new Stair(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.spec + "," + this.spec2 + "));"
			wallPanels.push(new Stair( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
			
			lastEdit.push(4)
		}
		bgOptions[bgOptions.length-1].spec = 'right' //position
		bgOptions[bgOptions.length-1].spec2 = 100; //max height
		bgOptions[bgOptions.length-1].config = function(){
			this.spec = (prompt("Direction?  left or right", "left"));
			this.spec2 = Number(prompt("Type? 0- Scaffold, 1- solid", ""));
		}
	
		
	bgOptions.push(new editOption(100 + i * 60, h - 100, null));
	bgOptions[bgOptions.length-1].imageText = ""
	bgOptions[bgOptions.length-1].name = "AniDoor"
	bgOptions[bgOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new AniDoor(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.spec + "," + this.spec2 + "));"
		wallPanels.push(new AniDoor( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		
		lastEdit.push(4)
	}
	bgOptions[bgOptions.length-1].spec = 1 //position
	bgOptions[bgOptions.length-1].spec2 = 0; //max height
	bgOptions[bgOptions.length-1].config = function(){
		this.spec = Number (prompt("User interactive?  0- Opens for player    1- Just stutters on random", "1"));
		this.spec2 = Number(prompt("Lit behind? 0- Nope   1- Yes Please", "0"));
	}
	
	
	bgOptions.push(new editOption(100 + i * 60, h - 100, null));
	bgOptions[bgOptions.length-1].imageText = ""
	bgOptions[bgOptions.length-1].name = "Fan"
	bgOptions[bgOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new fan(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.spec + "," + this.spec2 + "," + this.spec3 + "));"
		wallPanels.push(new fan( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2, this.spec3))
		
		lastEdit.push(4)
	}
	bgOptions[bgOptions.length-1].spec = 0.2 //position
	bgOptions[bgOptions.length-1].spec2 = 0; //max height
	bgOptions[bgOptions.length-1].spec3 = 1; //yes grate!
	bgOptions[bgOptions.length-1].config = function(){
		this.spec = Number (prompt("Speed?   0.1 = slow 0.8 fast", "0.1"));
		this.spec2 = Number(prompt("Lit behind? 0- Nope   1- Yes Please", "0"));
		this.spec3 = Number(prompt("Grate or no grate? YESY = 1, NO = 0", "1"))
	}
	
	bgOptions.push(new editOption(100 + i * 60, h - 100, null));
	bgOptions[bgOptions.length-1].imageText = ""
	bgOptions[bgOptions.length-1].name = "Monitor"
	bgOptions[bgOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new Monitor(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", '" + this.spec + "'," + this.spec2 + "));"
		wallPanels.push(new Monitor( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		
		lastEdit.push(4)
	}
	bgOptions[bgOptions.length-1].spec = "ALERT" //position
	bgOptions[bgOptions.length-1].spec2 = 0; //max height
	bgOptions[bgOptions.length-1].config = function(){
		this.spec = prompt("Message?  Keep it short, these monitors are small", "ALERT");
		//this.spec2 = Number(prompt("Lit behind? 0- Nope   1- Yes Please", "0"));
	}
	
	bgOptions.push(new editOption(100 + i * 60, h - 100, null));
	bgOptions[bgOptions.length-1].imageText = ""
	bgOptions[bgOptions.length-1].name = "Ad Board"
	bgOptions[bgOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new Billboard(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", '" + this.spec + "'," + this.spec2 + "));"
		wallPanels.push(new Billboard( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		
		lastEdit.push(4)
	}
	bgOptions[bgOptions.length-1].spec = "" //position
	bgOptions[bgOptions.length-1].spec2 = 0; //max height
	bgOptions[bgOptions.length-1].config = function(){
		this.spec = prompt("Message?  Type 'random' to get a predone slogan, leave it blank to get a broken stutter billboard", "random");
		//this.spec2 = Number(prompt("Lit behind? 0- Nope   1- Yes Please", "0"));
	}
	
	
		bgOptions.push(new editOption(100 + i * 60, h - 100, null));
	bgOptions[bgOptions.length-1].imageText = ""
	bgOptions[bgOptions.length-1].name = "Server"
	bgOptions[bgOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new Server(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", '" + this.spec + "'," + this.spec2 + "));"
		wallPanels.push(new Server( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		
		lastEdit.push(4)
	}
	bgOptions[bgOptions.length-1].spec = 1 //1- on 0 off
	bgOptions[bgOptions.length-1].spec2 = 0; //max height
	bgOptions[bgOptions.length-1].config = function(){
		this.spec = prompt("0- OFF		1- ON", "ALERT");
		//this.spec2 = Number(prompt("Lit behind? 0- Nope   1- Yes Please", "0"));
	}
	
	
	
	for(var i=0; i < wallFeatures.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, wallFeatures[i]));
		fOptions[fOptions.length-1].imageText = "wallFeatures[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	
	for(var i=0; i < ceiling.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, ceiling[i]));
		fOptions[fOptions.length-1].imageText = "ceiling[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	for(var i=0; i < floor.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, floor[i]));
		fOptions[fOptions.length-1].imageText = "floor[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	for(var i=0; i < sideWall.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, sideWall[i]));
		fOptions[fOptions.length-1].imageText = "sideWall[" + i + "]"
		fOptions[fOptions.length-1].name = sideWall[i].width + "x" +sideWall[i].height;
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	for(var i=0; i < pipes.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, pipes[i]));
		fOptions[fOptions.length-1].imageText = "pipes[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 0){
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}else{
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	
	for(var i=0; i < panelHallClean.length; i++) {
		bgOptions.push(new editOption(100 + i * 60, h - 100, panelHallClean[i]));
		bgOptions[bgOptions.length-1].imageText = "panelHallClean[" + i + "]"
		bgOptions[bgOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new Panel(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", " + this.spec + "," + this.spec2 + "));"
			wallPanels.push(new Panel( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic, this.spec, this.spec2))
			lastEdit.push(4)
		}
		bgOptions[bgOptions.length-1].spec = 0 //top, bottom
		bgOptions[bgOptions.length-1].spec2 = 0.5; //Cleanliness
		bgOptions[bgOptions.length-1].config = function(){
			this.spec = prompt("Top (T) Bottom (B) else regular (any key)", "");
			if(this.spec == "T") this.spec = 1
			else if(this.spec == "B") this.spec = 2
			else this.spec = 0
			this.spec2 = Number(prompt("How clean and dank?  0 - very dank, 1 - very clean, 0.5 - No effect", ""));
		}
	}
	bgOptions.push(new editOption(100 + i * 60, h - 100, null));
	bgOptions[bgOptions.length-1].imageText = "WordWall"
	bgOptions[bgOptions.length-1].name = "Word Wall"
	bgOptions[bgOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new wordWall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", '" + this.spec + "'," + this.spec2 + "));"
		wallPanels.push(new wordWall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(4);
	}
	bgOptions[bgOptions.length-1].spec = "ALERT" //Message
	bgOptions[bgOptions.length-1].spec2 = 20; //Size
	bgOptions[bgOptions.length-1].config = function(){
		this.spec = prompt("Wall Message?", "");
			
		this.spec2 = Number(prompt("Font Size? 30 Huge, 20 Big 10 Small", ""));
		ctx.font = 'bold ' + this.spec2 + 'pt wallFont';
		alert("Message will be " + ctx.measureText(this.spec).width + " wide, " + this.spec2 + " high.");
	}
	
	
	
	
	var wOptions = []
	
	//Floors
	for(var i=0; i < floor.length; i++) {
		wOptions.push(new editOption(100 + i * 60, h - 100, floor[i]));
		wOptions[wOptions.length-1].imageText = "floor[" + i + "]"
		wOptions[wOptions.length-1].name = floor[i].width + "x" + floor[i].height;
		wOptions[wOptions.length-1].insert = function(){
			this.text = "wall.push(createWall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", 100,30," + this.imageText + "));"
			wall.push(createWall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,100,30,this.pic))
			lastEdit.push(3)
		}
	}
	for(var i=0; i < floorHole.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, floorHole[i]));
		fOptions[fOptions.length-1].imageText = "floorHole[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
			wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
			lastEdit.push(4)
		}
	}
	
	//Sidewalls
	for(var i=0; i < sideWall.length; i++) {
		wOptions.push(new editOption(100 + i * 60, h - 100, sideWall[i]));
		wOptions[wOptions.length-1].imageText = "sideWall[" + i + "]"
		wOptions[wOptions.length-1].name = sideWall[i].width + "x" +sideWall[i].height;
		wOptions[wOptions.length-1].insert = function(){
			this.text = "wall.push(createWall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", 30,100," + this.imageText + "));"
			wall.push(createWall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, 30, 100,this.pic))
			lastEdit.push(3)
		}
	}
	//Sidewall debris
	for(var i=0; i < sideWallDebris.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, sideWallDebris[i]));
		fOptions[fOptions.length-1].imageText = "sideWallDebris[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(createWall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", 30,100," + this.imageText + "));"
				foreGround.push(createWall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,30,100,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(createWall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", 30,100," + this.imageText + "));"
				wallPanels.push(createWall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,30,100,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	for(var i=0; i < ceiling.length; i++) {
		wOptions.push(new editOption(100 + i * 60, h - 100, ceiling[i]));
		wOptions[wOptions.length-1].imageText = "ceiling[" + i + "]"
		wOptions[wOptions.length-1].name = ceiling[i].width + "x" + ceiling[i].height;
		wOptions[wOptions.length-1].insert = function(){
			this.text = "wall.push(createWall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", 100,50," + this.imageText + "));"
			wall.push(createWall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,100,50,this.pic))
			lastEdit.push(3)
		}
	}
	for(var i=0; i < ceilingHole.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, ceilingHole[i]));
		fOptions[fOptions.length-1].imageText = "ceilingHole[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", " + this.spec + "," + this.spec2 + "));"
			wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic, this.spec, this.spec2))
			lastEdit.push(4)
		}/*
		bgOptions[bgOptions.length-1].spec = 0 //top, bottom
		bgOptions[bgOptions.length-1].spec2 = 0.5; //Cleanliness
		bgOptions[bgOptions.length-1].config = function(){
			this.spec = prompt("Top (T) Bottom (B) else regular (any key)", "");
			if(this.spec == "T") this.spec = 1
			else if(this.spec == "B") this.spec = 2
			else this.spec = 0
			this.spec2 = Number(prompt("How clean and dank?  0 - very dank, 1 - very clean, 0.5 - No effect", ""));
		}
		*/
	}
	
	for(var i=0; i < door.length; i++) {
		bgOptions.push(new editOption(100 + i * 60, h - 100, door[i]));
		bgOptions[bgOptions.length-1].imageText = "door[" + i + "]"
		bgOptions[bgOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", '', 0.5));"
			wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic, "", 0.5))
			lastEdit.push(4)
		}
	}
	
	//Foreground
	
	for(var i=0; i < foreGPic.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, foreGPic[i]));
		fOptions[fOptions.length-1].imageText = "foreGPic[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}

	
	for(var i=0; i < windowArt.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, windowArt[i]));
		fOptions[fOptions.length-1].imageText = "windowArt[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		/*fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}*/
	}
	
	for(var i=0; i < posterArt.length; i++) {
		fOptions.push(new editOption(100 + i * 60, h - 100, posterArt[i]));
		fOptions[fOptions.length-1].imageText = "posterArt[" + i + "]"
		fOptions[fOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		fOptions[fOptions.length-1].spec = 0
		fOptions[fOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	//Lights
	var lOptions = []
	lOptions.push(new editOption(50, h - 100, null));
	lOptions[0].imageText = "panelHallClean[" + i + "]"
	lOptions[0].name = "Round Light";
	lOptions[0].insert = function(){
		this.text = "rLights.push(new staticLight(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", 20));"
		rLights.push(new staticLight( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,20))
		lastEdit.push(8)
	}
	
	lOptions.push(new editOption(110, h - 100, null));
	lOptions[1].imageText = ""
	lOptions[1].name = "Lamp";
	lOptions[1].insert = function(){
		this.text = "lamps.push(new Lamp(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new Lamp(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(170, h - 100, null));
	lOptions[2].imageText = ""
	lOptions[2].name = "Spin Light";
	lOptions[2].insert = function(){
		this.text = "dLights.push(new spinLight(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",50,0));"
		dLights.push(new spinLight(Math.floor((mx- ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize, 50,0));
		lastEdit.push(0)
	}
	
	lOptions.push(new editOption(230, h - 100, null));
	lOptions[3].imageText = ""
	lOptions[3].name = "Flicker Light";
	lOptions[3].insert = function(){
		this.text = "lamps.push(new FlickerLamp(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new FlickerLamp(Math.floor((mx - ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	
	lOptions.push(new editOption(290, h - 100, null));
	lOptions[4].imageText = ""
	lOptions[4].name = "Angled Light";
	lOptions[4].insert = function(){
		this.text = "dLights.push(new angledLight(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "," +  this.spec2 + ", "+ this.spec + "));"
		dLights.push(new angledLight( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec2, this.spec))
		lastEdit.push(0)
	}
	lOptions[4].spec = 0;
	lOptions[4].spec2 = 150;
	lOptions[4].config = function(){
		this.spec = Number(prompt("State the desired angle.", ""));
		this.spec2 = Number(prompt("State the desired length.", ""));
	}
	
	lOptions.push(new editOption(210, h - 100, null));
	lOptions[5].imageText = ""
	lOptions[5].name = "Glow Lamp";
	lOptions[5].insert = function(){
		this.text = "lamps.push(new glowLamp(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new glowLamp(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(270, h - 100, null));
	lOptions[6].imageText = ""
	lOptions[6].name = "Dead Lamp";
	lOptions[6].insert = function(){
		this.text = "lamps.push(new deadLamp(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new deadLamp(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(270, h - 100, null));
	lOptions[7].imageText = ""
	lOptions[7].name = "Sparks";
	lOptions[7].insert = function(){
		this.text = "lamps.push(new sparker(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new sparker(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(270, h - 100, null));
	lOptions[8].imageText = ""
	lOptions[8].name = "Water Leak";
	lOptions[8].insert = function(){
		this.text = "lamps.push(new waterDrop(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new waterDrop(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	
	
		lOptions.push(new editOption(100 + i * 60, h - 100, ceilingHole[i]));
		lOptions[lOptions.length-1].imageText = "Word Ticker"
		lOptions[lOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new wordTicker(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", '" + this.spec + "'));"
			wallPanels.push(new wordTicker( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec))
			lastEdit.push(4);
		}
		lOptions[lOptions.length-1].spec = "ALERT" //top, bottom
		lOptions[lOptions.length-1].spec2 = 0; //Cleanliness
		lOptions[lOptions.length-1].config = function(){
			this.spec = prompt("Warning message?", "");
			
			//this.spec2 = Number(prompt("How clean and dank?  0 - very dank, 1 - very clean, 0.5 - No effect", ""));
		}
	
	
	lOptions.push(new editOption(110, h - 100, biglampLit));
	lOptions[10].imageText = ""
	lOptions[10].name = "Big Lamp";
	lOptions[10].insert = function(){
		this.text = "lamps.push(new BigLamp(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new BigLamp(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(110, h - 100, biglampOut));
	lOptions[11].imageText = ""
	lOptions[11].name = "Big Lamp Dead";
	lOptions[11].insert = function(){
		this.text = "lamps.push(new BigLampDead(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new BigLampDead(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(110, h - 100, null));
	lOptions[12].imageText = ""
	lOptions[12].name = "BL Flicker";
	lOptions[12].insert = function(){
		this.text = "lamps.push(new BigLampFlicker(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new BigLampFlicker(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(110, h - 100, null));
	lOptions[13].imageText = ""
	lOptions[13].name = "Pulse Light";
	lOptions[13].insert = function(){
		this.text = "lamps.push(new pulseLight(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new pulseLight(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(110, h - 100, null));
	lOptions[14].imageText = ""
	lOptions[14].name = "Add PLight";
	lOptions[14].insert = function(){
		var lastL = -1;
		for(var i=0; i < lamps.length; i++){
			if(lamps[i].type == "PLight") lastL = i
		}
		if(lastL >= 0){
			if(lamps[lastL].type == "PLight"){
				this.text = "lamps[" + lastL + "].addPLight(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + ", " + Math.floor((my-ctxOy) / snapSize)*snapSize + ");"
				lamps[lastL].addPLight(Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my-ctxOy) / snapSize)*snapSize);
				lastEdit.push(2)
			}else{
				this.text = ""
				alert("I found a pulse light strip that isn't a pulse light strip.  Whaaaat?");
			}
		}else {
			alert("No pulse light strips on the map yet.  MAKE ONE BEFORE YOU ADD TO IT!!");
			this.text = "";
		}
	}
	
	lOptions.push(new editOption(290, h - 100, null));
	lOptions[15].imageText = ""
	lOptions[15].name = "Gen Light";
	lOptions[15].insert = function(){
		this.text = "dLights.push(new GenLight(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "," +  this.spec + ", "+ this.spec2 + "));"
		dLights.push(new GenLight( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(0)
	}
	lOptions[15].spec = 10;
	lOptions[15].spec2 = 0.2;
	lOptions[15].config = function(){
		this.spec = Number(prompt("State the desired radius.", this.spec));
		this.spec2 = Number(prompt("State the desired intensity.", this.spec2));
	}
	
	lOptions.push(new editOption(270, h - 100, null));
	lOptions[16].imageText = ""
	lOptions[16].name = "Up Lamp";
	lOptions[16].insert = function(){
		this.text = "lamps.push(new UpLamp(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		lamps.push(new UpLamp(Math.floor((mx-ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(2)
	}
	
	lOptions.push(new editOption(170, h - 100, null));
	lOptions[17].imageText = ""
	lOptions[17].name = "Steam Jet";
	lOptions[17].insert = function(){
		this.text = "dLights.push(new steamJet(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		dLights.push(new steamJet(Math.floor((mx- ctxOx) / snapSize)*snapSize,Math.floor((my-ctxOy) / snapSize)*snapSize));
		lastEdit.push(0)
	}
	
	lOptions.push(new editOption(290, h - 100, null));
	lOptions[18].imageText = ""
	lOptions[18].name = "Water Light";
	lOptions[18].insert = function(){
		this.text = "dLights.push(new WaterLight(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "," +  this.spec + ", "+ this.spec2 + "));"
		dLights.push(new WaterLight( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(0)
	}
	lOptions[18].spec = 150;
	lOptions[18].spec2 = 4;
	lOptions[18].config = function(){
		this.spec = Number(prompt("State the desired radius.", this.spec));
		this.spec2 = Number(prompt("State the desired intensity. /n 4- Pretty Bright /n 1- Super Bright", this.spec2));
	}
	
	
	lOptions.push(new editOption(100 + i * 60, h - 100, ceilingHole[i]));
		lOptions[lOptions.length-1].imageText = "Fire"
		lOptions[lOptions.length-1].name = "Fire"
		lOptions[lOptions.length-1].insert = function(){
			this.text = "wallPanels.push(new Fire(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", '" + this.spec + "'));"
			wallPanels.push(new Fire( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec))
			lastEdit.push(4);
		}
		lOptions[lOptions.length-1].spec = "test" //top, bottom
		lOptions[lOptions.length-1].spec2 = 0; //Cleanliness
		lOptions[lOptions.length-1].config = function(){
			this.spec = prompt("Current;y unused.  Type away!", "It makes no difference");
			
			//this.spec2 = Number(prompt("How clean and dank?  0 - very dank, 1 - very clean, 0.5 - No effect", ""));
		}
	
	
	//Items
	var iOptions = []
	iOptions.push(new editOption(50, h - 100, null));
	iOptions[iOptions.length-1].imageText = "iconPistol"
	iOptions[iOptions.length-1].name = "Pistol";
	iOptions[iOptions.length-1].pic = iconPistol;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(pistolItem(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		items.push(pistolItem( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize))
		lastEdit.push(6)
	}
	
	iOptions.push(new editOption(110, h - 100, null));
	iOptions[iOptions.length-1].imageText = "iconSMG"
	iOptions[iOptions.length-1].name = "SMG";
	iOptions[iOptions.length-1].pic = iconSMG;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(smgItem(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		items.push(smgItem( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize))
		lastEdit.push(6)
	}
	
	iOptions.push(new editOption(170, h - 100, null));
	iOptions[iOptions.length-1].imageText = "iconPistol"
	iOptions[iOptions.length-1].name = "Rifle";
	iOptions[iOptions.length-1].pic = iconRifle;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(rifleItem(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		items.push(rifleItem( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize))
		lastEdit.push(6)
	}
	
	
	iOptions.push(new editOption(230, h - 100, null));
	iOptions[iOptions.length-1].imageText = "iconPistol"
	iOptions[iOptions.length-1].name = "MedKit";
	iOptions[iOptions.length-1].pic = iconMed;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(medItem(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		items.push(medItem( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize))
		lastEdit.push(6)
	}
	
	iOptions.push(new editOption(230, h - 100, null));
	iOptions[iOptions.length-1].imageText = "iconArmor"
	iOptions[iOptions.length-1].name = "Armor";
	iOptions[iOptions.length-1].pic = iconArmor;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(armorItem(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		items.push(armorItem( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize))
		lastEdit.push(6)
	}
	
	iOptions.push(new editOption(230, h - 100, null));
	iOptions[iOptions.length-1].imageText = ""
	iOptions[iOptions.length-1].name = "Steam Trap";
	iOptions[iOptions.length-1].pic = null;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(steamTrap(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		items.push(steamTrap( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize))
		lastEdit.push(6)
	}
	
	
	iOptions.push(new editOption(230, h - 100, null));
	iOptions[iOptions.length-1].imageText = "recorder"
	iOptions[iOptions.length-1].name = "Message";
	iOptions[iOptions.length-1].pic = recorder;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(messageTrap(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", '" + this.spec + "', '" + this.spec2 + "'));"
		items.push(messageTrap( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.pic, this.spec, this.spec2))
		lastEdit.push(6)
	}
	
	iOptions[iOptions.length-1].config = function(){
		this.spec = prompt("Message title?  To make it have a creature portrait, put $(creature index) on the end of the message.  Example $0", "Default title!");
		this.spec2 = prompt("Full Message?", "");
	}
	
	
	iOptions.push(new editOption(230, h - 100, null));
	iOptions[iOptions.length-1].imageText = "blankPic"
	iOptions[iOptions.length-1].name = "Message";
	iOptions[iOptions.length-1].pic = blankPic;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(messageTrap(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", '" + this.spec + "', '" + this.spec2 + "'));"
		items.push(messageTrap( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.pic, this.spec, this.spec2))
		lastEdit.push(6)
	}
	
	iOptions[iOptions.length-1].config = function(){
		this.spec = prompt("Message title?", "Default title!");
		this.spec2 = prompt("Full Message?", "");
	}
	
	
	
	iOptions.push(new editOption(230, h - 100, null));
	iOptions[iOptions.length-1].imageText = "blankPic"
	iOptions[iOptions.length-1].name = "Rumbler";
	iOptions[iOptions.length-1].pic = blankPic;
	iOptions[iOptions.length-1].insert = function(){
		this.text = "items.push(rumbler(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", '" + this.spec + "', '" + this.spec2 + "'));"
		items.push(rumbler( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.pic, this.spec, this.spec2))
		lastEdit.push(6)
	}
	
	iOptions[iOptions.length-1].config = function(){
		this.spec = Number(prompt("Duration in screen draws?", "35"));
		this.spec2 = Number(prompt("0- Constant    1- One time only", "1"));
	}
	
	var sOptions = [];
	sOptions.push(new editOption(230, h - 100, null));
	sOptions[sOptions.length-1].imageText = "wallFeatures[16]"
	sOptions[sOptions.length-1].name = "Alarm";
	sOptions[sOptions.length-1].pic = wallFeatures[16];
	sOptions[sOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new Alarm(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + "));"
		wallPanels.push(new Alarm( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize))
		lastEdit.push(10)
	}
	
	
	sOptions.push(new editOption(230, h - 100, null));
	sOptions[sOptions.length-1].imageText = ""
	sOptions[sOptions.length-1].name = "Speaker";
	sOptions[sOptions.length-1].pic = null;
	sOptions[sOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new talker(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",'" + this.spec + "','" + this.spec2 + "'));"
		wallPanels.push(new talker( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(10)
	}
	sOptions[sOptions.length-1].spec = "alarm"
	sOptions[sOptions.length-1].spec2 = "test"
	
	sOptions[sOptions.length-1].config = function(){
		this.spec = prompt("Message?", "Default title!");
		//this.spec2 = prompt("unsed!?", "");
	}
	
	
	var bOptions = []
	for(var i=0; i < bioPic.length; i++) {
		bOptions.push(new editOption(100 + i * 60, h - 100, bioPic[i]));
		bOptions[bOptions.length-1].imageText = "bioPic[" + i + "]"
		bOptions[bOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new ForeGround(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new ForeGround( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		bOptions[bOptions.length-1].spec = 0
		bOptions[bOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", "");
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	var aOptions = [];
	for(var i=0; i < animators.length; i++) {
		aOptions.push(new editOption(100 + i * 60, h - 100, animators[i].pic));
		aOptions[aOptions.length-1].imageText = "animators[" + i + "].pic"
		aOptions[aOptions.length-1].name = animators[i].name;
		aOptions[aOptions.length-1].insert = function(){
			if(this.spec == 1){
				this.text = "foreGround.push(new Animator(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				foreGround.push(new Animator( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(7)
			}else{
				this.text = "wallPanels.push(new Animator(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + "));"
				wallPanels.push(new Animator( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,this.pic))
				lastEdit.push(4)
			}
		}
		aOptions[aOptions.length-1].spec = 0
		aOptions[aOptions.length-1].config = function(){
			this.spec = prompt("Foreground (F) Background (B)  Background is default", this.spec);
			if(this.spec == "F") this.spec = 1
			else this.spec = 0
		}
	}
	
	aOptions.push(new editOption(230, h - 100, null));
	aOptions[aOptions.length-1].imageText = ""
	aOptions[aOptions.length-1].name = "conveyr belt";
	aOptions[aOptions.length-1].pic = null;
	aOptions[aOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new cBelt(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",'" + this.spec + "','" + this.spec2 + "'));"
		wallPanels.push(new cBelt( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(10)
	}
	aOptions[aOptions.length-1].spec = 4
	aOptions[aOptions.length-1].spec2 = 2
	
	aOptions[aOptions.length-1].config = function(){
		this.spec = Number(prompt("Length? use multiples of 50", "4"));
		this.spec2 = Number(prompt("Number of items on the belt?", "1"));
	}
	
	
	aOptions.push(new editOption(230, h - 100, null));
	aOptions[aOptions.length-1].imageText = ""
	aOptions[aOptions.length-1].name = "Tank Mover";
	aOptions[aOptions.length-1].pic = null;
	aOptions[aOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new tankMover(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",'" + this.spec + "','" + this.spec2 + "'));"
		wallPanels.push(new tankMover( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(10)
	}
	aOptions[aOptions.length-1].spec = 4
	aOptions[aOptions.length-1].spec2 = 6
	
	aOptions[aOptions.length-1].config = function(){
		this.spec = Number(prompt("Number of canisters?", "4"));
		//this.spec2 = Number(prompt("Number of slots?", "1"));
	}
	
	
	///////////////
	//	Creature options
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Marine";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(Marine(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",3));"
		creature.push(Marine( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,3))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Scientist";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(Scientist(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",3));"
		creature.push(Scientist( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,3))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Sci Armed";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(ScientistArmed(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",3));"
		creature.push(ScientistArmed( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,3))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Entry Insect";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(baseLineMutant(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(baseLineMutant( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Entry Reptile";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(baseLineMutant(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",1));"
		creature.push(baseLineMutant( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,1))
		lastEdit.push(5)
	}
	
		cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Maggot Man";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(Maggot(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(Maggot( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Small Bug";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(BugSmall(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(BugSmall( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Bug";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(Bug(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(Bug( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Worm";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(worm(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(worm( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Low Insect";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(LowInsect(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(LowInsect( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Med Insect";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(MedInsect(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(MedInsect( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "High Insect";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(HighInsect(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",0));"
		creature.push(HighInsect( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,0))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Low Reptile";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(LowReptile(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",1));"
		creature.push(LowReptile( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,1))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "Medium Reptile";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(MedReptile(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",1));"
		creature.push(MedReptile( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,1))
		lastEdit.push(5)
	}
	
	cOptions.push(new editOption(50, h - 100, null));
	cOptions[cOptions.length-1].imageText = ""
	cOptions[cOptions.length-1].name = "High Reptile";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(HighReptile(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ",1));"
		creature.push(HighReptile( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize,1))
		lastEdit.push(5)
	}

	cOptions.push(new editOption(230, h - 100, null));
	cOptions[cOptions.length-1].imageText = "recorder"
	cOptions[cOptions.length-1].name = "Spawn Trap";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "items.push(spawnTrap(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", " + this.imageText + ", '" + this.spec + "', '" + this.spec2 + "','" + this.spec3 + "'));"
		items.push(spawnTrap( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.pic, this.spec, this.spec2, this.spec3))
		lastEdit.push(6)
	}
	
	cOptions[cOptions.length-1].config = function(){
		this.spec = prompt("Creature type? \n 0:Insect \n 1:Reptile \n 2:Scientist \n 3:Marine", "0");
		if(this.spec == 0) this.spec2 = prompt("Insect Level? \n 0:Low \n 1:Med \n 2:High \n 3:Bug \n 4:Maggot \n 5:BugSmall \n 6:Worm", "0");
		else this.spec2 = prompt("Level? 0:Low 1:Med 2:High", "0");
		
		this.spec3 = prompt("Spawn Coordinates? x,y  Example: 250,1180  No brackets or spaces.", "#,#");
	}
	cOptions.push(new editOption(230, h - 100, null));
	cOptions[cOptions.length-1].imageText = "recorder"
	cOptions[cOptions.length-1].name = "Egg";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new Egg(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize +  ", '" + this.spec + "', '" + this.spec2 + "'));"
		wallPanels.push(new Egg( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(4)
	}
	
	cOptions[cOptions.length-1].config = function(){
		this.spec = prompt("Hatch Creature type? \n 0:Insect \n 1:Reptile \n 2:Scientist \n 3:Marine", "0");
		if(this.spec == 0) this.spec2 = prompt("Insect Level? \n 0:Low \n 1:Med \n 2:High \n 3:Bug \n 4:Maggot \n 5:BugSmall \n 6:Worm", "0");
		else this.spec2 = prompt("Level? 0:Low 1:Med 2:High", "0");
		
		//this.spec3 = prompt("Spawn Coordinates? x,y  Example: 250,1180  No brackets or spaces.", "#,#");
	}
	
	cOptions.push(new editOption(230, h - 100, null));
	cOptions[cOptions.length-1].imageText = "recorder"
	cOptions[cOptions.length-1].name = "Egg Layer";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "creature.push(new EggLayer(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize +  ", '" + this.spec + "', '" + this.spec2 + "'));"
		creature.push(new EggLayer( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2))
		lastEdit.push(5)
	}
	
	cOptions[cOptions.length-1].config = function(){
		this.spec = prompt("Lay Creature type? \n 0:Insect \n 1:Reptile \n 2:Scientist \n 3:Marine", "0");
		if(this.spec == 0) this.spec2 = prompt("Insect Level? \n 0:Low \n 1:Med \n 2:High \n 3:Bug \n 4:Maggot \n 5:BugSmall \n 6:Worm", "0");
		else this.spec2 = prompt("Level? 0:Low 1:Med 2:High", "0");
		
		//this.spec3 = prompt("Spawn Coordinates? x,y  Example: 250,1180  No brackets or spaces.", "#,#");
	}
	
	
	cOptions.push(new editOption(230, h - 100, null));
	cOptions[cOptions.length-1].imageText = "recorder"
	cOptions[cOptions.length-1].name = "Perm Spawn";
	cOptions[cOptions.length-1].pic = null;
	cOptions[cOptions.length-1].insert = function(){
		this.text = "wallPanels.push(new spawner(" + Math.floor((mx-ctxOx) / snapSize)*snapSize + "," + Math.floor((my-ctxOy) / snapSize)*snapSize + ", '" + this.spec + "', '" + this.spec2 + "','" + this.spec3 + "'));"
		wallPanels.push(new spawner( Math.floor((mx-ctxOx) / snapSize)*snapSize, Math.floor((my- ctxOy) / snapSize)*snapSize, this.spec, this.spec2, this.spec3))
		lastEdit.push(4)
	}
	
	cOptions[cOptions.length-1].config = function(){
		this.spec = prompt("Creature type? 0- Insect 1- Reptile 2- Human", "0");
		if(this.spec == 0) this.spec2 = prompt("Insect Level? 0:Low 1:Med 2:High 3:Bug 4:Maggot 5:BugSmall", "0");
		else this.spec2 = prompt("Level? 0- Low 1-Med 2-High", "0");
		
		this.spec3 = Number(prompt("Spawn Rate? 1 sec:" + Math.floor(1000/60) + " 2 sec:" + Math.floor(2000/60) + " 3 sec: "+ Math.floor(3000/60) + " 4 sec: "+ Math.floor(4000/60) + " 5 sec: ", Math.round(5000/60), ""));
	}

	
	
	for(var i=0; i < bgOptions.length; i++) {
		if(i%2 == 0) {
			bgOptions[i].b.x = 50 + i * 30
			bgOptions[i].b.y = h - 110
		}else{
			bgOptions[i].b.x = 50 + (i-1) * 30
			bgOptions[i].b.y = h - 50
		}
	}
	for(var i=0; i < aOptions.length; i++) {
		if(i%2 == 0) {
			aOptions[i].b.x = 50 + i * 30
			aOptions[i].b.y = h - 110
		}else{
			aOptions[i].b.x = 50 + (i-1) * 30
			aOptions[i].b.y = h - 50
		}
	}
	for(var i=0; i < wOptions.length; i++) {
		if(i%2 == 0) {
			wOptions[i].b.x = 50 + i * 30
			wOptions[i].b.y = h - 110
		}else{
			wOptions[i].b.x = 50 + (i-1) * 30
			wOptions[i].b.y = h - 50
		}
	}
	for(var i=0; i < sOptions.length; i++) {
		if(i%2 == 0) {
			sOptions[i].b.x = 50 + i * 30
			sOptions[i].b.y = h - 110
		}else{
			sOptions[i].b.x = 50 + (i-1) * 30
			sOptions[i].b.y = h - 50
		}
	}
	
	for(var i=0; i < bOptions.length; i++) {
		if(i%2 == 0) {
			bOptions[i].b.x = 50 + i * 30
			bOptions[i].b.y = h - 110
		}else{
			bOptions[i].b.x = 50 + (i-1) * 30
			bOptions[i].b.y = h - 50
		}
	}
	
	for(var i=0; i < cOptions.length; i++) {
		if(i%2 == 0) {
			cOptions[i].b.x = 50 + i * 30
			cOptions[i].b.y = h - 110
		}else{
			cOptions[i].b.x = 50 + (i-1) * 30
			cOptions[i].b.y = h - 50
		}
	}
	for(var i=0; i < iOptions.length; i++) {
		if(i%2 == 0) {
			iOptions[i].b.x = 50 + i * 30
			iOptions[i].b.y = h - 110
		}else{
			iOptions[i].b.x = 50 + (i-1) * 30
			iOptions[i].b.y = h - 50
		}
	}
	
	for(var i=0; i < fOptions.length; i++) {
		if(i%2 == 0) {
			fOptions[i].b.x = 50 + i * 30
			fOptions[i].b.y = h - 110
		}else{
			fOptions[i].b.x = 50 + (i-1) * 30
			fOptions[i].b.y = h - 50
		}
	}
	
	for(var i=0; i < lOptions.length; i++) {
		if(i%2 == 0) {
			lOptions[i].b.x = 50 + i * 30
			lOptions[i].b.y = h - 110
		}else{
			lOptions[i].b.x = 50 + (i-1) * 30
			lOptions[i].b.y = h - 50
		}
	}
	
	function tile(a,b){
		this.x = a //index values
		this.y = b
		this.panels = [];
		this.wall = false;
	
	}
	
	function Exit(a,b, Index, direct, dx, dy){
		this.x = a;
		this.y = b;
		this.next = Index;
		this.skip = direct //boolean is goto scene or level T=level, F= scene then level
		this.spawnx = dx;
		this.spawny = dy;
		this.load = function(){
			if(cLevel >= 0 && cLevel < level.length) level[cLevel].endLevel()
			if(this.skip){
				//go to level direct
				
				loadLevel(this.next);
				
				creature[cS].x = this.spawnx
				creature[cS].y = this.spawny
				for(var i=0; i < allies.length; i++){
					allies[i].x = this.spawnx + i * 20
					allies[i].y = this.spawny
				}
				screen = 5;
			}else{
				//load the cutscene
				cutscene[this.next].load();
			}
		
		}
	}
	//Level constructors
	function Level(n){
		this.name = n;
		this.elevators = [];
		this.wall = [];
		this.items = [];
		this.wallPanels =[]
		this.dLights = []
		this.rLights = []
		this.pulseLights = []
		this.lamps = []
		this.creature = []
		this.foreGround = []
		this.nextScene = 0;
		this.start = {x:0,y:0}
		this.end = {x:0,y:0}
		this.exits = [];  //Object type
		this.endLevel = function(){
			screen = 4
			scene = this.nextScene;
			playerCharacter = creature[cS];
			this.creature.splice(cS,1);
			//Select nearby allies
			allies = [];
			for(var i=0; i < this.creature.length; i++){
				if (dist(playerCharacter.x, playerCharacter.y, this.creature[i].x, this.creature[i].y) < 200 && this.creature[i].stats.type == playerCharacter.stats.type){
					allies.push(this.creature[i])
					this.creature.splice(i,1)
					i--;
				}
			}
			cutscene[scene].frame = 0
			cutscene[scene].load();
		}
	}
	
	function loadLevel(n){
		stopSound();
		levelName = level[n].name
		elevators = level[n].elevators
		exits = level[n].exits
		
		wall = level[n].wall;
		for(var i =0; i < elevators.length; i++) elevators[i].initialize();
		
		resetMapGrid();
		
		rLights = level[n].rLights;
		pulseLights = level[n].pulseLights
		dLights = level[n].dLights;
		lamps = level[n].lamps
		wallPanels = level[n].wallPanels
		
		items = level[n].items
		foreGround = level[n].foreGround
		generateForeGround();
		
		
		var tx = 0;
		var ty = 0;
		/*for(var i= 0 ; i < wallPanels.length; i++){
			tx = (wallPanels[i].x+50)/50
			ty = (wallPanels[i].y+50)/50
			mapGrid[Math.floor(tx)][Math.floor(ty)].panels.push(i)		
		}*/
		
		for(var i= 0 ; i < wall.length; i++){
			tx = Math.floor((wall[i].x)/50)
			ty = Math.floor((wall[i].y)/50)
			if(tx >= 0 && tx < mapGrid.length && ty >=0 && ty < mapGrid[0].length){
				mapGrid[Math.floor(tx)][Math.floor(ty)].wall = true
			}
			
			tx = Math.floor((wall[i].x + wall[i].width - 1)/50)
			ty = Math.floor((wall[i].y)/50)
			if(tx >= 0 && tx < mapGrid.length && ty >=0 && ty < mapGrid[0].length){
				mapGrid[Math.floor(tx)][Math.floor(ty)].wall = true
			}
			
			tx = Math.floor((wall[i].x)/50)
			ty = Math.floor((wall[i].y + wall[i].height - 1)/50)
			if(tx >= 0 && tx < mapGrid.length && ty >=0 && ty < mapGrid[0].length){
				mapGrid[Math.floor(tx)][Math.floor(ty)].wall = true
			}
			
			tx = Math.floor((wall[i].x + wall[i].width - 1)/50)
			ty = Math.floor((wall[i].y + wall[i].height - 1)/50)
			if(tx >= 0 && tx < mapGrid.length && ty >=0 && ty < mapGrid[0].length){
				mapGrid[Math.floor(tx)][Math.floor(ty)].wall = true
			}
		}
		
		creature = level[n].creature
		for(var i=0;i < creature.length;i++)creature[i].getEnemies();
		
		if(playerCharacter != null){
			creature.push(playerCharacter);
			cS = creature.length-1;
			creature[cS].x = level[n].start.x
			creature[cS].y = level[n].start.y
		}
		
		
		
		if(allies.length >0){	
			for(var i=0; i < allies.length; i++){
				allies[i].x = level[n].start.x + i * 20;
				allies[i].y = level[n].start.y;
				creature.push(allies[i])
			}
		}
		
		for(var i=0; i < creature.length; i++){
			creature[i].state = 0
			creature[i].sx = 0
		}
		start = level[n].start
		end = level[n].end
		cLevel = n
		
		//speak(level[n].title);
		//msg.voice = voices[3]
		//msg.rate = 0.5
		//msg.pitch = 5
		//msg.volume = 0.5
		//msg.volume = 0.1
		//speak(levelName);
	}
	
	
	
	function Stair(a,b,c,d){
		this.x = a
		this.y = b
		
		if(c == 'left') this.dir = -1
		else this.dir = 1
		
		this.draw = function(){
			ctx.beginPath()
			if(this.dir == 1){
				ctx.moveTo(this.x, this.y)
				ctx.lineTo(this.x + 100, this.y + 100)
			}else{
				ctx.moveTo(this.x + 100, this.y)
				ctx.lineTo(this.x, this.y + 100)
			}
			ctx.strokeStyle = 'red'
			ctx.strokeWidth = 10;
			ctx.stroke();
			ctx.closePath();
			
			
			var tH = this.y + mx - this.x
			
			ctx.fillStyle = 'green'
			ctx.fillRect(mx, tH, 10,10);
			
			
			for(var i =0; i < creature.length; i++){
				if(creature[i].x + 100 >= this.x &&creature[i].x < this.x && creature[i].y + 200 >= this.y &&creature[i].y < this.y - 100){
					ctx.fillStyle = 'yellow'
					
					console.log(creature[i].sx)
					if(this.dir == 1) {
						/*if(Math.abs(creature[i].y - ( creature[i].x - 100 - this.x + this.y)) < 50)*/ creature[i].y = creature[i].x - 100 - this.x + this.y
							tH = this.y + creature[i].x +100 - this.x
							ctx.fillRect(creature[i].x + 100, tH, 10,10);
					}else{
						/*if(Math.abs(creature[i].y + 200 - (this.x - creature[i].x - 100 + this.y)) < 50)*/ creature[i].y = this.x - creature[i].x - 100 + this.y
					}
					
				}
					
			}
			
			
			
		}
	
	}
	
	///////////////////////
	/// 	ACTIVE ENVIRONMENTAL CONSTRUCTORS
	
	function elevator(a,b,c,d){
		this.light = new spinLight(a + 45, b - 140-c, 50, 0)
		this.light2 = new Lamp(a + 45, b - 140-c);
		this.x = a;
		this.y = b - d;
		this.tx = a;
		this.ty = b - c;
		this.gx = a
		this.gy = b - c;
		
		this.maxH = d
		this.maxW = 0
		this.lifter = createWall(a,b-c, 100,30, floor[3])
		this.blocker = createWall(a,b-c, 100,100, panelHall[0])
		
		this.initialize = function(){	
			wall.push(this.lifter);
			this.blocker.setHeight(100);
			wall.push(this.blocker);
			this.blocker.draw = function(){
				//ctx.fillStyle = 'red'
				//ctx.fillRect(this.x,this.y, this.width,this.height)
			}

			this.blocker.setWidth(130)
			this.blocker.x = this.tx - 15
		}
		this.goDown = function(){
			if(this.gy + 10 <= this.y + this.maxH) this.gy = this.ty + 10//+= 10
		}
		this.goUp = function(){
			if(this.gy - 10 >= this.y) this.gy = this.ty - 10//-= 10
		}
		this.instructions = ""
		this.remove = function(){
			wall.splice(this.wallInd,2);
		}
		this.inUse = false;
		this.draw = function(){
			
			//Force Creatures into a safe position
			
				for(var i =0; i < creature.length; i++){
					if(this.ty != this.gy){
					if(Math.abs(creature[i].x + 100 - this.tx - 50) < 70 && Math.abs(creature[i].y + 200 - this.ty) < 20 ) {
						//creature[i].x = this.tx - 50 + i*5
						creature[i].y = this.ty - 200
						if(creature[i].x+70 < this.tx) creature[i].x = this.tx - 70
						else if(creature[i].x+100 > this.tx + 100) creature[i].x = this.tx - 70
					}
					}
					if(i == cS){
						/*if(dist(creature[i].x+100, creature[i].y + 200, this.x - 50, this.y) < 40) this.gy = this.y;
						else if(dist(creature[i].x+100, creature[i].y + 200, this.x + 150, this.y) < 40) this.gy = this.y;
						else if(dist(creature[i].x+100, creature[i].y + 200, this.x - 50, this.y + this.maxH) < 40) this.gy = this.y + this.maxH;
						else if(dist(creature[i].x+100, creature[i].y + 200, this.x + 150, this.y + this.maxH) < 40) this.gy = this.y + this.maxH;
						*/
					
						if(this.x - (creature[i].x + 100) < 50 &&  this.x - (creature[i].x + 100) > 0) this.gy = creature[i].y + 200
						else if(creature[i].x - this.x < 50 &&  creature[i].x - this.x > 0) this.gy = creature[i].y + 200
					}
					
					
				}
			
		
			
			ctx.globalAlpha = 0.8
			for(var i=0; i < this.maxH; i+= 10){
				ctx.fillStyle = '#202020'
				ctx.fillRect(this.x + 40, this.y + i, 20, 9);
				ctx.fillStyle = '#101010'
				ctx.fillRect(this.x + 45, this.y + i + 2, 10, 5);
			}

			ctx.globalAlpha = 1;
			
			this.lifter.y = this.ty;
			this.lifter.x = this.tx
	
			this.lifter.draw();
			this.blocker.y = this.ty + 30
			this.blocker.setHeight(this.y + this.maxH - this.ty);
			
			this.speed = 3;
			
			if (this.ty < this.gy) {
				this.ty+=this.speed;
				this.light.y+=this.speed
				this.light2.ly+=this.speed
				this.light.draw();
			}else if(this.ty > this.gy) {
				this.ty-=this.speed;
				this.light.y-=this.speed
				this.light2.ly-=this.speed
				this.light.draw();
			}else this.light2.draw();
			
			if(Math.abs(this.ty - this.gy) < this.speed) this.ty = this.gy
			
			if(this.inUse) ctx.fillText(this.instructions, this.tx + 100 - ctx.measureText(this.instructions).width/2, this.ty - 150);
				
			
			if(this.ty < this.y + this.maxH - 10){//Evelator in full swing
				ctx.drawImage(wallFeatures[1], this.x - 10, this.y + this.maxH - 100);
				ctx.drawImage(wallFeatures[2], this.x + 10, this.y + this.maxH - 100);
			}else if(this.ty < this.y + this.maxH){//animate!
				ctx.drawImage(wallFeatures[1], this.x - 10, this.y + this.maxH - 100 * (this.y + this.maxH - this.ty)/10, 100, 100 * (this.y + this.maxH - this.ty)/10);
				ctx.drawImage(wallFeatures[2], this.x + 10, this.y + this.maxH - 100 * (this.y + this.maxH - this.ty)/10, 100, 100 * (this.y + this.maxH - this.ty)/10);
			}
			
		
			ctx.drawImage(wallFeatures[4], this.tx + 25, this.ty - 120);
			
			
		}
		this.draw2 = function(){
			ctx.drawImage(wallFeatures[0], this.tx, this.ty - 100);
			ctx.drawImage(wallFeatures[2], this.tx, this.ty - 100);
			ctx.drawImage(wallFeatures[1], this.tx, this.ty - 100);
			ctx.drawImage(wallFeatures[0], this.tx, this.ty - 200);
			ctx.drawImage(wallFeatures[2], this.tx, this.ty - 200);
			ctx.drawImage(wallFeatures[1], this.tx, this.ty - 200);
		}
		this.playerOn = function(){
			//return ((creature[cS].x + creature[cS].hitBox.x + creature[cS].hitBox.width/2) - this.tx - 50) < 30 && (creature[cS].y + creature[cS].hitBox.y + creature[cS].hitBox.height - this.ty < 10);
			return creature[cS].x + 100 > this.tx && creature[cS].x < this.tx + 100 && (creature[cS].y + creature[cS].hitBox.y + creature[cS].hitBox.height - this.ty < 10)
		
		}
		
	
	}
	
	
	function CargoElevator(a,b,c,d){
		this.wallInd = wall.length
		this.blockInd = wall.length + 1;
		this.lights = []
		this.lights.push(new BigLamp(a + 60,b - c -200));
		//this.lights.push(new staticLight(a,b - c -200,20));
		//this.lights.push(new staticLight(a + 100,b - c -200,20));
		//this.lights.push(new staticLight(a + 200,b - c -200,20));
		this.light1 = new UpLamp(a + 95,b - 20 - c)
		this.light2 = new wordTicker(a + 50, b - 150 - c, "Test");
		
		this.panels = []
		this.panels.push(new Panel(a,b - 200 - c, panelHall[1], 0, 0.2))
		this.panels.push(new Panel(a + 100,b - 200 - c, panelHall[1], 0, 0.2))
		this.panels.push(new Panel(a,b - 100 - c, panelHall[0], 2, 0.2))
		this.panels.push(new Panel(a + 100,b - 100 -c , panelHall[0], 2, 0.2))
		this.x = a;
		this.y = b - d;
		this.tx = a;
		this.ty = b - c;
		this.gx = a
		this.gy = b - c;
		this.speed = 3
		this.maxH = d
		this.maxW = 0
		this.lifter = createWall(a,b-c, 100,30, floor[3])
		this.lifter2 = createWall(a + 100,b-c, 100,30, floor[3])
		this.blocker = createWall(a,b-c, 200,100, panelHall[0])
		this.initialize = function(){
			
			wall.push(this.lifter);
			
			wall.push(this.lifter2);
			this.blocker.setHeight(100);
			wall.push(this.blocker);
			
			this.blocker.draw = function(){
				//ctx.fillStyle = 'red'
				//ctx.fillRect(this.x,this.y, this.width,this.height)
			}
			
			this.blocker.setWidth(230)
			this.blocker.x = this.tx - 15
		}
		this.goDown = function(){
			if(this.gy + 10 <= this.y + this.maxH) this.gy = this.ty + 10//+= 10
		}
		this.goUp = function(){
			if(this.gy - 10 >= this.y) this.gy = this.ty - 10//-= 10
		}
		this.instructions = "UP/DOWN"
		this.remove = function(){
			wall.splice(this.wallInd,3);
		}
		this.inUse = false;
		this.draw = function(){
			//Force Creatures into a safe position
			
				for(var i =0; i < creature.length; i++){
					if(this.ty != this.gy){
						if(Math.abs(creature[i].x + 100 - this.tx - 100) < 120 && Math.abs(creature[i].y + 200 - this.ty) < 20 ) {
							creature[i].y = this.ty - 200;
							if(creature[i].x+70 < this.tx) creature[i].x = this.tx - 70
							else if(creature[i].x+100 > this.tx + 200) creature[i].x = this.tx + 100
						}
					}
					
					if(i == cS){
						if(this.x - (creature[i].x + 100) < 50 &&  this.x - (creature[i].x + 100) > 0) this.gy = creature[i].y + 200
						else if(creature[i].x -this.x - 100< 50 &&  creature[i].x - this.x -100 > 0) this.gy = creature[i].y + 200
					}
			}
			
			ctx.globalAlpha = 0.8
			for(var i=0; i < this.maxH; i+= 10){
				ctx.fillStyle = '#202020'
				ctx.fillRect(this.x + 40, this.y + i, 20, 9);
				ctx.fillRect(this.x + 140, this.y + i, 20, 9);
				ctx.fillStyle = '#101010'
				ctx.fillRect(this.x + 45, this.y + i + 2, 10, 5);
				ctx.fillRect(this.x + 145, this.y + i + 2, 10, 5);
			}

			ctx.globalAlpha = 1;
			for(var i=0; i < this.panels.length; i++) this.panels[i].draw();
			
			this.light2.draw()
			
			
			this.lifter.y = this.ty;
			this.lifter.x = this.tx
			this.lifter2.y = this.ty;
			this.lifter2.x = this.tx + 100
			
			this.blocker.y = this.ty + 30
			this.blocker.setHeight(this.y + this.maxH - this.ty);
			
			if (this.ty < this.gy) {
				this.ty+=this.speed;
				this.light1.ly+=this.speed;
				this.light2.y+=this.speed;
				for(var i=0; i < this.lights.length; i++) this.lights[i].ly+=this.speed;
				for(var i=0; i < this.panels.length; i++) this.panels[i].y+=this.speed
				this.light2.message = "DOWN"
			}else if(this.ty > this.gy) {
				this.ty-=this.speed;
				this.light1.ly-=this.speed;
				this.light2.y-=this.speed;
				for(var i=0; i < this.lights.length; i++) this.lights[i].ly-=this.speed;
				for(var i=0; i < this.panels.length; i++) this.panels[i].y-=this.speed
				this.light2.message = "UP"
			}else this.light2.message = "STOP"
			
			if(Math.abs(this.ty - this.gy) < this.speed) this.ty = this.gy
			
			
			if(this.inUse) {
				ctx.fillText(this.instructions, this.tx + 100 - ctx.measureText(this.instructions).width/2, this.ty - 150);
				//this.light1.draw()
				//for(var i=0; i < this.lights.length; i++) this.lights[i].draw();
				this.lights[0].on = true
			}else this.lights[0].on = false
			
		
			for(var i=0; i < this.lights.length; i++) this.lights[i].draw()
			
			if(this.ty < this.y + this.maxH - 10){
				ctx.drawImage(wallFeatures[1], this.x - 10, this.y + this.maxH - 100);
				ctx.drawImage(wallFeatures[2], this.x + 110, this.y + this.maxH - 100);
			}else if(this.ty < this.y + this.maxH){//animate!
				ctx.drawImage(wallFeatures[1], this.x - 10, this.y + this.maxH - 100 * (this.y + this.maxH - this.ty)/10, 100, 100 * (this.y + this.maxH - this.ty)/10);
				ctx.drawImage(wallFeatures[2], this.x + 110, this.y + this.maxH - 100 * (this.y + this.maxH - this.ty)/10, 100, 100 * (this.y + this.maxH - this.ty)/10);
			}

			ctx.drawImage(wallFeatures[4], this.tx + 75, this.ty - 120);
		
		}
		this.draw2 = function(){
			ctx.drawImage(wallFeatures[0], this.tx, this.ty - 100);
			ctx.drawImage(wallFeatures[0], this.tx + 100, this.ty - 100);
			ctx.drawImage(wallFeatures[2], this.tx + 100, this.ty - 100);
			ctx.drawImage(wallFeatures[1], this.tx, this.ty - 100);
			ctx.drawImage(wallFeatures[0], this.tx, this.ty - 200);
			ctx.drawImage(wallFeatures[0], this.tx + 100, this.ty - 200);
			ctx.drawImage(wallFeatures[2], this.tx + 100, this.ty - 200);
			ctx.drawImage(wallFeatures[1], this.tx, this.ty - 200);
		}
		this.playerOn = function(){
			//return Math.abs((creature[cS].x + creature[cS].hitBox.x + creature[cS].hitBox.width/2) - this.tx - 100) < 80 && Math.abs(creature[cS].y + creature[cS].hitBox.y + creature[cS].hitBox.height - this.ty) < 10;
			return creature[cS].x + 100 > this.tx && creature[cS].x < this.tx + 200 && (creature[cS].y + creature[cS].hitBox.y + creature[cS].hitBox.height - this.ty < 10)
		
		}
		
	
	}
	
	
	////////////////////////////////
	///////		Animated Items
	/////
	function fan(a,b,s, l, g){
		this.x = a
		this.y = b
		this.grate = g
		this.speed = s
		this.lit = l
		this.angle = 0;
		this.draw = function(){
			if(this.lit == 0){ //unlit
				ctx.fillStyle = 'black'
				ctx.beginPath()
				ctx.arc(this.x + 30,this.y+30, 30, 0, Math.PI *2);
				ctx.fill()
				ctx.closePath;
				
				ctx.translate(this.x + 30,this.y + 30);
				ctx.rotate(this.angle);
				ctx.drawImage(fanBlades2, -30, -30);
				ctx.rotate(-this.angle);
				ctx.translate(-this.x - 30, -this.y - 30);
			
				if(this.grate == 0) ctx.drawImage(fanFrame, this.x, this.y);
				else ctx.drawImage(fanFrame2, this.x, this.y);
			}else{ //lit fan!
				ctx.fillStyle = 'white'
				ctx.beginPath()
				ctx.arc(this.x + 30,this.y+30, 30, 0, Math.PI *2);
				ctx.fill()
				ctx.closePath;
				
				ctx.translate(this.x + 30,this.y + 30);
				ctx.rotate(this.angle);
				ctx.drawImage(fanBlades, -30, -30);
				ctx.rotate(-this.angle);
				ctx.translate(-this.x - 30, -this.y - 30);
			
				if(this.grate == 0) {
					ctx.drawImage(fanFrame, this.x, this.y);
					//lightRegion(this.x+30,this.y+30, 3, 1);
					
					//lightRegion(this.x+30, this.y + 130, Math.floor(5*Math.sin(this.angle) + 2.5), 1);
					for(var i= 30; i < 90; i+= 30){
					lightRegion(this.x + 30 + i*Math.cos(this.angle+0.5+Math.PI/1.5), this.y + i*Math.sin(this.angle + 0.5 + Math.PI/1.5) + 30, i/10, 15/i);
					lightRegion(this.x + 30 + i*Math.cos(this.angle+0.5+2*Math.PI/1.5), this.y + i*Math.sin(this.angle + 0.5 + 2*Math.PI/1.5) + 30, i/10, 15/i);
					lightRegion(this.x + 30 + i*Math.cos(this.angle+0.5+3*Math.PI/1.5), this.y + i*Math.sin(this.angle + 0.5 + 3*Math.PI/1.5) + 30, i/10, 15/i);
					}
				}else {
					ctx.drawImage(fanFrame3, this.x, this.y);
					lightRegion(this.x+30,this.y+30, 5, 0.5);
					for(var i= 20; i < 50; i+= 20){
					lightRegion(this.x + 30 + i*Math.cos(this.angle+0.5+Math.PI/1.5), this.y + i*Math.sin(this.angle + 0.5 + Math.PI/1.5) + 30, i/10, 10/i);
					lightRegion(this.x + 30 + i*Math.cos(this.angle+0.5+2*Math.PI/1.5), this.y + i*Math.sin(this.angle + 0.5 + 2*Math.PI/1.5) + 30, i/10, 10/i);
					lightRegion(this.x + 30 + i*Math.cos(this.angle+0.5+3*Math.PI/1.5), this.y + i*Math.sin(this.angle + 0.5 + 3*Math.PI/1.5) + 30, i/10, 10/i);
					}
				}
				//ctx.fillStyle = 'red'
				//ctx.fillRect(this.x + 30 + 30*Math.cos(this.angle+0.5+Math.PI/1.5), this.y + 30*Math.sin(this.angle +0.5 + Math.PI/1.5) + 30,10,10)
				//ctx.fillRect(this.x + 30 + 30*Math.cos(this.angle+1+3*Math.PI/1.5), this.y + 30*Math.sin(this.angle + 1+ 3*Math.PI/1.5) + 30,10,10)
				//ctx.fillRect(this.x + 30 + 30*Math.cos(this.angle+1+2*Math.PI/1.5), this.y + 30*Math.sin(this.angle + 1 + 2*Math.PI/1.5) + 30,10,10)
			
			}
			
			
			
			
		
			this.angle -= this.speed;
			if(this.angle < 0) this.angle = 2*Math.PI
		}
	
	}
	
	
	
	function AniDoor(a,b, inter, l){
		this.x = a;
		this.y = b;
		this.functional = inter==0;
		this.lit = l == 1
		this.opening = false;
		this.doorx = 0
		this.speed = 5;
		this.sound = null
		this.temp = -1;
		this.smears = []
		this.addSmear = function(){
			this.smears.push({x: this.x + rand(70) + 40, y: this.y + rand(120) + 40});
		}
		if(!this.functional){
			this.spark1 = new sparker(this.x + 45,this.y + 60)
			this.spark2 = new sparker(this.x + 45,this.y + 180)
			this.edge = 30 + rand(30);
		}
		
		this.draw = function(){			
			
			
			if(this.doorx < 0) this.doorx = 0
			else if(this.doorx > 100) this.doorx = 100
			//ctx.drawImage(doorHatch, this.x, this.y);
			//ctx.globalAlpha = 0.2
			if(this.lit)ctx.fillStyle = 'white'
			else ctx.fillStyle = 'black'
			
			ctx.fillRect(this.x + 50,this.y + 40, 100,160);
			ctx.drawImage(doorHatch, this.doorx + 50,0, 200 - this.doorx,200, this.x + 50, this.y, 200-this.doorx,200);
			
			
			for(var i=0; i < this.smears.length; i++){
				if(this.smears[i].x -this.doorx - this.x> 40)ctx.drawImage(BloodSmear[i% BloodSmear.length], this.smears[i].x -this.doorx, this.smears[i].y);
			}
			
			if(this.doorx <= 90){
				//left edge
				ctx.fillStyle = 'black'
				ctx.globalAlpha = 0.6
				ctx.fillRect(this.x+50, this.y+40, 15, 160);
				ctx.globalAlpha = 1;
			}
			//ctx.fillRect(this.x + 60, this.y + 40,70-70*(this.doorx/70), 10)//attempt at top shadow
			
			
			ctx.drawImage(doorFrame, this.x, this.y);
			
			//Door sound control
			this.distance = dist(this.x, this.y, -ctxOx + w/2, -ctxOy + h/2)
				if(this.distance < 400) {
					if(this.sound == null){
						this.temp = getSound(doorSound)
						if(this.temp != -1) {
							this.sound = doorSound[this.temp]
							this.sound.claimed = true
						}
					}
				}else {
					if(this.sound != null){
						this.sound.stop();
						this.sound.claimed = false;
						this.sound = null
					}
				}
			
			
			
			
			//Door control
			
			if(this.functional) {
				this.opening = dist(mx - ctxOx,my - ctxOy, this.x+100, this.y+100) < 70;
				
				if((this.opening && this.doorx < 90) || (!this.opening && this.doorx <98 && this.doorx > 10)){ 
					if(this.sound!= null /*&& this.oldOpening != this.opening && (this.doorx == 0 || this.doorx > 90)*/){
						this.sound.play();
						this.sound.setVolume (1- this.distance / 400); //has a 50% drop in volume
						if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
					}
				}
				
			
			}
			if(this.opening){
				this.doorx+=this.speed
				//for(var i=0; i < this.smears.length; i++)this.smears[i].x +=this.speed;
				
				if(this.doorx >= 100) this.opening = false;
				roundLight(this.x + 170,this.y + 110,10, 1.5)
			}else{
				//for(var i=0; i < this.smears.length; i++)this.smears[i].x -=this.speed;
				this.doorx-=this.speed
				//if(this.doorx <=0) this.opening = true;
			}

			if(this.lit){
				if(this.doorx > 20){
					lightRegion(this.x + 100,this.y+100, 5 + Math.floor(this.doorx/100 * 7), 1);
				}else{
					lightRegion(this.x + 100,this.y+80, 4, 0.8);
					lightRegion(this.x + 100,this.y+155, 4, 0.8);
				}
			}
			
			if(!this.functional){
				this.speed = rand(5)
				this.spark1.draw();
				this.spark2.draw();
				if(Math.random() > 0.9){
					//this.opening = !this.opening;
				}
				if(this.doorx > this.edge) this.opening = false;
				else if(this.doorx < 10) this.opening = true
			}
			

		}
	
	
	}
	
	
	/////////////////////////////
	/////	Noise Makers
	
	function talker(a,b, themessage, v){
		
		this.x = a
		this.y = b
		this.words = themessage
		this.draw = function(){
			this.distance = dist(this.x, this.y, -ctxOx + w/2, -ctxOy + h/2)
			if(!talking && this.distance < 100){
				msg.volume = (1-(this.distance / 200))
				speak(this.words);
				talking = true
			}else if(this.distance < 100){	
				msg.volume = (1-(this.distance / 200))
				//console.log(msg.volume)
			}
		
		}
	}
	
	function Alarm(a,b){
		this.x = a;
		this.y = b;
		this.sound = null;
		this.temp = -1;
		this.words = "Proceed to nearest safe zone."
		this.draw = function(){
			ctx.drawImage(wallFeatures[16], this.x,this.y)
			
			this.distance = dist(this.x, this.y, -ctxOx + w/2, -ctxOy + h/2)
			
			if(this.distance < 500) {
				if(this.sound == null){
					this.temp = getSound(alarmSound)
					if(this.temp != -1) {
						this.sound = alarmSound[this.temp]
						this.sound.claimed = true
					}
				}
				if(this.sound!= null){
					this.sound.play();
					this.sound.setVolume (1- this.distance / 500); //has a 50% drop in volume
					if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
				}
			}else {
				if(this.sound != null){
					this.sound.stop();
					this.sound.claimed = false;
					this.sound = null
				}
			}
		
		}
	
	}
	
	
	///////////////////////
	////	LIGHTING CONSTRUCTORS
	
	function BigLamp(a,b){
		this.lx = a
		this.ly = b
		this.on = true
		this.distance = 0
		this.temp = -1;
		this.sound = null// florSound[rand(florSound.length)]
		this.temp = -1
		this.draw = function(){
			if(this.on){
				ctx.drawImage(biglampLit, this.lx,this.ly);
				lightRegion(this.lx + 40, this.ly + 100, 12, 1.5);
				
				this.distance = dist(this.lx, this.ly, -ctxOx + w/2, -ctxOy + h/2)
				if(this.distance < 400) {
					if(this.sound == null){
						this.temp = getSound(florSound)
						if(this.temp != -1) {
							this.sound = florSound[this.temp]
							this.sound.claimed = true
						}
					}
					if(this.sound!= null){
						this.sound.play();
						this.sound.setVolume (1- this.distance / 400); //has a 50% drop in volume
						if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
					}
				}else {
					if(this.sound != null){
						this.sound.stop();
						this.sound.claimed = false;
						this.sound = null
					}
				}
			}else {
				ctx.drawImage(biglampOut, this.lx,this.ly);
				if(this.sound != null){
					this.sound.claimed = false
					this.sound.stop()
					this.sound = null
				}
			}
		}
	}
	
	function BigLampFlicker(a,b){
		this.lx = a
		this.ly = b
		this.on = true
		this.sound = null//florSound[rand(florSound.length)]
		this.distance = 0
		this.draw = function(){
			if(rand(65) == 1) this.on = !this.on;
			if(this.on){
				ctx.drawImage(biglampLit, this.lx,this.ly);
				lightRegion(this.lx + 40, this.ly + 100, 12, 1.5);
				this.distance = dist(this.lx, this.ly, -ctxOx + w/2, -ctxOy + h/2)
				this.distance = dist(this.lx, this.ly, -ctxOx + w/2, -ctxOy + h/2)
				if(this.distance < 400) {
					if(this.sound == null){
						this.temp = getSound(florSound)
						if(this.temp != -1) {
							this.sound = florSound[this.temp]
							this.sound.claimed = true
						}
					}
					if(this.sound!= null){
						this.sound.play();
						this.sound.setVolume (1- this.distance / 400); //has a 50% drop in volume
						if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
					}
				}else {
					if(this.sound != null){
						this.sound.stop();
						this.sound.claimed = false;
						this.sound = null
					}
				}
				
			}else {
				ctx.drawImage(biglampOut, this.lx,this.ly);
				if(this.sound != null) {
					this.sound.stop();
					this.sound.claimed = false;
				}
			}
		}
	}
	
	function BigLampDead(a,b){
		this.lx = a
		this.ly = b
		this.draw = function(){
			ctx.drawImage(biglampOut, this.lx,this.ly);
		}
	}

	function Server(a,b, o, op2){
		this.x = a
		this.y = b
		
		if(o == 0){
			this.draw = function(){
				ctx.drawImage(wallFeatures[30], this.x,this.y)
			}
		
		}else{
			this.draw = function(){
				ctx.drawImage(wallFeatures[30], this.x,this.y)
				fuzz2(this.x + 35, this.y + 5, 30,65); 
			}
		
		}
	
	
	}
	
	function Monitor(a,b, m, op2){//opt2 is so far completely unused
		this.x = a
		this.y = b
		this.message = []
		this.ani = 0
		this.maxAni = 20 + rand(10);
		this.on = true
		this.mIndex = 0;
		this.multiLine = false;
		this.cycler = 0
		var temp = ""
		var i=0;
		while(i < m.length){
			if(m[i] != ' '){
				temp += m[i];
			}else{
				this.message.push(temp);
				temp = ""
			}
			i++;
		}
		this.message.push(temp);
		
		if(this.message.length > 3) this.multiLine = true;
		this.draw = function(){
			ctx.drawImage(wallFeatures[24], this.x, this.y);
			ctx.font= '4pt wallFont'
			ctx.fillStyle = 'white'
			
			this.ani++
			if(this.ani > this.maxAni){
				this.on = !this.on
				this.ani = 0
			}
			
			if(this.message[0].length == 0 || !this.on) {
				fuzz(this.x + 20, this.y + 20, 60,33); 
				if(Math.random() < 0.2) this.on = true
			}else if(this.on){
				if(this.message.length > 5){
					for(var i = 0; i < 5; i++) ctx.fillText(this.message[i + this.mIndex], this.x + 50 - ctx.measureText(this.message[i + this.mIndex]).width/2, this.y + 25 + i*6);
					this.cycler++
					if(this.cycler > 5) {
						this.mIndex++
						this.cycler = 0;
					}
					if(this.mIndex > this.message.length-5) this.mIndex = 0;
				}else for(var i = 0; i < this.message.length; i++) ctx.fillText(this.message[i], this.x + 50 - ctx.measureText(this.message[i]).width/2, this.y + 25 + i*6);
			}
			fuzz(this.x + 15, this.y + 70, 22,12); 
			
			//Lighting
			lightRegion(this.x + 45, this.y +45, 5, 0.7);
		}
	
	}
	
	function Billboard(a,b, m, op2){//opt2 is so far completely unused
		this.x = a
		this.y = b
		this.message = []
		this.ani = 0
		this.maxAni = 20 + rand(10);
		this.on = true
		this.mIndex = 0;
		this.multiLine = false;
		this.cycler = 0
		this.backIndex = rand(posterArt.length)
		this.sloganIndex = rand(slogan.length);
		var temp = ""
		var i=0;
		
		if(m == 'random'){
			while(i < slogan[this.sloganIndex].length){
				if(slogan[this.sloganIndex][i] != ' '){
					temp += slogan[this.sloganIndex][i];
				}else{
					this.message.push(temp);
					temp = ""
				}
				i++;
			}
			this.message.push(temp);
		}else{
		
			while(i < m.length){
				if(m[i] != ' '){
					temp += m[i];
				}else{
					this.message.push(temp);
					temp = ""
				}
				i++;
			}
			this.message.push(temp);
		}
		
		if(this.message.length > 3) this.multiLine = true;
		this.draw = function(){
			ctx.drawImage(posterArt[this.backIndex], this.x, this.y);
			ctx.font= '4pt wallFont'
			ctx.fillStyle = 'white'
			
			this.ani++
			if(this.ani > this.maxAni){
				this.on = !this.on
				this.ani = 0
			}
			
			if(this.message[0].length == 0 || !this.on) {
				fuzz(this.x + 2, this.y + 2, 98, 98); 
				if(Math.random() < 0.2) {
					this.on = true
					this.backIndex = rand(posterArt.length);
				}
			}else if(this.on){
				if(this.message.length > 5){
					for(var i = 0; i < 5; i++) {
						ctx.fillStyle = 'black'
						ctx.fillText(this.message[i + this.mIndex], 1+this.x + 50 - ctx.measureText(this.message[i + this.mIndex]).width/2, this.y + 26 + i*6);
						ctx.fillStyle = 'white'
						ctx.fillText(this.message[i + this.mIndex], this.x + 50 - ctx.measureText(this.message[i + this.mIndex]).width/2, this.y + 25 + i*6);
					
					}
					this.cycler++
					if(this.cycler > 5) {
						this.mIndex++
						this.cycler = 0;
					}
					if(this.mIndex > this.message.length-5) this.mIndex = 0;
				}else{ 
					for(var i = 0; i < this.message.length; i++) {
						ctx.fillStyle = 'black'
						ctx.fillText(this.message[i], this.x + 50 - ctx.measureText(this.message[i]).width/2, this.y + 25 + i*6);
						ctx.fillStyle = 'white'
						ctx.fillText(this.message[i], this.x + 51 - ctx.measureText(this.message[i]).width/2, this.y + 26 + i*6);
		
					}
				}
			}
			//fuzz(this.x + 15, this.y + 70, 22,12); 
			
			//Lighting
			lightRegion(this.x + 45, this.y +45, 5, 0.7);
		}
	
	}
	
	function fuzz(x,y,w,h){
		ctx.fillStyle = 'white'
		for(var i=x; i < x+w; i+= 2){
			for(var j = y; j < y + h; j+=2){
				ctx.globalAlpha = Math.random();
				if(Math.random() < 0.3) ctx.fillRect(i,j,2,2);
			}
		}
		ctx.globalAlpha = 1;
	}
	
	function fuzz2(x,y,w,h){
		ctx.fillStyle = 'white'
		for(var i=x; i < x+w; i+= 2){
			for(var j = y; j < y + h; j+=2){
				ctx.globalAlpha = Math.random();
				if(Math.random() < 0.05) ctx.fillRect(i,j,2,2);
			}
		}
		ctx.globalAlpha = 1;
	}
	
	
		ctx.globalAlpha = 1;
	
		
	
	function BloodDrip(a,b){
		this.lx = a
		this.ly = b
		this.bloodAni = 0;
		this.speed = 3
		this.sCount = 0
		this.pic = bloodDrip;
		this.draw = function(){
				if(this.sCount <= 0){
					this.bloodAni++
					this.sCount = this.speed
				}
				this.sCount--;
				if(this.bloodAni > 4) this.bloodAni = 0
				ctx.drawImage(this.pic, this.bloodAni * 50,0, 50,100, this.lx, this.ly, 50,100);
		}
	}
	
	function cBelt(a,b, len, i2){
		//i2 unused
	
		this.x = a
		this.y = b
		this.l = len
		this.ani = []
		this.itemIndex = []
		for(var i=0; i < i2; i++){
			this.itemIndex.push(rand(3));
			this.ani.push(i* 50);
		}
		//this.aBelt = false;
		this.draw = function(){
			//this.aBelt = !this.aBelt;
			ctx.drawImage(wallFeatures[37], this.x,this.y-60);
			ctx.drawImage(wallFeatures[37], this.x + this.l * 50 - 50,this.y-60);
			
			for(var i=0; i < this.itemIndex.length; i++){
				if(this.itemIndex[i] == 0) ctx.drawImage(wallFeatures[41], this.x + this.ani[i], this.y-60)
				else if(this.itemIndex[i] == 1) ctx.drawImage(wallFeatures[40], this.x + this.ani[i], this.y-60)
				else if(this.itemIndex[i] == 2) ctx.drawImage(floor[2], this.x + this.ani[i], this.y-40)
			}
			
			for(var i=0; i < this.l; i++) {
				/*if(this.aBelt)ctx.drawImage(cBelt1, this.x + i * 50, this.y-50)
				else ctx.drawImage(cBelt2, this.x + i * 50, this.y-50)*/
				ctx.drawImage(wallFeatures[36], this.x + i * 50, this.y-50)
			}
			
			for(var i=0; i < this.itemIndex.length; i++){
				this.ani[i] += 2
				if(this.ani[i] > (this.l-1) * 50){
					this.ani[i] = 0;
					this.itemIndex[i] = rand(3);
				}
			}
			
		}
	}
	
	var gripperOpen = makePicture("Animations/Objects/gripOpen.png")
	var gripperClosed = makePicture("Animations/Objects/gripClosed.png")
	function tankMover(a,b, len, i2){
		//i2 unused
	
		this.x = a
		this.y = b
		this.l = len +1//Number of canisters
		this.ani = []
		this.itemIndex = []
		this.itemPicIndex = []
		this.gx = a;
		this.gy = b;
		this.gtx = a;
		this.gty = b;
		var temp = rand(len +1)
		this.blankIndex = temp
		this.grabIndex = -1;
		this.targetIndex = -1;
		this.oldIndex = -1;
		
		
		for(var i=0; i < len + 1; i++){
			this.itemIndex.push(true);
			this.itemPicIndex.push(rand(4));
		}
		
		this.itemIndex[temp] = false
		this.itemPicIndex[temp] = -1
		
		this.aniPause = 0;
		this.lifting = false;
		this.dropping = false;
		
		this.draw = function(){
			ctx.fillStyle = '#222222'
			ctx.fillRect(this.x, this.y, this.l * 100 - 100, 10);
			ctx.fillStyle = '#0F0F0F'
			ctx.fillRect(this.x + 2, this.y + 2, this.l * 100 - 104, 6);
			
			
			if(this.dropping) this.gty = this.y + 20
			
			if(this.lifting) this.gty = this.y
			
			
			//Targettting
			if(this.grabIndex < 0){//Empty claw
				while(this.targetIndex == -1) {
					this.targetIndex = rand(this.itemIndex.length);
				}
				while(!this.itemIndex[this.targetIndex] || this.targetIndex == this.oldIndex) this.targetIndex = rand(this.itemIndex.length);
				
				this.gtx = this.x + this.targetIndex*100 - 50
				
				if(Math.abs(this.gx - this.gtx) < 5){
					this.dropping = true
					this.lifting = false;
					this.gty = this.y + 20
				}
				
				if(Math.abs(this.gx - this.gtx) < 5 && Math.abs(this.gy - this.gty) < 2){
					//pick up tank
					this.dropping = false;
					this.lifting = true;
					this.grabIndex = this.itemPicIndex[this.targetIndex];
					this.itemPicIndex[this.targetIndex] = -1
				}
				
				
			}else{ //Holding a tank
				this.gtx = this.x + this.blankIndex*100 - 50
				
				//Finishing pickup
				if(Math.abs(this.gx - this.gtx) < 5 && this.lifting){
					this.dropping = false
					this.lifting = true;
					this.gty = this.y
				}
				
				if(Math.abs(this.gx - this.gtx) < 5 && Math.abs(this.gy - this.gty) < 2 && this.lifting){
				//ready to begin drop
					this.dropping = true;
					this.lifting = false;
					this.gty = this.y + 20
				}
				if(Math.abs(this.gx - this.gtx) < 5 && Math.abs(this.gy - this.gty) < 2){
				
					//Drop tank
						this.itemPicIndex[this.blankIndex] = this.grabIndex;
						this.grabIndex = -1	
					
						this.itemIndex[this.blankIndex] = true
						this.itemIndex[this.targetIndex] = false
						this.blankIndex = this.targetIndex;
						this.oldIndex = this.targetIndex;
						this.targetIndex = -1
					
						this.dropping = false;
						this.lifting = true;
						this.gty = this.y
					
				}
				
				
			}
			
			if(this.dropping) this.gty = this.y + 20
			
			if(this.lifting) this.gty = this.y
			
			if(this.aniPause <= 0){
				if(this.gy == this.gty){
					if(this.gx < this.gtx) this.gx++;
					else if(this.gx > this.gtx) this.gx--;
				}else{
					if(this.gy < this.gty) this.gy++;
					else if(this.gy > this.gty) this.gy--;
				}
			}else this.aniPause--;
			
			for(var i=0; i < this.itemIndex.length; i++){
				if(this.itemPicIndex[i] == 0) ctx.drawImage(wallFeatures[53], this.x + i * 100 - 50, this.y + 30);
				else if(this.itemPicIndex[i] == 1) ctx.drawImage(wallFeatures[54], this.x + i * 100 - 50, this.y + 30);
				else if(this.itemPicIndex[i] == 2) ctx.drawImage(wallFeatures[55], this.x + i * 100 - 50, this.y + 30);
				else if(this.itemPicIndex[i] == 3) ctx.drawImage(wallFeatures[56], this.x + i * 100 - 50, this.y + 30);
				else lightRegion(this.x + i * 100, this.y + 200, 10, 0.2);
			}
			
			if(this.grabIndex == 0) ctx.drawImage(wallFeatures[53], this.gx, this.gy + 10);
			else if(this.grabIndex == 1) ctx.drawImage(wallFeatures[54], this.gx, this.gy + 10);
			else if(this.grabIndex == 2) ctx.drawImage(wallFeatures[55], this.gx, this.gy + 10);
			else if(this.grabIndex == 3) ctx.drawImage(wallFeatures[56], this.gx, this.gy + 10);
			
			if(this.grabIndex == -1) ctx.drawImage(gripperOpen, this.gx - 10, this.gy);
			else ctx.drawImage(gripperClosed, this.gx - 10, this.gy);
			
			
		}
	}
	function Animator(a,b, p){
		this.lx = a
		this.ly = b
		this.bloodAni = 0;
		this.speed = 3
		this.sCount = 0
		this.pic = p;
		this.draw = function(){
				if(this.sCount <= 0){
					this.bloodAni++
					this.sCount = this.speed
				}
				this.sCount--;
				if(this.bloodAni > 4) this.bloodAni = 0
				ctx.drawImage(this.pic, this.bloodAni * 50,0, 50,100, this.lx, this.ly, 50,100);
		}
	}
	
	function AnimatorLarge(a,b, p){
		this.lx = a
		this.ly = b
		this.bloodAni = 0;
		this.speed = 3
		this.sCount = 0
		this.pic = p;
		this.draw = function(){
				if(this.sCount <= 0){
					this.bloodAni++
					this.sCount = this.speed
				}
				this.sCount--;
				if(this.bloodAni > 4) this.bloodAni = 0
				ctx.drawImage(this.pic, this.bloodAni * 50,0, 50,100, this.lx, this.ly, 100,100);
		}
	}
	
	function Lamp(a,b){
		this.sL = new staticLight(a+5,b+10,20)
		this.aL = new angledLight(a+5,b+10,150, 90)
		this.lx = a
		this.ly = b
		this.draw = function(){
			ctx.drawImage(lampLit, this.lx,this.ly);
			this.sL.draw();
			this.aL.draw();
			lightRegion(this.lx,this.ly, 8, 0.2);
			lightRegion(this.lx, this.ly + 130, 12, 0.2);	
		}
	}
	
	function UpLamp(a,b){
		this.sL = new staticLight(a+5,b+10,20)
		this.aL = new angledLight(a+5,b+10,150, -90)
		this.lx = a
		this.ly = b
		this.draw = function(){
			ctx.drawImage(lampLit, this.lx,this.ly);
			this.sL.draw();
			this.aL.draw();
			lightRegion(this.lx,this.ly, 8, 0.2);
			lightRegion(this.lx, this.ly - 130, 12, 0.2);	
		}
	}
	
	function GenLight(a,b,c,d){
		this.lx = a
		this.ly = b
		this.rad = c
		this.intensity = d
		this.draw = function(){
			lightRegion(this.lx,this.ly, this.rad, this.intensity);
		}
	}
	
	function deadLamp(a,b){
		this.lx = a
		this.ly = b
		this.draw = function(){
			ctx.drawImage(lampOut, this.lx,this.ly);
		}
	}
	
	function glowLamp(a,b){
		this.lx = a
		this.ly = b
		this.on = true
		this.draw = function(){
			if(this.on){
				ctx.drawImage(lampLit, this.lx,this.ly);
				lightRegion(this.lx,this.ly, 8,0.2);
			}else ctx.drawImage(lampOut, this.lx,this.ly);
		}
	}
	
	
	function FlickerLamp(a,b){
		this.sL = new staticLight(a+5,b+10,20);
		this.aL = new angledLight(a+5,b+10,150, 90);
		this.lx = a;
		this.ly = b;
		this.gX = Math.floor(a/100);
		this.gY = Math.floor(b/100);
		this.on = true;
		this.distance = 0;
		this.sound = null;//flickerSound[rand(flickerSound.length)]
		this.temp = -1;
		this.draw = function(){
			if(this.on){
				ctx.drawImage(lampLit, this.lx,this.ly);
				this.sL.draw();
				this.aL.draw();

				lightRegion(this.lx,this.ly, 8, 0.2);
				lightRegion(this.lx,this.ly + 100, 12, 0.2);
				for(var i=1; i < 5; i++) lightRegion(this.lx,this.ly + i * lightRes, i, 0.5 * 5/i);
				
				//Sound control
				this.distance = dist(this.lx, this.ly, -ctxOx + w/2, -ctxOy + h/2)
				if(this.distance < 300) {
					if(this.sound == null){
						this.temp = getSound(flickerSound)
						if(this.temp != -1) {
							this.sound = flickerSound[this.temp]
							this.sound.claimed = true
						}
					}
					if(this.sound!= null){
						this.sound.play();
						this.sound.setVolume (1- this.distance / 300); //has a 50% drop in volume
						if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
					}
				}else {
					if(this.sound != null){
						this.sound.stop();
						this.sound.claimed = false;
						this.sound = null
					}
				}
			}else {
				ctx.drawImage(lampOut, this.lx,this.ly);
				if(this.sound != null){
					this.sound.stop();
					this.sound.claimed = false;
					this.sound = null;
				}
			}
			
			if(Math.random() < 0.5){
				if(Math.random() > 0.5) this.on = !this.on
			}
		}
	}
	
	
	
	
	
	
	function generateForeGround(){
		var start = {x:-100, y: -100};
		var end = {x:w * 2, y:h * 2};
		var cPos = {x:0,y:0};
		var n = 4;
		var dir = 0; //0- UP 1-RIGHT 2-LEFT 3-DOWN
		var seedx = [];
		foreGroundDark = [];
		
		//Assumes a tile size of 100 x 100
		//Vertical seeds for pipe network
		for(var i = 0; i < n; i++) {
			seedx[i] = i * Math.round((start.x-end.x)/n);
		
			cPos = {x:start.x + i * Math.round((end.x-start.x)/n), y: start.y}
			
			while(cPos.y <= end.y && cPos.x >= start.x && cPos.x <= end.x){
			//Never goes back down to make silly loops, thus bottom edge excluded from condition
				if(dir == 0){//Go up
					foreGroundDark.push(new ForeGround(cPos.x,cPos.y, vPipe));
					cPos.y += 100;
				}else if(dir == 1){//Right
					foreGroundDark.push(new ForeGround(cPos.x,cPos.y, hPipe));
					cPos.x += 100;
				}else if(dir == 2){//Left
					foreGroundDark.push(new ForeGround(cPos.x,cPos.y, hPipe));
					cPos.x -= 100;
				}else if(dir == 3){//Down, should never happen
					foreGroundDark.push(new ForeGround(cPos.x,cPos.y, vPipe));
					cPos.y -= 100;
				}
			
			//Direction change
				if(Math.random() < 0.5){
					if(dir == 0){
					//was going upwards
						if(Math.random() < 0.5){//Go left
							foreGroundDark.push(new ForeGround(cPos.x,cPos.y, TLPipe));
							cPos.x -= 100
							dir = 2; 
						}else{ //go right
							foreGroundDark.push(new ForeGround(cPos.x,cPos.y, TRPipe));
							cPos.x += 100
							dir = 1; 
						}
					}else if( dir == 3){
					//was going downwards
						console.log("I wnet down?");
					
					
					}else if( dir == 1){
					//was headed right
						foreGroundDark.push(new ForeGround(cPos.x,cPos.y, BLPipe));
						cPos.y += 100
						dir = 0; //Set tp up
					}else{
						//was headed left
						foreGroundDark.push(new ForeGround(cPos.x,cPos.y, BRPipe));
						cPos.y += 100
						dir = 0; //set to up
					}
				}
			}
		
		}
		
	}
	
	
	
	function ForeGround(a,b,p){
		this.x = a;
		this.y = b;
		this.pic = p;//makePicture(p);
	//parax = 0
	//paray = 0
		this.draw = function(){	
			//ctx.globalAlpha = 0.8
			/*if(this.x + ctxOx - parax > -100 && this.x + ctxOx - parax < w){
				if(this.y + ctxOy - paray > -100 && this.y + ctxOy - paray < h){
					//ctx.drawImage(this.pic, this.x - parax,this.y - paray);
					ctx.drawImage(this.pic, this.x,this.y);
				}
			}*/
			if(this.x + ctxOx > -200 && this.x + ctxOx < w + 200){
				if(this.y + ctxOy > -200 && this.y + ctxOy < h + 200){
					ctx.drawImage(this.pic, this.x,this.y);
				}
			}
			//ctx.globalAlpha =1;
		}
		this.shade = function(){}
	}
	
	
	

	////////////
		function wordWall(a,b,m,s){
		this.x = a
		this.y = b
		this.message = m
		this.size = s
		this.draw = function(){
			ctx.fillStyle = '#202020'
			ctx.globalAlpha = 0.8
			ctx.font = 'bold ' + this.size + 'pt wallFont';
			
			ctx.fillText(this.message, this.x, this.y);
			ctx.globalAlpha = 1;
		}
		this.shade = function(){}
	}
	
	
	function Panel(a,b, p, s, clean){
		this.gX = Math.floor(a/100)
		this.gY = Math.floor(b/100)
		this.x = a;
		this.y = b;
		this.width = p.width;
		this.height = p.height;
		this.pic = p;
		this.shadow = s;
		this.c = clean;
		this.bright = clean
		if(s == 2){
			this.feature = BloodSmear[rand(BloodSmear.length)];
		}else{
			if(Math.random() < 0.5) this.feature = crack[rand(crack.length)];
			else this.feature = GreaseSmear[rand(GreaseSmear.length)];
		
		}
		if(Math.random() < 0.5 || clean > 0.7) this.feature = null
		this.fX = rand(100);
		this.fY = rand(100);
		var t = 255
		this.col = '#' + (Math.floor(t*clean)).toString(16)+ (Math.floor(t*clean)).toString(16)+ (Math.floor(t*clean)).toString(16)
		
		this.draw = function(){
				if(this.x + ctxOx >= -200 && this.x + ctxOx < w + 200){
				if(this.y + ctxOy >= -200 && this.y + ctxOy < h + 200){
			//Back color
			if(this.c >= 0 && this.c <= 1){
				ctx.fillStyle = this.col
				ctx.fillRect(this.x,this.y, 100, 100);
			}
			ctx.drawImage(this.pic, this.x,this.y);
			if(this.feature != null) ctx.drawImage(this.feature, this.x + this.fX, this.y + this.fY);
			ctx.fillStyle = 'black'
			ctx.globalAlpha = 0.1
			if(this.shadow == 1){
				for(var i=0; i < 10; i++) ctx.fillRect(this.x, this.y, this.pic.width, i*6); 
			}else if(this.shadow == 2){
				for(var i=0; i < 10; i++) ctx.fillRect(this.x, this.y + this.pic.height - i*6, this.pic.width, i*6); 
			}
				
			ctx.globalAlpha = 1;
			
			}
			}
		}
		this.light = 0;
		this.shade = function(){
			ctx.globalAlpha = 1- (this.bright /*+ this.light*/)
			//if(this.bright /*+ this.light*/ > 1) ctx.globalAlpha = 0
			ctx.fillStyle = 'black'
			ctx.fillRect(this.x,this.y, 100,100)
			ctx.globalAlpha = 1;
			this.light = 0; //Reset lighting effect
		}
	}
	
	
	
	
	
	
	function loadObjects(){
		numObjectsLoaded++;
	}
	function addSound(path, loop){
		var sv = new Audio(path);
		
		numObjects++;
	
		sv.addEventListener('canplaythrough', loadObjects, false);
		if(loop){
		sv.addEventListener('ended', function (){
			this.currentTime = 0;
			this.play();
			}, false);
		}else{
			sv.addEventListener('ended', function (){
				this.currentTime = 0;
				this.pause();
			}, false);
		
		}
		var result = {
			soundVar:sv,
			claimed:false,
			play:function(){
				this.soundVar.play();
			},
			pause:function(){this.soundVar.pause();},
			setVolume:function(v){this.soundVar.volume = v;},
			stop:function(){
				this.soundVar.pause();
				this.soundVar.currentTime = 0;
				this.claimed = false;
			}
		}
		return result;
	}
	
	function makePicture(path){
		var newPic = new Image();
		newPic.src= path;
		newPic.onload = loadObjects;
		numObjects++;
		return newPic;
	}
	

	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{
		
		
	//////////
	///STATE VARIABLES
	loadMainMenu();
	
	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

	//if(typeof game_loop != "undefined") clearInterval(game_loop);
	//	game_loop = setInterval(paint, 60); //old value 130
	}

	init();	
	

	function pipeBox(x,y,width, height){
	
	
		var wi = Math.floor(width/100)
		var he = Math.floor(height/100)
	
		
		ctx.drawImage(pipes[0], x-50,y-50);
		ctx.drawImage(pipes[1], x + 50 + (wi*100),y-50);
		for(var i=0; i <= (height-100); i+=100) ctx.drawImage(wallFeatures[12], x - 50,y+50 + i);
		for(var i=0; i <= (height-100); i+=100) ctx.drawImage(wallFeatures[12], x + 50 + (wi*100),y+50 + i);
		
		for(var i=0; i <= (width-100); i+=100) ctx.drawImage(pipes[4], x + 50 + i, y - 50)
		for(var i=0; i <= (width-100); i+=100) ctx.drawImage(pipes[4], x + 50 + i, y+50 + (he * 100))
		ctx.drawImage(pipes[3], x - 50,y+50 + (he * 100));
		
		ctx.drawImage(pipes[2], x + 50 + (wi*100),y+50 + (he * 100));
		/*
		ctx.drawImage(wallFeatures[12], x + 550,y+50);
		ctx.drawImage(wallFeatures[12], x + 550,y+150);
		ctx.drawImage(pipes[2], x + 550,y+250);
		
		ctx.drawImage(pipes[4], x + 50, y - 50)
		ctx.drawImage(pipes[4], x + 150, y - 50)
		ctx.drawImage(pipes[4], x + 250, y - 50)
		ctx.drawImage(pipes[4], x + 350, y - 50)
		ctx.drawImage(pipes[4], x + 450, y - 50)
		
		ctx.drawImage(pipes[4], x + 50, y + 250)
		ctx.drawImage(pipes[4], x + 150, y + 250)
		ctx.drawImage(pipes[4], x + 250, y + 250)
		ctx.drawImage(pipes[4], x + 350, y + 250)
		ctx.drawImage(pipes[4], x + 450, y + 250)
	*/
	
	}
	
	function drawPromptBox(){
		var x = w/2-300
		var y = h/2 - 160
		ctx.fillStyle = '#202020'
		ctx.fillRect(x,y, 600,300);
		
		//ctx.drawImage(floor[3], x,y);
		
		/*ctx.drawImage(wallFeatures[12], x - 50,y);
		ctx.drawImage(wallFeatures[12], x - 50,y+100);
		ctx.drawImage(wallFeatures[12], x - 50,y+200);
		
		ctx.drawImage(wallFeatures[12], x + 550,y);
		ctx.drawImage(wallFeatures[12], x + 550,y+100);
		ctx.drawImage(wallFeatures[12], x + 550,y+200);*/
		
		ctx.drawImage(pipes[0], x-50,y-50);
		ctx.drawImage(pipes[1], x + 550,y-50);
		ctx.drawImage(wallFeatures[12], x - 50,y+50);
		ctx.drawImage(wallFeatures[12], x - 50,y+150);
		ctx.drawImage(pipes[3], x - 50,y+250);
		
		ctx.drawImage(wallFeatures[12], x + 550,y+50);
		ctx.drawImage(wallFeatures[12], x + 550,y+150);
		ctx.drawImage(pipes[2], x + 550,y+250);
		
		ctx.drawImage(pipes[4], x + 50, y - 50)
		ctx.drawImage(pipes[4], x + 150, y - 50)
		ctx.drawImage(pipes[4], x + 250, y - 50)
		ctx.drawImage(pipes[4], x + 350, y - 50)
		ctx.drawImage(pipes[4], x + 450, y - 50)
		
		ctx.drawImage(pipes[4], x + 50, y + 250)
		ctx.drawImage(pipes[4], x + 150, y + 250)
		ctx.drawImage(pipes[4], x + 250, y + 250)
		ctx.drawImage(pipes[4], x + 350, y + 250)
		ctx.drawImage(pipes[4], x + 450, y + 250)
	}
	
	
	
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	/*window.requestAnimFrame = function(){
		return
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback){
		//	window.setTimeout(callback, 1000/60);
		};
	
	
	}
	*/
	
	
	var now;
	var then = Date.now();
	var interval = 1000/25
	var delta;
	function animate() {

		requestAnimFrame = window.mozRequestAnimationFrame    ||
                   window.webkitRequestAnimationFrame ||
                   window.msRequestAnimationFrame     ||
                   window.oRequestAnimationFrame
                   ;
		/*setTimeout(function(){
			requestAnimFrame(animate);
			paint();
		}, interval);*/
		requestAnimFrame(animate);
		now = Date.now()
		delta = now - then;
		
		if(delta > interval){
			then = Date.now()//now - (delta % interval);
			paint();
			//ctx.fillStyle = 'white'
			//ctx.fillText(1000/delta + " " + 1000/interval, 100, 180);
		}
	}
	
	
	animate();
	function paint()
	{
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, w, h);	
		if(Math.random() < 0.5) shimmer *= -1; 
		
	//	parax = (creature[0].x - w/2)*0.1 + ctxOx*5
	//	paray = (creature[0].y - h/2)*0.1 + ctxOy*5
		if(screen == 0){
		//Splash screen
			ctx.fillStyle = 'red'
			ctx.font = '20pt wallFont'
			ctx.fillText("Loading...", w/2 - ctx.measureText("Loading...").width/2, 200);
			ctx.fillRect(w/2 - 200, 250,400, 10);
			ctx.fillRect(w/2 - 200, 250, 400*(numObjectsLoaded/numObjects), 20);
		
			if(numObjectsLoaded >= numObjects) screen = 1;
		}else if(screen == 1){
		//Main menu
			for(var i = 0; i < wallPanels.length; i++) wallPanels[i].draw();
		for(var i = 0; i < wall.length; i++) wall[i].draw();
		
		
		
		for(var i = 0; i < lamps.length; i++) lamps[i].draw()//ctx.drawImage(lampLit, lamps[i].x, lamps[i].y);
		for(var i=0; i < rLights.length; i++)rLights[i].draw();
		for(var i=0; i < dLights.length; i++)dLights[i].draw();
		for(var i=0; i < pulseLights.length; i++)pulseLights[i].draw();
		for(var i = 0; i < creature.length; i++) creature[i].draw();
		
			for(var i=0; i < mainMenuButtons.length; i++) mainMenuButtons[i].draw();
			
			lightRegion(mx,my, 10, 0.5);
			
			//lightRegionCol(mx + 100,my, 10, 0.09, {r:0,g:100,b:0});
			shade();
		
		if(prompting){
			ctx.globalAlpha = 0.3
			ctx.fillStyle = 'black'
			ctx.fillRect(0,0,w,h);
			ctx.globalAlpha = 1;
		
			drawPromptBox();
			ctx.font = '15pt wallFont'
			ctx.fillStyle = 'white'
			if(promptAni < 100) promptAni++
			
			textBox(promptTitle[promptIndex], w/2 - ctx.measureText(promptTitle[promptIndex]).width/2, h/2 - 120, 380);
			ctx.font = '7pt wallFont'
			textBoxScroll(promptMessage[promptIndex].slice(0,Math.floor(promptAni/100*promptMessage[promptIndex].length)), w/2 -  270, h/2 - 90, 540, promptHeight);
		
			if(promptLines > promptHeight/12){
				ctx.fillStyle = '#BBBBBB'
				ctx.fillRect(w/2 - 280, h/2 - 102, 5, promptHeight)
				ctx.fillStyle = 'white';
				ctx.fillRect(w/2 - 280, h/2 - 102+ promptScroll * (promptHeight/promptLines), 5, promptHeight *((promptHeight/12)/promptLines))
			}
			
		
		
			OKButton.draw();
		}
		}else if(screen == 2){
		//Instructions
		
		}else if(screen == 3){
		//Options
		
		}else if(screen == 4){
		//cutscenes
			
			ctx.save();
		ctx.translate(ctxOx, ctxOy);	
			cutscene[scene].draw();
			cutscene[scene].frame++;
		
		
				//Level
		for(var i = 0; i < wallPanels.length; i++) wallPanels[i].draw();
		for(var i = 0; i < wall.length; i++) wall[i].draw();
		
		
		
		for(var i = 0; i < lamps.length; i++) lamps[i].draw()//ctx.drawImage(lampLit, lamps[i].x, lamps[i].y);
		for(var i=0; i < rLights.length; i++)rLights[i].draw();
		for(var i=0; i < dLights.length; i++)dLights[i].draw();
		for(var i=0; i < pulseLights.length; i++)pulseLights[i].draw();
		for(var i = 0; i < creature.length; i++) creature[i].draw();
		//for(var i=0; i < items.length; i++)items[i].draw();
		ctx.fillStyle = 'white'
		
		//Draw Foreground
		for(var i = 0; i < foreGround.length; i++) foreGround[i].draw();
		ctx.globalAlpha = 0.8;
		if(cutscene[scene].darkForeground) for(var i = 0; i < foreGroundDark.length; i++) foreGroundDark[i].draw();
		ctx.globalAlpha =1;
		
		//for(var i = 0; i < wallPanels.length; i++) wallPanels[i].shade();
		for(var i = 0; i < creature.length; i++) creature[i].sayWords();
		//Bullet Sparks
		for(var i=0; i < sparks.length;i++) sparks[i].draw();
		for(var i=0; i < sparks.length;i++){
			if(sparks[i].f > 2){
				sparks.splice(i,1);
				i--;
			}
		}
		
		//Blood Splatters
		for(var i=0; i < bloodSplat.length;i++) bloodSplat[i].draw();
		for(var i=0; i < bloodSplat.length;i++){
			if(bloodSplat[i].f > 2){
				bloodSplat.splice(i,1);
				i--;
			}
		}
		
		for(var i=0; i < bloodSplatLarge.length;i++) bloodSplatLarge[i].draw();
		for(var i=0; i < bloodSplatLarge.length;i++){
			if(bloodSplatLarge[i].f > 4){
				bloodSplatLarge.splice(i,1);
				i--;
			}
		}
		
		ctx.restore();
		
		if(cutscene[scene].shaded) shade();
			if(cutscene[scene].frame < 10){
				ctx.globalAlpha = 0.1 * (10 - cutscene[scene].frame)
				ctx.fillStyle = 'black'
				ctx.fillRect(0,0,w,h);
				ctx.globalAlpha = 1;
			}
			
			if(cutscene[scene].frame >= cutscene[scene].endFrame - 10){
				ctx.globalAlpha = 1-(0.1 * (cutscene[scene].endFrame - cutscene[scene].frame))
				ctx.fillStyle = 'black'
				ctx.fillRect(0,0,w,h);
				ctx.globalAlpha = 1;
			}
			ctx.fillStyle = 'white'
			ctx.fillText(cutscene[scene].frame + " " + cutscene[scene].endFrame, 100, 60);
		
			if(cutscene[scene].frame >= cutscene[scene].endFrame) {
				screen = 5;
				
				cutscene[scene].endScene();
			}
			
		}else if(screen == 5){ //Main Game
		//heart sound
		tStart = Date.now();
		if(heartTimer == 0) {
			heartDelay = getHeartDelay();
			if(hPump) heart1.play()
			else heart2.play()
			
			hPump = !hPump;
			heartTimer = heartDelay;
		}
		//console.log(heartDelay)
		
		heartTimer --;
		
		parax = ctxOx*0.5
		paray = ctxOy*0.5
		ctx.save();
		
		/*
		if(mx > w - 20) ctxOx-= pans;
		else if (mx < 20)ctxOx += pans;
		
		if(my > h - 20) ctxOy-= pans;
		else if (my < 20)ctxOy += pans;
		*/
		
		if(!mDown){
		
			if(mx < 100) castOx = -400
			else if(mx > w - 100) castOx = 400
			else castOx = 0
			
			dPx = creature[cS].x + 100 + ctxOx - w/2 + castOx;
			dPy = creature[cS].y + 100 + ctxOy - h/2 + castOy;
			if(dPx < -lightRes){
				ctxOx += pans - dPx/10
			}else if(dPx > lightRes)	ctxOx -= pans + dPx/10
	
			if(dPy < -lightRes){
				ctxOy += pans - dPy/10
			}else if(dPy > lightRes)	ctxOy -= pans + dPy/10
			updateMouse();
		}	
		
		if(rumble > 0){
			ctxOx += rand(rumble) - rumble/2
			ctxOy += rand(rumble) - rumble/2
			rumble--;
		}
		
		if(ctxOx > 0) ctxOx = 0
		if(ctxOy > 0) ctxOy = 0
		if(ctxOx < w * -1) ctxOx = w * -1
		if(ctxOy < h * -1) ctxOy = h * -1
		ctxOx = Math.round(ctxOx);
		ctxOy = Math.round(ctxOy);
		
		ctx.translate(ctxOx, ctxOy);
		
		for(var i=0; i < creature.length; i++) if(i != cS && creature[i].stats.health >0 && !prompting)creature[i].move();
		
		//Level
		for(var i = 0; i < wallPanels.length; i++) wallPanels[i].draw();
		for(var i = 0; i < elevators.length; i++) {
			elevators[i].inUse= elevators[i].playerOn();
			elevators[i].draw();
		}
		
		for(var i = 0; i < lamps.length; i++) lamps[i].draw()//ctx.drawImage(lampLit, lamps[i].x, lamps[i].y);
		for(var i=0; i < rLights.length; i++)rLights[i].draw();
		for(var i=0; i < dLights.length; i++)dLights[i].draw();
		for(var i=0; i < pulseLights.length; i++)pulseLights[i].draw();
		
		for(var i = 0; i < wall.length; i++) wall[i].draw();
		for(var i = 0; i < creature.length; i++) if( !prompting){
			creature[i].draw();	
			}else{//Creature is done death sequence
				if(creature[i].stats.health <= 0 && !creature[i].died){
					if(i == cS){
						ctx.fillText("Game Over!", 100 - ctxOx,100 - ctxOy)
					}else{
						creature[i].die();
					}
				}
			}
		for(var i = 0; i < elevators.length; i++) elevators[i].draw2();
		
		
		
		for(var i=0; i < items.length; i++)items[i].draw();
		//Draw Foreground
		for(var i = 0; i < foreGround.length; i++) foreGround[i].draw();
		

		lightRegion(creature[cS].x + 100, creature[cS].y+ 100, 12, 0.5);
		
		
	

		ctx.globalAlpha = 0.8
		ctx.translate(-ctxOx/10, -ctxOy/10);
		for(var i = 0; i < foreGroundDark.length; i++) foreGroundDark[i].draw();
		ctx.translate(ctxOx/10, ctxOy/10);
		ctx.globalAlpha = 1;
		for(var i = 0; i < creature.length; i++) creature[i].sayWords();
		//antiLight();
		
		//Bullet Sparks
		for(var i=0; i < sparks.length;i++) sparks[i].draw();
		for(var i=0; i < sparks.length;i++){
			if(sparks[i].f > 2){
				sparks.splice(i,1);
				i--;
			}
		}
		
		//Blood Splatters
		for(var i=0; i < bloodSplat.length;i++) bloodSplat[i].draw();
		for(var i=0; i < bloodSplat.length;i++){
			if(bloodSplat[i].f > 2){
				bloodSplat.splice(i,1);
				i--;
			}
		}
		
		for(var i=0; i < bloodSplatLarge.length;i++) bloodSplatLarge[i].draw();
		for(var i=0; i < bloodSplatLarge.length;i++){
			if(bloodSplatLarge[i].f > 4){
				bloodSplatLarge.splice(i,1);
				i--;
			}
		}
		
		ctx.restore()
		shade();
		
		
		
		
		
		//UI Stuff goes here
		ctx.fillStyle = 'white'
		ctx.font = "15pt Orbitron" 
		//paintDelay = Date.now() - tStart;
		ctx.globalAlpha = 1;
		
		//ctx.fillText(paintDelay, 100,100);
		
		for(var i = 0; i < exits.length; i++){
			if(dist(creature[cS].x + 100, creature[cS].y + 100, exits[i].x, exits[i].y) < 80){
				//ctx.fillText("Transit Point!", 100,100);
				if(exits[i].skip){
					ctx.fillText("(ENTER)", creature[cS].x + ctxOx + 100 - ctx.measureText("(ENTER)").width/2, creature[cS].y + ctxOy);
				}else{
					ctx.fillText("(ENTER)", creature[cS].x + ctxOx + 100 - ctx.measureText("(ENTER)").width/2, creature[cS].y + ctxOy);
				}
			}
		}
		
		switching = true;
		w1 = null
		w2 = null
		
		for(var i=0; i < creature[cS].weapon.length; i++){
			if(creature[cS].weapon[i] == null || creature[cS].weapon[i].useless ) switching = false;
		}
	
		if(switching){
			for(var i = 0; i < items.length; i++){
				
				if(dist(creature[cS].x + 100, creature[cS].y + 100, items[i].x, items[i].y) < 80 && items[i].weapon != null){
					for(var j= 0; j < creature[cS].weapon.length; j++){
						//console.log("  >>" + creature[cS].weapon[j].name);
						if(creature[cS].weapon[j].id == items[i].weapon.id) switching = false;
					}
					if(switching){
						w1 = items[i]
						w2 = creature[cS].weapon[creature[cS].sw]
						ctx.fillText("(E - Swap)", creature[cS].x + ctxOx + 100 - ctx.measureText("(E - Swap").width/2, creature[cS].y + ctxOy);
					}//else ctx.fillText("Nope", creature[cS].x + ctxOx + 100 - ctx.measureText("Nope").width/2, creature[cS].y + ctxOy);
				}
			}
		}
		//ctx.fillText("Switching: " + switching, creature[cS].x + ctxOx + 100, creature[cS].y + ctxOy);
		//if(w1 != null) ctx.fillText("weapon1: " + w1.name, creature[cS].x + ctxOx + 100, creature[cS].y + ctxOy - 10);
		//if(w2 != null) ctx.fillText("weapon2: " + w2.name, creature[cS].x + ctxOx + 100, creature[cS].y + ctxOy - 20);
				
		
		ctx.globalAlpha = 0.2;
		
		ctx.fillStyle = 'white'
		ctx.fillRect(8, h - 59 + creature[cS].sw * 12, 90, 10);
		ctx.globalAlpha = 1;
		
		ctx.font = '6pt wallFont'
		ctx.fillText("Weapons", 5, h - 62);
		ctx.font = '5pt wallFont'
		for(var i=0; i < creature[cS].weapon.length; i++){
			if(creature[cS].weapon[i] != null){
				ctx.fillStyle = 'white'
				ctx.fillText(creature[cS].weapon[i].name, 10, h - 50 + i *12);
				if(!creature[cS].weapon[i].useless){
					ctx.fillText("DAM: " + creature[cS].weapon[i].stats.damage, 100, h - 50 + i *12);
					if(creature[cS].weapon[i].type ==1) ctx.fillText("AMMO: " + (creature[cS].weapon[i].ammo + creature[cS].weapon[i].clip), 170, h - 50 + i *12);
				}
			
			}
		}
		
	
	
		//Allies
		ctx.fillStyle = 'white'
		var ind = 0;
		
		for(var i=0; i < creature.length; i++){
			if(creature[i].stats.type == creature[cS].stats.type && creature[i].stats.health > 0){
				ctx.fillStyle = 'white'
				if(i!= cS)ctx.globalAlpha = 0.2
				else {
					ctx.globalAlpha = 0.4
					ctx.fillRect(allyX + ind + 50, allyY, 50,50);
				}
				
				ctx.fillRect(allyX + ind, allyY, 50,50);
				//ctx.fillStyle = 'black';
				//ctx.fillRect(allyX + ind + 2, allyY + 2, 46,46)
				for(var j = 2; j < creature[i].weapon.length;j++){
					if(j == creature[i].sw) ctx.globalAlpha = 0.4
					else ctx.globalAlpha = 0.2
					ctx.fillRect(allyX + ind, allyY -12 + j* 32, 100, 30)
					ctx.globalAlpha = 1;
					ctx.drawImage(creature[i].weapon[j].IconPic, allyX + ind, allyY -12 + j* 32);
				
					ctx.globalAlpha = 0.5
					if(creature[i].weapon[j].maxCapacity > 0){
					ctx.fillStyle = '#AAAAAA'
					
					ctx.fillRect(allyX + ind, allyY -10 + j * 32, 100, 3);
					ctx.fillStyle = 'white'
					ctx.fillRect(allyX + ind + 1, allyY -9 + j * 32, 98 *(creature[i].weapon[j].ammo + creature[i].weapon[j].clip)/creature[i].weapon[j].maxCapacity, 1);
					}
					
				}
				
				ctx.globalAlpha = 1;
				
				creature[i].drawIcon(allyX + ind + 2, allyY + 2, 50,38);
				
				//Name
				ctx.font = 'italic 5pt wallFont'
				ctx.fillText(creature[i].name2, allyX + ind + 55, allyY + 10);
				ctx.font = '4pt wallFont'
				ctx.fillText(creature[i].name, allyX + ind + 55, allyY + 25);
				ctx.fillText("Lev " + creature[i].level, allyX + ind + 55, allyY + 40);
				
				ctx.fillStyle = 'black'
				ctx.globalAlpha = 0.5
				ctx.fillRect(allyX + ind + 1, allyY + 40, 50, 5);
				ctx.globalAlpha = 1
				
				
				ctx.fillStyle = '#AA0000'
				ctx.fillRect(allyX + ind, allyY + 46, 50, 3);
				ctx.fillStyle = '#FF0000'
				ctx.fillRect(allyX + ind + 1, allyY + 47, 48 * creature[i].stats.health/creature[i].stats.maxHealth, 1);
				ctx.font = 'bold4pt wallFont'
				ctx.fillText(creature[i].stats.health + " / " + creature[i].stats.maxHealth, allyX + ind + 1, allyY + 45);
				ctx.fillStyle = '#00AAAA'
				ctx.fillRect(allyX + 50 + ind, allyY + 46, 50, 3);
				ctx.fillStyle = '#00FFFF'
				ctx.fillRect(allyX + 51 + ind, allyY + 47, 48 * creature[i].exp/(creature[i].level*50), 1);
				
				
				
				
				ind += 105
			}
		}
		
		//Mini Map
		ctx.fillStyle = 'white'
		
		ctx.globalAlpha = 0.5
		
		ctx.fillRect(mapX, mapY, mapW, mapH);
		ctx.globalAlpha = 1;
		pipeBox(mapX-10, mapY-10, mapW, mapH);
		ctx.fillStyle = 'black'
		ctx.fillText(levelName, mapX,mapY-6);
		
		
		
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = 'white'
		ctx.fillRect(-50, dataY+10, 800, 100);
		
		for(var i=0; i < 5; i++){
			ctx.fillRect(mapX, mapY + mapAni, mapW, -i);
		}
		
		mapAni+=5
		
		if(mapAni > mapH + 10) mapAni = 0
		
		/*
		ctx.strokeStyle = 'red'
		ctx.beginPath(mapX + mapW/2, mapY + mapH/2)
		ctx.arc(mapX + mapW/2, mapY + mapH/2, 50, 0, Math.PI * 2);
		ctx.stroke()
		ctx.closePath();*/
		
		ctx.globalAlpha = 1;
		pipeBox(-50, dataY+10, 700, 100);
		//Selected character stats
		ctx.globalAlpha = 0.2
		ctx.fillStyle = 'white'
		ctx.fillRect(dataX-10, dataY+20,113,85)
		ctx.globalAlpha = 1
		creature[cS].drawIcon(dataX- 10, dataY+ 20, 113,85)
		
		
		ctx.font = '6pt wallFont'
		if(creature[cS].stats.type < 2) ctx.fillText("PROTOTYPE: '" + creature[cS].name2 + "' GENE-LINE: " + creature[cS].name, 110 + dataX, dataY + 40);
		else ctx.fillText("EMPLOYEE: " + creature[cS].name, 110 + dataX, dataY + 40);
		ctx.fillText("Vitals: ", 110 + dataX, dataY + 60);
		ctx.fillStyle = '#AA0000'
		ctx.fillRect(dataX + 198, dataY + 48, 204, 14);
		ctx.fillStyle = '#FF0000'
		ctx.fillRect(dataX + 200, dataY + 50, 200 * creature[cS].stats.health/creature[cS].stats.maxHealth, 10);
		
		ctx.fillStyle = 'white'
		ctx.fillText("Level " + creature[cS].level, dataX + 110, dataY + 80);
		ctx.fillStyle = '#00AAAA'
		ctx.fillRect(dataX + 198, dataY + 68, 204, 14);
		ctx.fillStyle = '#00FFFF'
		ctx.fillRect(dataX + 200, dataY + 70, 200 * creature[cS].exp/(creature[cS].level*50), 10);
		ctx.fillStyle = 'white'
		ctx.fillText(creature[cS].exp + " / " + creature[cS].level*50, dataX + 300 - ctx.measureText(creature[cS].exp + " / " + creature[cS].level*10).width / 2, dataY + 80);
		
		ctx.fillText(creature[cS].stats.health + " / " + creature[cS].stats.maxHealth, dataX + 300 - ctx.measureText(creature[cS].stats.health + " / " + creature[cS].stats.maxHealth).width / 2, dataY + 60);
		
		if(creature[cS].stats.health < 0){
			creature[cS].stats.health = 0;
			
			//Find a new character to focus on
			var bestInd = cS
			for(var i =0; i < creature.length;i++){
				if(creature[i].stats.type == creature[cS].stats.type){
					if(creature[i].stats.health > creature[bestInd].stats.health) bestInd = i;
				
				}
			}
			
			if(creature[bestInd].stats.health > 0) cS = bestInd
			else{
				//player is dead
				console.log("You are all dead.");
				makePrompt("Dead", "You have failed to escape to freedom.  ~~The Insect Hive has won.");
			}
		}
		//Available characters
		
		//Map contents
		//Walls
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'white'
		for(var i=0; i < wall.length;i++) ctx.fillRect(wall[i].x/mapD + mapX, wall[i].y/mapD + mapY, (wall[i].width/100)*mapD,(wall[i].height/100)*mapD);
		
		//ForeGRound for testing
		ctx.fillStyle = 'blue'
		//for(var i=0; i < foreGround.length;i++) ctx.fillRect(foreGround[i].x/mapD + mapX, foreGround[i].y/mapD + mapY, mapD,mapD);
		
		
		//Creatures
		ctx.fillStyle = 'red'
		for(var i=0; i < creature.length;i++) {
			if(creature[i].stats.health > 0){
				if(creature[i].stats.type != creature[cS].stats.type) ctx.fillStyle = 'red'
				else if(i != cS) ctx.fillStyle = 'white'
				else ctx.fillStyle = 'white'
				//ctx.fillRect(creature[i].x/mapD + mapX, (creature[i].y + 100)/mapD + mapY, mapD-1,mapD-1);
				mapAlpha = 1- (mapAni -(creature[i].y + 100)/mapD )/mapH;
			
				if(mapAlpha > 1) mapAlpha = 0;
				ctx.globalAlpha = mapAlpha;
			
				ctx.beginPath((creature[i].x+100)/mapD + mapX, (creature[i].y + 100)/mapD + mapY);
				for(var j =0; j < 5; j++){
					ctx.arc((creature[i].x+100)/mapD + mapX, (creature[i].y + 100)/mapD + mapY, j + mapAlpha * 2, 0, Math.PI*2);
					ctx.fill();
				}
				ctx.closePath();
			}
		}	
		
		ctx.globalAlpha = 0.3
		ctx.fillStyle = 'black'
		ctx.fillRect(mapX - ctxOx/mapD, mapY-ctxOy/mapD, mapW/2, mapH/2)
		ctx.globalAlpha = 1;
		
		//Player fire control
		if(mDown && !prompting){
			if(mx > mapX && mx < mapX + mapW && my > mapY && my < mapY + mapH){
				ctxOx = ((mx - mapX)/mapD)* -100 + w/2;
				ctxOy = ((my - mapY)/mapD)* -100 + h/2;
			}else if(false){//UI button system
			
			}else{
				if(creature[cS].fireCool <= 0 && creature[cS].canFire && creature[cS].recoil == 0 && creature[cS].reloading < 0) {
					creature[cS].fire(mx,my);
				}
			}
			
		}
			//Check for victory conditions
		if(creature[cS].collidePoint(end.x, end.y)) {
			//alert("level ended proceeding to scene: " + level[cLevel].nextScene);
			level[cLevel].endLevel()
		}
		
		if(prompting){//Main game
			ctx.globalAlpha = 0.7
			ctx.fillStyle = 'black'
			ctx.fillRect(0,0,w,h);
			ctx.globalAlpha = 1;
			drawPromptBox();
			ctx.font = '15pt wallFont'
			ctx.fillStyle = 'white'
			
			if(promptAni < 100) promptAni+=5
			if(aniFast < 10) aniFast++;
			
			//if(promptMessage[promptIndex].length < 50 || promptAni > 100) promptAni = 100;
			
			textBox(promptTitle[promptIndex], w/2 - ctx.measureText(promptTitle[promptIndex]).width/2, h/2 - 120, 380);
			ctx.font = '7pt wallFont'
			if(promptCreature[promptIndex] == null) textBoxScroll(promptMessage[promptIndex].slice(0,Math.floor(promptAni/100*promptMessage[promptIndex].length)), w/2 -  270, h/2 - 90, 570, promptHeight);
			else textBoxScroll(promptMessage[promptIndex].slice(0,Math.floor(promptAni/100*promptMessage[promptIndex].length)), w/2 -  270, h/2 - 90, 480, promptHeight);
		
			
			if(promptLines > promptHeight/12){
				ctx.fillStyle = '#BBBBBB'
				ctx.fillRect(w/2 - 280, h/2 - 102, 5, promptHeight)
				ctx.fillStyle = 'white';
				ctx.fillRect(w/2 - 280, h/2 - 102+ promptScroll * (promptHeight/promptLines), 5, promptHeight *((promptHeight/12)/promptLines))
			}
			
				
			if(promptCreature[promptIndex] != null){
				ctx.fillStyle = 'black'
				ctx.fillRect(w/2 + 230+ ((10-aniFast)/10)*300,200, 259, 194)
				
				creature[promptCreature[promptIndex]].drawIcon(w/2 + 230+ ((10-aniFast)/10)*300,200, 259, 194);
				ctx.fillStyle = 'white'
				ctx.fillText(creature[promptCreature[promptIndex]].name2, w/2 + 250+ ((10-aniFast)/10)*300,380)
				pipeBox(w/2 + 230 + ((10-aniFast)/10)*300,200, 259, 194);
			}
			OKButton.draw();
		}
		
		
		//Player control
		for(var i=0; i < keys.length && !prompting; i++){
			if(keys[i] == 38 || keys[i] == 87){
			//up
				ridingElevator = false;
				for(var j=0;j<elevators.length;j++){
					if(elevators[j].playerOn()) { //used to be inUse
						elevators[j].goUp();
						ridingElevator = true;
					}
				}
				if(!ridingElevator) creature[cS].jump();
			
			}else if(keys[i] == 39 || keys[i] == 68){
			//right
	
				creature[cS].state = 2
				if(creature[cS].stats.wing > 0 && creature[cS].falling()&& creature[cS].sx < 8)creature[cS].sx+=1
				else creature[cS].sx = creature[cS].stats.speed;
			
			}else if (keys[i]== 37 || keys[i] == 65){
			//left
				creature[cS].state = 3;
				if(creature[cS].stats.wing > 0 && creature[cS].falling() && creature[cS].sx > -8)creature[cS].sx-=1
				else creature[cS].sx =-1* creature[cS].stats.speed;
			}else if(keys[i]==40 || keys[i] == 83){
		//down
				ridingElevator = false;
				for(var j=0;j<elevators.length;j++){
				
					if(elevators[j].playerOn()) {//again, used to be inUse
						elevators[j].goDown();
						ridingElevator = true;
					}
				}
			if(!ridingElevator &&  !creature[cS].falling() && creature[cS].sy == 0)creature[cS].state = 4;
			
			}
		}
		
		
		//End main game
		}else if (screen == 6){
		//level maker
			ctx.save();
			if(ctxOx > w/2) ctxOx = w/2
			if(ctxOy > h/2) ctxOy = h/2
			if(ctxOx < w * -1.5) ctxOx = w * -1.5
			if(ctxOy < h * -1.5) ctxOy = h * -1.5
			//if(mx > w - 20) ctxOx-= 100;
			//else if (mx < 20)ctxOx += 100;
		
			//if(my > h - 20) ctxOy-= 100;
			//else if (my < 20)ctxOy += 100;
			ctx.font = '8pt wallFont'
			ctx.fillStyle = 'red'
			ctx.translate(ctxOx, ctxOy);
		
		
			//Level edge borders
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, w*2, 5);
			ctx.fillRect(0, 0, 5, h*2);
			ctx.fillRect(w*2, 0, 5, h*2);
			ctx.fillRect(0, h*2 - 5, w*2, 5);
		
		
			for(var i = 0; i < wallPanels.length; i++) wallPanels[i].draw();
			for(var i = 0; i < elevators.length; i++) {
				//elevators[i].inUse= elevators[i].playerOn();
				elevators[i].draw();
			}	
			for(var i = 0; i < wall.length; i++) wall[i].draw();
			for(var i=0; i < items.length; i++)items[i].draw();
				
			for(var i = 0; i < lamps.length; i++) lamps[i].draw()//ctx.drawImage(lampLit, lamps[i].x, lamps[i].y);
			for(var i=0; i < rLights.length; i++)rLights[i].draw();
			for(var i=0; i < dLights.length; i++)dLights[i].draw();
			for(var i=0; i < pulseLights.length; i++)pulseLights[i].draw();
			ctx.fillStyle = 'green'
			for(var i = 0; i < creature.length; i++) if(creature[i].deathF != 10) {
				creature[i].draw();
				ctx.fillText(i, creature[i].x, creature[i].y);
			}
			
			for(var i = 0; i < elevators.length; i++) elevators[i].draw2();
				
			
		
			for(var i=0; i < foreGround.length; i++)foreGround[i].draw();
			
			for(var i=0; i < bloodSplatLarge.length;i++) bloodSplatLarge[i].draw();
			for(var i=0; i < bloodSplatLarge.length;i++){
				if(bloodSplatLarge[i].f > 4){
					bloodSplatLarge.splice(i,1);
					i--;
				}
			}
	
			ctx.restore()
			if(lighting) shade()
			
			
			ctx.fillStyle = 'black'
			ctx.globalAlpha = 0.5
			ctx.fillRect(mx,my-10, 50, 10);
			ctx.fillStyle = 'white'
			ctx.fillText("(" + (mx - ctxOx) + ", " + (my - ctxOy) + ")", mx, my);
		
			ctx.font = 'bold 15pt Orbitron'
			ctx.globalAlpha =1
			ctx.fillStyle = 'green'
			for(var i=0; i < exits.length;i++){
				ctx.fillRect(exits[i].x + ctxOx, exits[i].y + ctxOy, 10,10);
				if(exits[i].skip){
					ctx.fillText("Level: " + exits[i].next,exits[i].x + ctxOx, exits[i].y + ctxOy);
				}else{
					ctx.fillText("Level: " + cutscene[exits[i].next].nextLevel,exits[i].x + ctxOx, exits[i].y + ctxOy);
				}
			}
			
			
			
		
			ctx.globalAlpha = 1;
			
			
			ctx.fillStyle = 'gray'
			BSGBox(0,0, w,50);
			BSGBox(0, 450, w, h - 450);
			
		
			
			
			
			config.draw();
			gridToggle.draw();
			lighter.draw();
			rightSlide.draw();
			leftSlide.draw();
			loadEdit.draw();
			
			ctx.fillStyle = 'white'
			ctx.fillText("Level / Cutscene Index: " + cLevel, 300,20);
			ctx.fillText("Canvas Offset: " + ctxOx + "x" + ctxOy, 300,30);
			ctx.fillText("Cursor: " + "(" + (mx -ctxOx) + "," + (my - ctxOy) + ")", 300,40);
			ctx.font = '8pt Orbitron'
			ctx.fillStyle = 'white'
			ctx.fillText("1 - Panels", 600, 10);
			ctx.fillText("2 - Wall/Obstacles", 600, 20);
			ctx.fillText("3 - Lamps / Lights", 600, 30);
			ctx.fillText("4 - Items", 600, 40);
			ctx.fillText("5 - Foreground Items", 600, 50);
			ctx.fillText("6 - Creatures", 750, 10);
			ctx.fillText("7 - Sounds Objects", 750, 20);
			ctx.fillText("8 - Biological", 750, 30);
			ctx.fillText("9 - Animated Objects", 750, 40);
			ctx.fillText("T - Test Level", 750, 50);
		
			if(selEdit == 1){
				ctx.fillText("Panels", 50, h - 120);
				for(var i=0; i < bgOptions.length; i++) {
					bgOptions[i].draw();
				}
			}else if (selEdit == 2){
				ctx.fillText("Walls & Obstacles", 50, h - 120);
				for(var i=0; i < wOptions.length; i++) {
					wOptions[i].draw();
				}
			}else if (selEdit == 3){
				ctx.fillText("Lighting", 50, h - 120);
				for(var i=0; i < lOptions.length; i++) {
					lOptions[i].draw();
				}
			}else if (selEdit == 4){
				ctx.fillText("Items", 50, h - 120);
				for(var i=0; i < iOptions.length; i++) {
					iOptions[i].draw();
				}
			}else if (selEdit == 5){
				ctx.fillText("Foreground", 50, h - 120);
				for(var i=0; i < fOptions.length; i++) {
					fOptions[i].draw();
				}
			}else if (selEdit == 6){
				ctx.fillText("Creatures", 50, h - 120);
				for(var i=0; i < cOptions.length; i++) {
					cOptions[i].draw();
				}
			}else if (selEdit == 7){
				ctx.fillText("Sound Objects", 50, h - 120);
				for(var i=0; i < sOptions.length; i++) {
					sOptions[i].draw();
				}
			}else if (selEdit == 8){
				ctx.fillText("Biological Objects", 50, h - 120);
				for(var i=0; i < bOptions.length; i++) {
					bOptions[i].draw();
				}
			}else if (selEdit == 9){
				ctx.fillText("Animated Objects", 50, h - 120);
				for(var i=0; i < aOptions.length; i++) {
					aOptions[i].draw();
				}
			}
			
			//Mini Map
		ctx.fillStyle = 'white'
		ctx.fillText(levelName, mapX,mapY);
		ctx.globalAlpha = 0.5
		
		ctx.fillRect(mapX, mapY, mapW, mapH);
		
		//Map contents
		//Walls
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'white'
		for(var i=0; i < wall.length;i++) ctx.fillRect(wall[i].x/mapD + mapX, wall[i].y/mapD + mapY, (wall[i].width/100)*mapD-1,(wall[i].height/100)*mapD-1);
		
		//ForeGRound for testing
		ctx.fillStyle = 'blue'
		//for(var i=0; i < foreGround.length;i++) ctx.fillRect(foreGround[i].x/mapD + mapX, foreGround[i].y/mapD + mapY, mapD,mapD);
		
		
		//Creatures
		ctx.fillStyle = 'red'
		for(var i=0; i < creature.length;i++) {
			if(creature[i].stats.type != creature[cS].stats.type) ctx.fillStyle = 'red'
			else if(i != cS) ctx.fillStyle = 'green'
			else ctx.fillStyle = 'blue'
			ctx.fillRect(creature[i].x/mapD + mapX, (creature[i].y + 100)/mapD + mapY, mapD-1,mapD-1);
		
		}
		
		ctx.globalAlpha = 0.3
		ctx.fillStyle = 'black'
		ctx.fillRect(mapX - ctxOx/mapD, mapY-ctxOy/mapD, mapW/2, mapH/2)
		ctx.globalAlpha = 1;
			
			
		//Grid lines
		if(gridLines){
		ctx.strokeStyle = 'white'
		ctx.globalAlpha = 0.2
		for(var i=50; i < 450; i+= 10){
			if(i%100 == 0) ctx.globalAlpha = 0.6
			else ctx.globalAlpha = 0.2
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.lineTo(w, i);
			ctx.stroke();
			ctx.closePath();
		}
		for(var i=0; i < w; i+= 10){
			if(i%100 == 0) ctx.globalAlpha = 0.6
			else ctx.globalAlpha = 0.2
			ctx.beginPath();
			ctx.moveTo(i, 50);
			ctx.lineTo(i, 450);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.strokeStyle = 'black';
		ctx.globalAlpha = 1;
			
		}
		}
		ani--;
		if(ani < 0) ani = aniDelay;
		
		
		
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	
	function Shadow(x,y,p,shim){
		this.x = x
		this.y = y
		this.pic = p
		this.shimmer = shim;
		this.draw = function(){
			if(this.shimmer) ctx.drawImage(this.pic, this.x + shimmer, this.y)
			else ctx.drawImage(this.pic, this.x, this.y)
		}
	}
	
	//var wBack1 = makePicture('Animations/Objects/waterBack1.png')
	//var wBack2 = makePicture('Animations/Objects/waterBack2.png')
	
	function WaterLight(a,b, s, inte){
	
		this.x = a
		this.y = b
		this.size = s;
		//this.waveAni = [];
	//	this.intensity = inte;
		this.lighting = Math.round(this.size/lightRes)
		//this.picAni = 0
	//	for(var i=0; i < this.size/40; i++) {
			//this.waveAni.push(20*i + rand(2) + 10)
			//this.x.push(a - 10 + rand(20));
		//}
		//this.slider = 0;
		//this.sliderS = 10;
		this.draw = function(){
			lightRegion(this.x, this.y, this.lighting, 0.2 + Math.random()/10);
		/*
		
			this.picAni += 1;
			if(this.picAni > 9) this.picAni = 0;
			//ctx.fillText(0.5 * Math.sin(this.picAni * Math.PI*2 / 10) + 0.5, 
			/*ctx.globalAlpha = (0.5 * Math.sin(this.picAni * Math.PI*2 / 10) + 0.5)/2
			ctx.drawImage(wBack1, this.x - 50, this.y - 100);
			ctx.globalAlpha = (1- ctx.globalAlpha)/2
			ctx.drawImage(wBack2, this.x - 50, this.y - 100);
			
			this.slider+= this.sliderS
			if(this.slider > 20 || this.slider < -20) this.sliderS *= -1
			//ctx.drawImage(wBack1, this.x - 50 + this.slider, this.y - 100);
			//ctx.drawImage(wBack2, this.x - 50 - this.slider, this.y - 100);
			
			ctx.strokeStyle = 'white'
			for(var j=0; j < this.waveAni.length; j++){
				ctx.globalAlpha = (1-(this.waveAni[j]/this.size))/this.intensity;
				for(var i=0; i < 5; i++){
					ctx.beginPath()
					ctx.lineWidth = i/2
					//ctx.arc(this.x,this.y, i/2+ this.waveAni[j], Math.PI,0)
					//ctx.arc(this.x,this.y, i/2+ this.waveAni[j], Math.PI + Math.random()*(Math.PI/4),-Math.random()*(Math.PI/4))
					
					//ctx.arc(this.x + this.waveAni[j], this.y, i, Math.PI, Math.PI/2);
					ctx.stroke();
					ctx.closePath();
					/*
					for(var k=0.25; k < 6.25; k++){
					ctx.globalAlpha = Math.random()/10
					ctx.beginPath()
					ctx.lineWidth = i/2
					ctx.arc(this.x,this.y, i/2+ this.waveAni[j], -(k+0.5)*Math.PI/6, -k*Math.PI/6 )
					ctx.stroke();
					ctx.closePath();
					
					}
				}
				this.waveAni[j] *= 1.1
				if(this.waveAni[j] > this.size) this.waveAni[j] = 10+ rand(3)
			}
			ctx.globalAlpha = 1
			*/
		}
	}
	
	
	
	
	
	
	
	
	
	function shade(){	
		var Ox = ctxOx % lightRes - Math.floor(lightRes/2)
		var Oy = ctxOy % lightRes - Math.floor(lightRes/2)
		var t1, t2;
		var baseShade = 0.9//0.85
		
		var extraShade = heartTimer / heartDelay;
		ctx.fillStyle = 'black'
		
		if(heartDelay < 8){
			baseShade += extraShade*0.4
			ctx.fillStyle = '#' + (Math.floor(extraShade * 128)).toString(16)+ '0000';
		}

		for(var i = 0; i < lightGrid.length; i++){
			for(var j = 0; j < lightGrid[i].length; j++){
				if(1- lightGrid[i][j] < 0) ctx.globalAlpha = 0
				else ctx.globalAlpha = 1 - lightGrid[i][j]
				
				//ctx.fillStyle = lightGridC[i][j].getCol();
				ctx.globalAlpha = ctx.globalAlpha * baseShade
			
				ctx.fillRect(i*lightRes + Ox,j*lightRes + Oy,lightRes,lightRes);
				
				
				lightGrid[i][j] = 0
				//lightGridC[i][j].r = 0
				//lightGridC[i][j].g = 0
				//lightGridC[i][j].b = 0
			}
		}
	}

	/////////////////////
	/////	CURSCENES
	///////////////////
	
	
	
	function Cutscene(n){
		this.title = n
		this.frame = 0;
		this.endFrame = 50;
		this.nextLevel = 0;
		
		this.sc = cutscene.length
		
		this.lev = new Level(n);
		this.Rlev = new Level(n);
		this.darkForeground = true;
		this.shaded = false;
		this.draw = function(){
			ctx.fillStyle = 'black'
			ctx.fillRect(0,0,w,h);
			ctx.fillStyle = 'white'
			ctx.font = '18pt Orbitron'
			
			ctx.fillText(this.title, w/2 - ctx.measureText(this.title).width /2,h/2);
			ctx.fillText(this.frame + "/" + this.endFrame, 50,50);
		}
		this.load = function(){
			
			stopSound();
			wallPanels = this.lev.wallPanels
			wall = this.lev.wall
			creature = this.lev.creature
			lamps = this.lev.lamps
			dLights = this.lev.dLights
			rLights = this.lev.rLights
			pulseLights = this.lev.pulseLights
			foreGround = this.lev.foreGround
			elevators = this.lev.elevators
			for(var i =0; i < elevators.length; i++) elevators[i].initialize();
		resetMapGrid();
		
		
		
		
		/*
		for(var i=0; i < creature.length; i++){
			creature[i].state = 0
			creature[i].sx = 0
		}*/
		
		
		var tx = 0;
		var ty = 0;
		for(var i= 0 ; i < wallPanels.length; i++){
			tx = (wallPanels[i].x+50)/100
			ty = (wallPanels[i].y+50)/100
			mapGrid[Math.floor(tx)][Math.floor(ty)].panels.push(i)
		}
		
		for(var i= 0 ; i < wall.length; i++){
			tx = (wall[i].x+50)/100
			ty = (wall[i].y+50)/100
			if(tx >= 0 && tx < mapGrid.length && ty >=0 && ty < mapGrid[0].length){
				mapGrid[Math.floor(tx)][Math.floor(ty)].wall = true
			}
		}
		scene = this.sc
		}
		this.endScene = function(){
			loadLevel(this.nextLevel);
			if(allies.length >0){	
				for(var i=0; i < allies.length; i++){
				//if(allies[i].stats.type == creature[cS].stats.type){
					allies[i].x = level[this.nextLevel].start.x + i * 20;
					allies[i].y = level[this.nextLevel].start.y;
				//creature.push(allies[i])
					//level[this.nextLevel].creature.push(allies[i]);
				//}
				}
			}
		}
	}
	
	//Intro Level
	cutscene.push(new Cutscene("Prototype"));
	
	cutscene[0].lev.wallPanels.push(new Panel(200,200, panelHall[1], 1,0.8));
cutscene[0].lev.wallPanels.push(new Panel(300,200, panelHall[1], 1,0.8));
cutscene[0].lev.wallPanels.push(new Panel(400,200, panelHall[1], 1,0.8));
cutscene[0].lev.wallPanels.push(new Panel(500,200, panelHall[0], 1,0.8));
cutscene[0].lev.wallPanels.push(new Panel(600,200, panelHall[1], 1,0.8));
cutscene[0].lev.wallPanels.push(new Panel(700,200, panelHall[1], 1,0.8));
cutscene[0].lev.wallPanels.push(new Panel(200,300, panelHall[1], 2,0.8));
cutscene[0].lev.wallPanels.push(new Panel(300,300, panelHall[1], 2,0.8));
cutscene[0].lev.wallPanels.push(new Panel(400,300, panelHall[1], 2,0.8));
cutscene[0].lev.wallPanels.push(new Panel(500,300, panelHall[1], 2,0.8));
cutscene[0].lev.wallPanels.push(new Panel(700,300, panelHall[1], 2,0.8));
cutscene[0].lev.wallPanels.push(new Panel(600,300, panelHall[0], 2,0.8));
cutscene[0].lev.wallPanels.push(new ForeGround(700,300, wallFeatures[9], 0,0.5));
cutscene[0].lev.wallPanels.push(new ForeGround(270,210, wallFeatures[3], 0,0.5));
cutscene[0].lev.wallPanels.push(new ForeGround(500,250, wallFeatures[10], 0,0.5));
cutscene[0].lev.wallPanels.push(new ForeGround(600,300, wallFeatures[10], 0,0.5));

	cutscene[0].lev.wallPanels.push(new ForeGround(200,200,door[0], 2, 0.5));
	//Floor
	for(var i=200; i <= 700; i+=100) cutscene[0].lev.wall.push(createWall(i,400,100,30,floor[0]));
	
	//Ceiling
	for(var i=200; i <= 700; i+=100) cutscene[0].lev.wall.push(createWall(i,200,100,30,ceiling[0]));

	
	
	cutscene[0].lev.foreGround.push(new ForeGround(460,300, foreGPic[0]));
	cutscene[0].lev.foreGround.push(new ForeGround(450,300, foreGPic[0]));
	cutscene[0].lev.foreGround.push(new ForeGround(440,300, foreGPic[0]));
	cutscene[0].lev.foreGround.push(new ForeGround(430,300, foreGPic[0]));
	cutscene[0].lev.foreGround.push(new ForeGround(510,280, foreGPic[4]));
	//cutscene[0].lev.foreGround.push(new Panel(560,300, wallFeatures[0]));
	
	cutscene[0].lev.foreGround.push(new ForeGround(560,300, foreGPic[1]));
	cutscene[0].lev.lamps.push(new BigLamp(260,220));
	cutscene[0].lev.lamps.push(new Lamp(470,240));
	cutscene[0].lev.lamps.push(new Lamp(620,240));
	cutscene[0].lev.lamps.push(new Lamp(720,240));

	cutscene[0].lev.foreGround.push(new ForeGround(550,280, foreGPic[8]));
	//cutscene[0].lev.wallPanels.push(new Panel(400,200, panelHall[5], 0,0.5));
	
	//Characters
	cutscene[0].lev.creature.push(baseLineMutant(500, 200, 0)); //type 0= insect, 1- reptile
	cutscene[0].lev.creature.push(Scientist(200, 200, 3)); //type 0= insect, 1- reptile
	cutscene[0].lev.creature[1].taimer = {x:w, y:200} 
	
	cutscene[0].lev.creature.push(Marine(670, 200, 3));
	cutscene[0].lev.creature[2].aimer= {x:w/2 + 100, y: 280}
	cutscene[0].lev.creature[2].taimer = cutscene[0].lev.creature[2].aimer
	cutscene[0].lev.wallPanels.push(new wordWall(410,280, 'ROOM 21-B',5));
	cutscene[0].lev.wallPanels.push(new wordWall(410,270, 'EXAM',5));

	cutscene[0].draw = function(){
	
		
		if(this.frame == 5){
			creature[2].sw = 2
			creature[1].speak("Monitor, begin recording.");
			cutscene[0].lev.creature[0].taimer= {x:cutscene[0].lev.creature[1]+100, y: cutscene[0].lev.creature[1]+200}
			cutscene[0].lev.creature[1].state = 2
			cutscene[0].lev.creature[1].sx = 5
		}else if(this.frame == 10) {
			cutscene[0].lev.creature[0].state = 4
			//creature[0].sw = 1; // select stringer!
			cutscene[0].lev.creature[2].taimer= {x:w/2 + 100, y: 320}
		}else if(this.frame == 20) {
			
		}else if(this.frame == 35) {
			
		}else if(this.frame == 42) {
			creature[1].state = 0;
			creature[1].sx=0;
		}else if(this.frame == 55) {
			creature[1].state = 4;
			
			//creature[1].speak("Administering neural test.");
		}else if(this.frame == 60){
			
		creature[0].speak("Hello Doctor.");
			creature[0].taimer = {x:w/2, y:h-200};
			
		}else if(this.frame == 70){
			creature[2].taimer= {x:w/2, y: h}
			creature[2].light = false;
			
		}else if(this.frame == 75){
			
		}else if(this.frame == 80){
			//creature[1].speak("NOTE: Subject's mood seems to have improved.")
	
		}else if(this.frame == 90){
			creature[0].speak("I'm sorry about our last session.")
		}else if(this.frame == 110){
			
		}else if(this.frame == 160) {
			creature[1].speak("T-927, I would like to ask you some questions.")	
		}else if(this.frame == 220) {
			creature[1].speak("");
			creature[0].speak("Of course Doctor...");
		}else if(this.frame == 250) {
			creature[0].speak("We're friends.  I trust you.");
		}else if(this.frame == 290) {
			creature[0].speak("");
			creature[1].speak("That's good.");
		}else if(this.frame == 315) {
			creature[1].speak("Lets begin shall we?");
			
		}else if(this.frame == 335) {
			creature[0].taimer = {x: creature[1].x + 100, y: creature[1].y + 90}
			creature[0].aimer = creature[0].taimer;
			creature[0].sw = 1;
			creature[0].fire();
			creature[1].stats.health = 0;
			creature[1].speak("");
			bloodSplat.push(createBlood(creature[0].aimer.x, creature[0].aimer.y));
			//Add some wall splatters
			wallPanels.push(new Panel( w/2 - 30, h/2 - 20,BloodSmear[0], 0, 2))
		}else if(this.frame == 336){
			wallPanels.push(new Panel( w/2 - 35, h/2 - 20 + rand(5),BloodSmear[0], 0, 2))
			bloodSplat.push(createBlood(creature[0].aimer.x + rand(10), creature[0].aimer.y+ rand(10)));
		}else if(this.frame == 337){
			wallPanels.push(new Panel( w/2 - 45, h/2 - 20 + rand(10),BloodSmear[0], 0, 2))
			bloodSplat.push(createBlood(creature[0].aimer.x+ rand(10), creature[0].aimer.y+ rand(10)));
		}else if(this.frame == 338){
			wallPanels.push(new Panel( w/2 - 55, h/2 - 20 + rand(15),BloodSmear[0], 0, 2))
			bloodSplat.push(createBlood(creature[0].aimer.x+ rand(10), creature[0].aimer.y+ rand(10)));
		}else if(this.frame == 339){
			bloodSplat.push(createBlood(creature[0].aimer.x+ rand(10), creature[0].aimer.y+ rand(10)));
		}else if(this.frame == 340){
			bloodSplat.push(createBlood(creature[0].aimer.x, creature[0].aimer.y+ rand(10)));
		}else if(this.frame == 350){
			//lamps.push(new spinLight(520,220,50,0));
			lamps.splice(1,3)
			lamps.push(new spinLight(470,240,50,0));
			lamps.push(new spinLight(620,240,50,0));
			lamps.push(new spinLight(720,240,50,0));
		
	
			//creature[0].jump();
		}else if(this.frame == 355){
			creature[2].light = true;
			creature[0].move();
			creature[0].state = 2;
			creature[0].sx = 10
			creature[2].taimer = {x:creature[0].x+100, y: creature[0].y + 70};
			creature[0].sy = -10
			creature[0].y -= 5
			creature[2].state = 4
		}else if(this.frame == 360){
			creature[0].fire();
			//creature[0].state = 0
			creature[0].sx = 10
			creature[0].sy = -10
			creature[0].y -= 5
			//creature[2].move();
			creature[2].fire();
		}
		
	}
	
	cutscene[0].nextLevel = 1;
	cutscene[0].darkForeground = false;
	cutscene[0].shaded = true;
	cutscene[0].endFrame = 365
	
	
	cutscene.push(new Cutscene('The Air is Better Outside'))

	cutscene[1].endFrame = 50;
	cutscene[1].nextLevel = 2;
	cutscene[1].darkForeground = false;
	
	cutscene.push(new Cutscene('It smells too clean in here'))

	cutscene[2].endFrame = 50;
	cutscene[2].nextLevel = 3;
	cutscene[2].darkForeground = false;
	
	
	//////////////
	/////////////
	
	function baseLineMutant(x,y, t){
		var result = createCreature(80,45,40,155);
		result.x = x
		result.y = y
		result.stats.health = 100
		result.weapon.push(Punch0());
		if(t == 0) result.weapon.push(insectHeal());
		else result.weapon.push(acidSpray());
		result.weapon.push(blank());
		result.weapon.push(blank());
	
		result.stats.torso = 0
		result.stats.type = t;
		result.stats.abdomen = 0;
		result.stats.armorPlate = false
		if(t == 0)result.stats.legs= 0
		else result.stats.legs = 0;
		result.stats.hair = rand(4) + 1;
		result.stats.wing = 0;
		result.speak("");
		
		if(t == 0){//insect
			result.portStats.eyes = rand(3);
		
		}else if(t == 1){//reptile
			result.portStats.eyes = rand(3);
		
		}
	
	result.portStats.nose = rand(4);
	result.portStats.mouth = rand(4);
		return result
	}
	
	function Marine(x,y, t){
		var result = createCreature(80,45,40,155);
		result.name = ranks[rand(ranks.length)] + " " + HNames[rand(HNames.length)]
		result.x = x
		result.y = y
		result.stats.health = 100
		result.sw = 0;
		result.greets.push("Like white on rice.");
		result.greets.push("Moving on target.");
		result.greets.push("Clearing sector.");
		result.greets.push("Hostile sighted!");
		result.greets.push("Cleaning house!");
		result.greets.push("Here we go.");
		if(Math.random() < 0.5) {//Male
			if(Math.random() < 0.5) {
				result.stats.torso = 0
			}else {
				result.stats.torso = 1
			}
		}else {//Female
			if(Math.random() < 0.5) {
				result.stats.torso = 2
			}else {
				result.stats.torso = 3
			}
		}
		result.portStats.mouth = rand(3)
		result.portStats.eyebrow = rand(2)
		result.portStats.nose = rand(4)
		
		
		result.stats.type = t;
		result.stats.abdomen = 0;
		temp = rand(4)
		if(temp == 0) result.stats.legs= 0;
		else if(temp == 1)result.stats.legs= 4;
		else if(temp == 2)result.stats.legs= 5;
		else if(temp == 3)result.stats.legs= 6;
		
		if(Math.random() < 0.5) result.stats.hair = 7
		else result.stats.hair = 0;
		result.stats.wing = 0;
		result.speak("");
		result.weapon.push(MarinePunch());
		result.weapon.push(MarinePunch());
		if(Math.random() > 0.5)result.giveGun(SMG(), 2);
		else result.giveGun(RIFLE(), 2);
		//result.weapon.push(PISTOL());
		
		result.giveGun(PISTOL(), 3);
		
		//result.weapon.push(null);
	//	if(t == 0) result.weapon.push(MarinePISTOL());
	//	else result.weapon.push(MarinePISTOL());

	//result.weapon.push(RIFLE());
		return result
	}
	
		
	function Scientist(x,y, t){
		var result = createCreature(80,45,40,155);
		result.name = "Dr. " + HNames[rand(HNames.length)]
		result.x = x
		result.y = y
		result.stats.health = 100
		result.sw = 0;
		result.greets.push("Please no more!");
		result.greets.push("We're sorry!");
		result.greets.push("Please!");
		var temp = 0
		if(Math.random() < 0.5) {//male
			result.stats.torso = 4
			result.stats.hair = 0;
		}else {//Female
			temp = rand(2)
			if(temp == 0) result.stats.torso = 5
			else result.stats.torso = 6
			
			temp = rand(3)
			if(temp == 0)result.stats.hair = 1;
			else if (temp == 1) result.stats.hair = 2;
			else result.stats.hair = 6;
		}
		result.portStats.mouth = rand(3)
		result.portStats.nose = rand(4)
		result.portStats.eyebrow = rand(2)
		result.stats.type = t;
		result.stats.abdomen = 0;
		result.stats.legs= 1
		
		result.stats.wing = 0;
		result.speak("");
		//result.giveGun(blank(), 0);
		//result.weapon.push(PISTOL());
		result.weapon.push(blank()); //disarming the scientists
		
	

		return result
	}
	
	function ScientistArmed(x,y, t){
		var result = createCreature(80,45,40,155);
		result.name = "Dr. " + HNames[rand(HNames.length)]
		result.x = x
		result.y = y
		result.stats.health = 100
		result.sw = 0;
		result.greets.push("Please no more!");
		result.greets.push("We're sorry!");
		result.greets.push("Please!");
		var temp = 0
		if(Math.random() < 0.5) {//male
			result.stats.torso = 4
			if(rand(2) == 0) result.stats.hair = 0;
			else result.stats.hair = 8;
		}else {//Female
			temp = rand(3)
			if(temp == 0) result.stats.torso = 5
			else /*if(temp == 1)*/ result.stats.torso = 6
			//else result.stats.torso = 7
			
			//if(result.stats.torso != 7){//has helmet
				temp = rand(4)
				if(temp == 0)result.stats.hair = 1;
				else if (temp == 1) result.stats.hair = 2;
				else if (temp == 2) result.stats.hair = 6;
				else result.stats.hair = 8;
			//} else result.stats.hair = 0;
		}
		result.portStats.mouth = rand(3)
		result.portStats.nose = rand(4)
		result.portStats.eyebrow = rand(2)
		result.stats.type = t;
		result.stats.abdomen = 0;
		if(rand(3) == 0)result.stats.legs= 2
		else result.stats.legs= 1
		result.stats.wing = 0;
		result.speak("");
		//result.giveGun(blank(), 0);
		//result.weapon.push(PISTOL());
		temp = rand(2)
		if(temp == 0) result.weapon.push(sciHammer()); 
		else result.weapon.push(sciPunch()); 
		return result
	}
	
	
	function Weapon(){
		this.oX;//Marks center of rotation
		this.oY;
		this.pX = 0;//Default poistion is on shoulder, this poistion is relative to that
		this.pY = 0;
		this.type;	//0- melee, 1-bullet
		this.pic;
		this.IconPic = null;
		this.name = "DNE";
		this.firePic = [];
		this.clip = 0;
		this.ammo = 0;
		this.capacity = 0;
		this.maxCapacity = 0;
		this.id = -1; 
		this.result//no idea what this does?
		this.stats = {damage:0, range:-1, coolDown:10, burst:1}
		this.accuracy = 10
		this.useless = false;
		this.drop = function(){
		
		}
		this.sound = null;
	}
	
	
	/////////////////////////////////////////////////
	////////////////////////////////	WEAPON LIBRARY
	////////////////////////////////////////
	
	function updateWeapon(w,t){
		w.firePic = []
		if(t == 0 || t == 1){//mutant
			if(w.id == pistolID){
				w.IconPic = iconPistol;
				w.pic = pistolPic
				w.firePic.push(pistolFlash[0]);
				w.firePic.push(pistolFlash[1]);
			}else if(w.id == SMGID){
				w.IconPic = iconSMG;
				w.pic = SMGPic
				w.firePic.push(SMGFlash[0]);
				w.firePic.push(SMGFlash[1]);
			}else if(w.id == rifleID){
				w.IconPic = iconRifle;
				w.pic = riflePic
				w.firePic.push(rifleFlash[0]);
				w.firePic.push(rifleFlash[1]);
				w.firePic.push(rifleFlash[2]);
			}
		
		}else if(t == 3){//marine	
			if(w.id == pistolID){
				w.IconPic = iconPistol;
				w.pic = pistolPicMarine
				w.firePic.push(pistolFlashMarine[0]);
				w.firePic.push(pistolFlashMarine[1]);
			}else if(w.id == SMGID){
				w.IconPic = iconSMG;
				w.pic = SMGPicMarine
				w.firePic.push(SMGFlashMarine[0]);
				w.firePic.push(SMGFlashMarine[1]);
			}else if(w.id == rifleID){
				w.IconPic = iconRifle;
				w.pic = riflePicMarine
				w.firePic.push(rifleFlashMarine[0]);
				w.firePic.push(rifleFlashMarine[1]);
				w.firePic.push(rifleFlashMarine[2]);
			}
		
		}
	
	
	}
	
	function RIFLE(){
		var result = new Weapon();
		result.name = "Rifle";
		result.oX = -10
		result.oY = -10
		result.type = 1;
		result.IconPic = iconRifle
		result.pic = riflePic
		result.firePic.push(rifleFlash[0]);
		result.firePic.push(rifleFlash[1]);
		result.firePic.push(rifleFlash[2]);
		result.stats = {damage:30, range:-1, coolDown:20, burst:3,singleHand:false}
		result.ammo = 60;
		result.maxCapacity = 150
		result.capacity = 30;
		result.clip = 15;
		result.id = rifleID
		result.accuracy = 70
		result.drop = function(a,b){
			items.push(rifleItem(a,b));
			items[items.length-1].ammo = result.clip + result.ammo
		}
		result.sound = rifleSound;
		return result;
	}
	
	function SMG(){
		var result = new Weapon();
		result.name = "SMG";
		result.oX = -10
		result.oY = -10
		result.type = 1;
		result.IconPic = iconSMG;
		result.pic = SMGPic
		result.firePic.push(SMGFlash[0]);
		result.firePic.push(SMGFlash[1]);
		result.stats = {damage:15, range:-1, coolDown:8, burst:2,singleHand:false}
		result.ammo = 40;
		result.capacity = 30;
		result.clip = 5;
		result.id = SMGID
		result.accuracy = 10
		result.drop = function(a,b){
			items.push(smgItem(a,b));
			items[items.length-1].ammo = result.clip + result.ammo
		}
		result.maxCapacity = 200
		result.sound = smgSound;
		return result;
	}
	
	function blank(){
		var result = new Weapon();
		result.name = "EMPTY";
		result.useless = true;
		result.oX = -10
		result.oY = -10
		result.type = 0;
		result.IconPic = blankPic;
		result.pic = blankPic
		//result.firePic.push(SMGFlash[0]);
		//result.firePic.push(SMGFlash[1]);
		result.stats = {damage:0, range:-1, coolDown:6, burst:2,singleHand:false}
		result.ammo = 40;
		result.capacity = 30;
		result.clip = 5;
		result.id = SMGID;
		result.accuracy = 10;
		return result;
	}
	



	function PISTOL(){
		var result = new Weapon();
		result.name = "Pistol";
		result.id = pistolID
		result.oX = -10
		result.oY = -10
		result.type = 1;
		result.IconPic = iconPistol
		result.pic = pistolPic
		result.firePic.push(pistolFlash[0]);
		result.firePic.push(pistolFlash[1]);
		result.stats = {damage:15, range:-1, coolDown:10, burst:1,singleHand:true}
		result.ammo = 40;
		result.maxCapacity = 80;
		result.capacity = 10;
		result.clip = 5;
		result.accuracy = 10
		result.drop = function(a,b){
			items.push(pistolItem(a,b));
			items[items.length-1].ammo = result.clip + result.ammo
		}
		result.sound = pistolSound;
		return result;
	}
	
	

	function insectHeal(){
		var result = new Weapon();
		result.name = "Proboscis (Heal)";
		result.oX = -10
		result.oY = -10
		result.pX = 13
		result.pY = -10
		result.type = 3;
		result.id = 3
		result.pic = null;//makePicture("Animations/Objects/Weapons/iHeal.png");
		result.firePic.push(iHealPic[0]);
		result.firePic.push(iHealPic[1]);
		result.firePic.push(iHealPic[2]);
		result.firePic.push(iHealPic[3]);
		result.firePic.push(iHealPic[4]);
		result.firePic.push(iHealPic[5]);
		result.stats = {damage:5, range:150, coolDown:30, burst:1,singleHand:true}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		return result;
	}
	
	
	function acidSpray(){
		var result = new Weapon();
		result.name = "Acid Spray";
		result.oX = -10
		result.oY = -10
		result.pX = 13
		result.pY = -10
		result.type = 3;
		result.id = 3
		result.pic = null;
		result.firePic.push(acidPic[0]);
		result.firePic.push(acidPic[1]);
		result.firePic.push(acidPic[2]);
		result.firePic.push(acidPic[3]);
		result.firePic.push(acidPic[4]);
		result.firePic.push(acidPic[5]);
		result.firePic.push(acidPic[6]);
		result.stats = {damage:20, range:150, coolDown:30, burst:1,singleHand:true}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		return result;
	}
	
	
	
	function MaggotHead(){
		var result = new Weapon();
		result.name = "Mandibles";
		result.oX = -10
		result.oY = -10
		result.pX = 15
		result.pY = -20
		result.type = 0;
		result.pic = mHeadPics[0]
		result.firePic.push(mHeadPics[1]);
		result.firePic.push(mHeadPics[1]);
		result.firePic.push(mHeadPics[2]);
		result.stats = {damage:5, range:80, coolDown:30, burst:1,singleHand:true}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 4
		return result;
	}
	
	function MarinePunch(){
		var result = new Weapon();
		result.name = "Fist";
		result.oX = -10
		result.oY = -10
		result.type = 0;
		result.pic = marinePunchPics[0]
		result.firePic.push(marinePunchPics[1]);
		result.firePic.push(marinePunchPics[2]);
		result.firePic.push(marinePunchPics[3]);
		result.firePic.push(marinePunchPics[2]);
		result.stats = {damage:15, range:80, coolDown:20, burst:1,singleHand:false}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 5
		return result;
	}
	function sciHammer(){
		var result = new Weapon();
		result.name = "Sledge";
		result.oX = -45
		result.oY = -50
		
		result.type = 0;
		result.pic = sciHammerPics[0]
		result.firePic.push(sciHammerPics[1]);
		result.firePic.push(sciHammerPics[2]);
		result.firePic.push(sciHammerPics[3]);
		result.firePic.push(sciHammerPics[4]);
		result.firePic.push(sciHammerPics[4]);
		result.firePic.push(sciHammerPics[2]);
		result.firePic.push(sciHammerPics[1]);
		result.stats = {damage:50, range:80, coolDown:10, burst:5,singleHand:false}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 5
		return result;
	}
	function sciPunch(){
		var result = new Weapon();
		result.name = "Bone Saw";
		result.oX = -10
		result.oY = -10
		result.type = 0;
		result.pic = sciPunchPics[0]
		result.firePic.push(sciPunchPics[1]);
		result.firePic.push(sciPunchPics[0]);
		result.firePic.push(sciPunchPics[1]);
		result.firePic.push(sciPunchPics[0]);
		result.stats = {damage:30, range:80, coolDown:10, burst:1,singleHand:false}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 5
		return result;
	}
	
	function Monster1Punch(){
		var result = new Weapon();
		result.name = "Claw";
		result.oX = -10
		result.oY = -10
		result.type = 0;
		result.pic = mPunchPics[0]
		result.firePic.push(mPunchPics[1]);
		result.firePic.push(mPunchPics[2]);
		result.stats = {damage:10, range:80, coolDown:20, burst:1,singleHand:false}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 5
		return result;
	}
	
		function Monster2Punch(){
		var result = new Weapon();
		result.name = "Claw";
		result.oX = -10
		result.oY = -10
		result.type = 0;
		result.pic = mPunchPics2[0]
		result.firePic.push(mPunchPics2[1]);
		result.firePic.push(mPunchPics2[2]);
		result.firePic.push(mPunchPics2[3]);
		
		result.stats = {damage:8, range:80, coolDown:25, burst:1,singleHand:false}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 5
		return result;
	}
	
	
	function Punch0(){
		var result = new Weapon();
		result.name = "Fists";
		result.oX = -10
		result.oY = -10
		result.type = 0;
		result.pic = punchPics[0]
		result.firePic.push(punchPics[1]);
		result.firePic.push(punchPics[2]);
		result.firePic.push(punchPics[3]);
		result.stats = {damage:10, range:80, coolDown:10, burst:3,singleHand:false}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 6
		return result;
	}
	
	
	function PunchInsect(){
		var result = new Weapon();
		result.name = "Insect Fists";
		result.oX = -10
		result.oY = -10
		result.type = 0;
		result.pic = punchInsectPics[0];
		result.firePic.push(punchInsectPics[1]);
		result.firePic.push(punchInsectPics[2]);
		result.firePic.push(punchInsectPics[3]);
		result.stats = {damage:15, range:80, coolDown:10, burst:1,singleHand:false}
		result.ammo = 0;
		result.capacity = 0;
		result.clip = 0;
		result.id = 7
		return result;
	}
	
	
	function Item(a,b,p){
		this.id = -1 // if not -1 then is an ammo to be matched
		this.x = a
		this.y = b
		this.pic = p //dimensions are 100 x 30 (same as for floors)
		this.draw = function(){
			ctx.drawImage(this.pic, this.x, this.y);
		}
		this.collideCreature = function(c){
			return c.collidePoint(this.x,this.y) || c.collidePoint(this.x + 100,this.y) || c.collidePoint(this.x,this.y+ 30) || c.collidePoint(this.x + 100,this.y + 30)
		}
		this.collect = function(c){
			if(this.health > 0){
				if(c.stats.health + this.health < c.stats.maxHealth){
					c.stats.health += this.health;
					this.health = -1;
				}else{
					this.health -= c.stats.maxHealth - c.stats.health;
					c.stats.health = c.stats.maxHealth;
				}
			}
			
			if(this.health < 0 && this.weapon == null) this.x = -1000

			
			
			var pickupWeapon = -1;
			var alreadyPresent = false;
			for(var i =0; i < c.weapon.length; i++){
				if(c.weapon[i] == null || c.weapon[i].useless) pickupWeapon = i; //a slot is available
				else if(c.weapon[i].id == this.id) alreadyPresent = true;//Weapon is already present
			}
			
		
			if(alreadyPresent){
			for(var i=0; i < c.weapon.length; i++){
				
				if(c.weapon[i] != null){
					if(c.weapon[i].id == this.id) {
					
						var taking = c.weapon[i].maxCapacity - c.weapon[i].ammo - c.weapon[i].clip
						var having = this.ammo 
						if(this.weapon != null) having += this.weapon.clip + this.weapon.ammo
						
						if(taking < 0) taking = 0;
						
						//console.log("taking: " + taking + "    having: " + having);
						
						
						if(taking > having) taking = having;
						if(taking < 0) taking = 0;
						c.weapon[i].ammo += taking
						
						if(this.weapon != null){//Has a weapon attached
							if(having > 0 && taking > 0) c.speak(taking + " " + this.weapon.name + " rounds.");
							
						}
						
						
						this.ammo -= taking;
						
						if(this.ammo < 0) {
							//console.log("ITem ammo stash spent, borrowing from item weapon object.");
							this.weapon.ammo += this.ammo
							this.ammo = 0
							if(this.weapon.ammo > 0) {
								//console.log("Weapon over borrowed, going for its clip now..");
								this.weapon.clip += this.weapon.ammo
								this.weapon.ammo = 0;
								if(this.weapon.clip < 0) this.weapon.clip = 0;//console.log("Total math failure!");
							}
						}
						
						//console.log("Result for item.  Ammo: " +this.ammo + " " + this.weapon.clip + " " + this.weapon.ammo)
						//Assuming that a negative ammo is okay as the weapon itself will have the shortfall
						pickupWeapon = -1;//Ammo harvested, in matching weapon
					}
				}
			}
			}
			//Ammo not harvested
			//empty slot is available
			//console.log(alreadyPresent + " " + pickupWeapon);
			if(pickupWeapon != -1 && this.weapon != null && !alreadyPresent){
				updateWeapon(this.weapon, c.stats.type);
				c.weapon[pickupWeapon] = this.weapon;
				c.speak("A " + this.weapon.name + "!");
				if(c.sw == 0 || c.sw == 1) c.sw = pickupWeapon;
				this.x = -1000
			}else if(pickupWeapon == -1 && this.weapon != null && !alreadyPresent){
				c.speak(this.weapon.name + " here.");
			}
				
			
			this.specialCollect();
		}
		this.health = 0
		this.ammo = 0
		this.weapon = null
		this.specialCollect = function(){
		//This space left intentionally blank
		
		}
	
	}
	function armorItem(a,b){
		var result = new Item(a,b, iconArmor);
		result.id = -1;
		result.health = 0;
		result.weapon = null;
		
		result.collect = function(c){
			if(c.stats.armorPlate == false && c.stats.torso < 4){
				c.stats.armorPlate = true
				this.x = -1000
			}
		}
		return result;
	}
	
	function medItem(a,b){
		var result = new Item(a,b, iconMed);
		result.id = -1;
		result.health = 20;
		result.weapon = null;
		return result;
	}
	
	function pistolItem(a,b){
		var result = new Item(a,b, iconPistol);
		result.id = pistolID;
		result.ammo = 25;
		result.weapon = PISTOL();
		return result;
	}
	
	function smgItem(a,b){
		var result = new Item(a,b, iconSMG);
		result.id = SMGID;
		result.ammo = 25;
		result.weapon = SMG();
		return result;
	}
	
	function rifleItem(a,b){
		var result = new Item(a,b, iconRifle);
		result.id = rifleID;
		result.ammo = 25;
		result.weapon = RIFLE();
		return result;
	}
	
	///////////////
	//// Traps - On collision with a player, spring and perform verbs!
	
	function Trap(a,b,p, play){
		var result = new Item(a,b,p);

		if(play){//Trap is for player eyes only
			result.collideCreature = function(c){
				return c == creature[cS] && (c.collidePoint(this.x-20,this.y) || c.collidePoint(this.x + 20,this.y) || c.collidePoint(this.x-20,this.y+ 30) || c.collidePoint(this.x + 20,this.y + 30))
			}
		}
		result.collect = function(){
			makePrompt("This is a trap.", "Boom. .. Boom.... Boom?");
			this.collect = function(){};
		}
		return result;
	}
	
	function steamTrap(a,b){
		var result = new Trap(a,b, blankPic, true)
		
		result.collect = function(){
			dLights.push(new steamJet(this.x,this.y));
			this.x = -1000
	
		}
		return result
	}
	
	function messageTrap(a,b,p, messt, mess){
		var result = Trap(a,b,p, true);
		result.message = mess
		result.title = messt
		result.collect = function(){
			makePrompt(this.title, this.message); 
			this.x = -1000
		}
		
		return result;
	}
	
		
	function rumbler(a,b,p, dur, perm){
		var result = Trap(a,b,p, true);
		result.dur = dur
		
		result.timer = 0;
		
		if(perm == 0){
			result.collect = function(){
				rumble = this.dur;
				this.x = -1000
			}
		}else{
			result.collect = function(){
				/*if(this.timer == 0){
					rumble = this.dur;
					this.timer = 100;
				}else this.timer--;*/
				rumber = this.dur;
				
			}
		
		
		}
		
		return result;
	}
	
	
	
	function spawner(a,b, type, lev, r){
		this.x = a
		this.y = b
		this.type = type
		this.rate = r
		this.counter = 0
		this.spawnx = a;
		this.spawny = b;
		this.lev = lev;
		
		this.draw = function(){
			this.counter++
			if(screen == 6) this.counter = -1
			if(this.counter >= this.rate){
				this.counter = 0;
				if(this.type == 0){//spawn insect
					if(this.lev == 0)creature.push(LowInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
					else if(this.lev == 1)creature.push(MedInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
					else if(this.lev == 2)creature.push(HighInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
					else if(this.lev == 3)creature.push(Bug(this.spawnx - 120 + rand(40),this.spawny-100,0));
					else if(this.lev == 4)creature.push(Maggot(this.spawnx - 120 + rand(40),this.spawny-100,0));
					else if(this.lev == 5)creature.push(BugSmall(this.spawnx - 120 + rand(40),this.spawny-100,0));
				}else if(this.type == 1){//spawn reptile
					if(this.lev == 0)creature.push(LowReptile(this.spawnx - 120 + rand(40),this.spawny-100,1));
					else if(this.lev == 1)creature.push(MedReptile(this.spawnx - 120 + rand(40),this.spawny-100,1));
					else creature.push(HighReptile(this.spawnx - 100,this.spawny-120 + rand(40),1));
				}else if(this.type == 2){//spawn scientist
					if(this.lev == 0)creature.push(Scientist(this.spawnx - 120 + rand(40),this.spawny-100,2));
					else if(this.lev == 1)creature.push(Scientist(this.spawnx - 120 + rand(40),this.spawny-100,2));
					else creature.push(Scientist(this.spawnx - 100,this.spawny-120 + rand(40),2));
				}else if(this.type == 3){//spawn marine
					if(this.lev == 0)creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,2));
					else if(this.lev == 1)creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,2));
					else creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,2));
				}
			}
		
		}

	}
	
	
		function spawnTrap(a,b,p, type, lev, spawnloc){
		var result = Trap(a,b,p, true);
		result.message = ""
		result.title = ""
		result.pic = blankPic
		result.type = type
		result.lev = lev
		
		var spawnx = ""
		var spawny = ""
		var i =0;
		while(i < spawnloc.length && spawnloc[i] != ','){
			if(spawnloc[i] != ',') {
				spawnx += spawnloc[i];
			}
			i++;
		}
		i++
		while(i < spawnloc.length){
			if(spawnloc[i] != ',')	spawny += spawnloc[i];
			i++;
		}
		
		result.spawnx = Number(spawnx);
		result.spawny = Number(spawny);
		
		result.collect = function(){
		
			if(this.type == 0){//spawn insect
				if(this.lev == 0)creature.push(LowInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 1)creature.push(MedInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 2)creature.push(HighInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 3)creature.push(Bug(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 4)creature.push(Maggot(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 5)creature.push(BugSmall(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 6)creature.push(worm(this.spawnx - 120 + rand(40),this.spawny-100,0));
		
			}else if(this.type == 1){//spawn reptile
				if(this.lev == 0)creature.push(LowReptile(this.spawnx - 120 + rand(40),this.spawny-100,1));
				else if(this.lev == 1)creature.push(MedReptile(this.spawnx - 120 + rand(40),this.spawny-100,1));
				else creature.push(HighReptile(this.spawnx - 100,this.spawny-120 + rand(40),1));
			}else if(this.type == 2){//spawn scientist
				if(this.lev == 0)creature.push(Scientist(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else if(this.lev == 1)creature.push(ScientistArmed(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else creature.push(ScientistArmed(this.spawnx - 100,this.spawny-120 + rand(40),3));
			}else if(this.type == 3){//spawn marine
				if(this.lev == 0)creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else if(this.lev == 1)creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,3));
			
			}
			this.x = -1000
		}
		
		return result;
	}
	
	/////////////////////////////////////////////////
	////////////////////////////////////////////////
	///////////////////////////////////////////////
	
	
	function Maggot(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.greeting = addSound('Sounds/maggotGreeting.ogg');
		result.weapon.push(MaggotHead());
		result.weapon.push(insectHeal());
		result.stats.health = 100;
		result.stats.torso = 5;
		result.stats.legs= 2;
		result.stats.abdomen = 1;
		result.stats.hasArms = false;
		result.stats.wing = 1
		result.stats.hair = -1
		result.stats.type = t
		result.sw = 1
		return result
	}
	
	function Bug(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.greeting = addSound('Sounds/bugGreeting.ogg');
		result.weapon.push(Monster2Punch());
		result.weapon.push(insectHeal());
		result.stats.health = 50;
		result.stats.maxHealth = 50;
		result.stats.torso = 6;
		
			result.stats.legs= 2 + rand(1);
			result.stats.abdomen = rand(3);
		
		
		result.stats.hasArms = false;
		if(Math.random() < 0.5) result.stats.wing = 1
		else result.stats.wing = 0
		result.stats.hair = -1
		result.stats.type = t
		result.sw = 0
		return result
	}
	
	
	function worm(a,b,t){
		var result = createCreature(-50,-25,100,60);
		result.x = a;
		result.y = b;
		result.length = 10;
		result.spacing = 10;
		result.wiggleAni = 10;
		result.fireAni=0;
		result.hide = 0;
		
		result.aimer.x = a;
		result.aimer.y = b;
		
		result.stats.health = 350
		result.stats.maxHealth = 350
		
		result.draw = function (){
			this.wiggleAni--
			if(this.wiggleAni < 0) this.wiggleAni = 10;
			var angle = -Math.PI/2

			if(this.x != this.aimer.x) angle = Math.atan((this.y - this.aimer.y) / (this.x - this.aimer.x))

			var dirx = Math.cos(angle)
			var diry = Math.sin(angle)
			var distance = dist(this.x, this.y, this.aimer.x, this.aimer.y);
			
			
			if(this.x == this.aimer.x && this.y < this.aimer.y){
				dirx = 0;
				diry = 1;
			}else if(this.x == this.aimer.x && this.y > this.aimer.y){
				dirx = 0;
				diry = -1;
			}

			if(this.x > this.aimer.x) {
				dirx *= -1
				diry *= -1
			}
			
			
			var targetID = -1
			var bestD = w;
			//targeting
			
			for(var i=0; i < creature.length;i++){
				if(creature[i].stats.type != this.stats.type && creature[i].stats.health >0){
					if(dist(this.x,this.y, creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width/2, creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height/2) < bestD){
						bestD = dist(this.x,this.y, creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width/2, creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height/2)
						targetID = i;
					}
				}
			}
			if(targetID == -1) this.taimer = {x:mx - ctxOx, y:my-ctxOy}
			else this.taimer = {x:creature[targetID].x + creature[targetID].hitBox.x + creature[targetID].hitBox.width/2, y:creature[targetID].y + creature[targetID].hitBox.y + creature[targetID].hitBox.height/2}
			
			if(this.aimer.x < this.taimer.x -4) this.aimer.x+=4
			else if(this.aimer.x > this.taimer.x+4) this.aimer.x-=4
			
			if(this.aimer.y < this.taimer.y-4) this.aimer.y+=4
			else if(this.aimer.y > this.taimer.y+4) this.aimer.y-=4
			
			
			//distance check
			if(distance > this.length * this.spacing){
				this.hide++;
				if(this.hide > this.length) this.hide = this.length;
				this.taimer.x = this.x + dirx * this.length * this.spacing
				this.taimer.y = this.y + diry * this.length * this.spacing
				distance = this.length * this.spacing;
				this.fireAni = 0
			}else if(this.stats.health > 0){//Fire! Damage is a go!.
				this.hide--
				if(this.hide <0)this.hide = 0;
				this.stats.health += 1
				if(this.stats.health > this.stats.maxHealth) this.stats.health = this.stats.maxHealth;
				if(dist(this.taimer.x, this.taimer.y, this.aimer.x, this.aimer.y) < 30 && targetID >= 0) {
					creature[targetID].stats.health-=5;
					this.fireAni++
					if(this.fireAni > 3) this.fireAni = 0
				}
			}
			
			for(var i=0; i < this.length - this.hide; i++)ctx.drawImage(wormBody[(i+Math.floor(this.wiggleAni/2))%4], i*2 + this.x + i* dirx* distance/this.spacing - 50, this.y + i * diry * distance/this.spacing + (this.spacing*(i/this.spacing)*Math.sin((this.wiggleAni + i)*this.length*this.spacing)) +i - 25, 100 - i * 4, 50 - i*2  );
		
			ctx.translate(this.x, this.y);
			//ctx.rotate(headAngle)
			if(this.stats.health > 0) ctx.drawImage(wormHead[this.fireAni], -50 + (this.length-this.hide)* dirx* distance/this.spacing, - 25 + i * diry * distance/this.spacing + ((this.length-this.hide)*Math.sin((this.wiggleAni + this.length)*(this.length-this.hide)*this.spacing)));
			else ctx.drawImage(wormHead[4 + rand(3)], -50 + (this.length-this.hide)* dirx* distance/this.spacing, - 25 + i * diry * distance/this.spacing + ((this.length-this.hide)*Math.sin((this.wiggleAni + this.length)*(this.length-this.hide)*this.spacing)));
			
			//ctx.rotate(-headAngle);
			ctx.translate(-this.x, -this.y);
		}
		result.drawIcon = function(){}
		result.drawBody = function(){}
		result.move = function(){}
	
		return result
	}
	
	function EggLayer(a,b,t,l){
		var result = createCreature(-50,-25,100,60);
		result.x = a + 50;
		result.y = b + 50;
		result.length = 10;
		result.spacing = 10;
		result.wiggleAni = 10;
		result.fireAni=0;
		result.hide = 0;
		result.spawnCount = 50;
		result.aimer.x = a;
		result.aimer.y = b;
		result.ax = 0;
		result.ay = 0;
		result.stats.health = 350
		result.stats.maxHealth = 350
		result.spawnPts = [];
		result.spawnIndex = 0;
		for(var i=-3; i <= 1; i++) result.spawnPts.push(i * 50);
		result.draw = function (){
			
			var angle = -Math.PI/2

			if(this.x != this.aimer.x) angle = Math.atan((this.y - this.aimer.y) / (this.x - this.aimer.x))

			var dirx = Math.cos(angle)
			var diry = Math.sin(angle)
			var distance = dist(this.x, this.y, this.aimer.x, this.aimer.y);
			
			
			if(this.x == this.aimer.x && this.y < this.aimer.y){
				dirx = 0;
				diry = 1;
			}else if(this.x == this.aimer.x && this.y > this.aimer.y){
				dirx = 0;
				diry = -1;
			}

			if(this.x > this.aimer.x) {
				dirx *= -1
				diry *= -1
			}
			
			
		
		
			
			if(this.aimer.x < this.taimer.x -4) this.ax += 0.1//this.aimer.x+=4
			else if(this.aimer.x > this.taimer.x+4) this.ax -= 0.1//this.aimer.x-=4
			
			if(this.aimer.y < this.taimer.y-4) this.ay += 0.1//this.aimer.y+=4
			else if(this.aimer.y > this.taimer.y+4) this.ay -= 0.1 //this.aimer.y-=4
			
			if(this.ay > 2) this.ay = 2
			else if(this.ay < -2) this.ay = -2
			
			if(this.ax > 2) this.ax = 2
			else if(this.ax < -2) this.ax = -2
			
			this.aimer.x += this.ax
			this.aimer.y += this.ay
			
			//distance check
			if(distance > 150){//this.length * this.spacing){
				this.hide++;
				if(this.hide > this.length) this.hide = this.length;
				this.taimer.x = this.x + dirx * this.length * this.spacing
				this.taimer.y = this.y + diry * this.length * this.spacing
				distance = this.length * this.spacing;
				this.fireAni = 0
			}else if(this.stats.health > 0){//Fire! Damage is a go!.
				this.hide--
				if(this.hide <0)this.hide = 0;
				this.stats.health += 1
				if(this.stats.health > this.stats.maxHealth) this.stats.health = this.stats.maxHealth;
				if(dist(this.taimer.x, this.taimer.y, this.aimer.x, this.aimer.y) < 30) {
					//insert code to lay an egg here
					this.ax *=0.8
					this.ay *= 0.8
					if(this.spawnCount < 80){
						this.wiggleAni--
						if(this.wiggleAni < 0) this.wiggleAni = 10;
					}
					
					if(this.spawnCount > 0) this.spawnCount--;
					
					if(this.spawnCount == 0){
						this.spawnCount = 100;
						
						wallPanels.push(new Egg(this.x + this.spawnPts[this.spawnIndex], this.y + 50, 0,5));
						
						this.spawnIndex = rand(this.spawnPts.length)//+= 1
						//if(this.spawnIndex >= this.spawnPts.length) this.spawnIndex = 0;
						
					}
					this.fireAni++
					if(this.fireAni > 3) this.fireAni = 0
				}
			}
			if(this.spawnCount > 80) this.taimer = {x:this.x + this.spawnPts[this.spawnIndex], y:this.y}
			else if(this.spawnCount > 0) this.taimer = {x:this.x + this.spawnPts[this.spawnIndex] + 50, y:this.y + 85}
			
			ctx.drawImage(eggBase, this.x-50, this.y-25);
			var wig = 0
			for(var i=0; i < this.length - this.hide; i++){
				wig = Math.sin((this.wiggleAni + i)*this.length*this.spacing)
				ctx.drawImage(eggBody[(i+Math.floor(this.wiggleAni/2))%4], i*2 + this.x + i* dirx* distance/this.spacing - 50 - wig, this.y + i * diry * distance/this.spacing + (this.spacing*(i/this.spacing)*wig) +i - 25, 100 - i * 4 + wig*2, 100 - i*2);
		
			}
			ctx.translate(this.x, this.y);
			//ctx.rotate(headAngle)
			if(this.stats.health > 0) ctx.drawImage(eggHead[this.fireAni], -50 + (this.length-this.hide)* dirx* distance/this.spacing, - 25 + i * diry * distance/this.spacing + ((this.length-this.hide)*Math.sin((this.wiggleAni + this.length)*(this.length-this.hide)*this.spacing)));
			else ctx.drawImage(eggHead[4 + rand(3)], -50 + (this.length-this.hide)* dirx* distance/this.spacing, - 25 + i * diry * distance/this.spacing + ((this.length-this.hide)*Math.sin((this.wiggleAni + this.length)*(this.length-this.hide)*this.spacing)));
			
			//ctx.rotate(-headAngle);
			ctx.translate(-this.x, -this.y);
		}
		result.drawIcon = function(){}
		result.drawBody = function(){}
		result.move = function(){}
	
		return result
	}
	
	function Egg(x,y,t,l){
		this.x = x;
		this.y = y;
		this.type = t;
		this.lev=l;
		this.timer = 200;
		this.spawnx = x;
		this.spawny = y;
		this.spawn = function (){
				if(this.type == 0){//spawn insect
				if(this.lev == 0)creature.push(LowInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 1)creature.push(MedInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 2)creature.push(HighInsect(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 3)creature.push(Bug(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 4)creature.push(Maggot(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 5)creature.push(BugSmall(this.spawnx - 120 + rand(40),this.spawny-100,0));
				else if(this.lev == 6)creature.push(worm(this.spawnx - 120 + rand(40),this.spawny-100,0));
		
			}else if(this.type == 1){//spawn reptile
				if(this.lev == 0)creature.push(LowReptile(this.spawnx - 120 + rand(40),this.spawny-100,1));
				else if(this.lev == 1)creature.push(MedReptile(this.spawnx - 120 + rand(40),this.spawny-100,1));
				else creature.push(HighReptile(this.spawnx - 100,this.spawny-120 + rand(40),1));
			}else if(this.type == 2){//spawn scientist
				if(this.lev == 0)creature.push(Scientist(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else if(this.lev == 1)creature.push(ScientistArmed(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else creature.push(ScientistArmed(this.spawnx - 100,this.spawny-120 + rand(40),3));
			}else if(this.type == 3){//spawn marine
				if(this.lev == 0)creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else if(this.lev == 1)creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,3));
				else creature.push(Marine(this.spawnx - 120 + rand(40),this.spawny-100,3));
			}
		}
		this.draw = function(){
		
			if(this.timer == 0) {
				this.spawn();
				
				for(var i=0; i < 3; i++) bloodSplatLarge.push(createBloodLarge(this.x + 30 + rand(40), this.y + 30 + rand(40)));
				this.timer = -10
			}else {
				if(this.timer > 0) this.timer--;
			}
			if(this.timer > 0) ctx.drawImage(egg, this.x,this.y);
			else ctx.drawImage(eggHatch, this.x,this.y);
			
		}
	
		
	
	}
	function BugSmall(a,b,t){
		var result = createCreature(50,140,100,60);
		
		//console.log(result.hitBox.width + " " + result.hitBox.height);
		result.x = a;
		result.y = b;
		result.greeting = addSound('Sounds/bugGreeting.ogg');
		result.weapon.push(MaggotHead());
		result.weapon.push(insectHeal());
		
		result.weapon[0].pX += 20
		result.weapon[0].pY += 110
		
		result.weapon[1].pX += 20
		result.weapon[1].pY += 110
		
		result.stats.health = 50;
		result.stats.maxHealth = 50;
		result.stats.torso = 7;
		
		if(Math.random() > 0.5 ) result.stats.legs= 5;
		else result.stats.legs= 6;
		result.stats.abdomen = 0//rand(3);
		
		
		result.stats.hasArms = false;
		result.stats.wing = 0
		result.stats.hair = -1
		result.stats.type = t
		result.sw = 0
		return result
	}
	
	function BugHigh(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.weapon.push(Monster2Punch());
		result.weapon.push(insectHeal());
		result.stats.health = 100;
		result.stats.torso = 5;
		if(Math.random() < 0.5){
			result.stats.legs= 2 + rand(2);
			result.stats.abdomen = 1 + rand(2);
		}else{
			result.stats.legs= 4;
			result.stats.abdomen = 0;
		}
		
		result.stats.hasArms = false;
		if(Math.random() < 0.5) result.stats.wing = 1
		else result.stats.wing = 0
		result.stats.hair = -1
		result.stats.type = t
		result.sw = 0
		return result
	}
	
	
	function LowInsect(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.greets.push("Another one!");
		result.greets.push("Kill it!");
		result.greets.push("It's mine!");
		if(Math.random() > 0.5) result.greeting = addSound('Sounds/greeting2.ogg');
		else result.greeting = addSound('Sounds/greeting1.ogg')
		
		
		
		if(Math.random() < 0.5){
			result.weapon.push(PunchInsect());
			result.weapon.push(insectHeal());
		}else{
			result.weapon.push(Punch0());
			result.weapon.push(insectHeal());
			//result.giveGun(PISTOL(), 1);
		}
		result.weapon.push(blank());
		
		//result.sw = 1
		//result.stats.health = 100;
		result.stats.torso = rand(2);
		result.stats.legs= rand(2);
		result.stats.abdomen = 0;
		result.stats.hasArms = true;
		result.stats.wing = 0
		result.stats.hair = rand(5)+1
		result.stats.type = t
		if(Math.random() > 0.5) for(var i=0; i < 2; i++) result.levelUP();
		
		result.portStats.eyes = rand(portInsectEyes.length)
		
		return result
	}
	
	function MedInsect(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.greets.push("Time to die!");
		result.greets.push("Kill it!");
		result.greets.push("No More!");
		
		if(Math.random() > 0.5) result.greeting = addSound('Sounds/greeting2.ogg');
		else result.greeting = addSound('Sounds/greeting1.ogg')
		
		
		//result.stats.health = 180;
		result.stats.torso = rand(2) + 1;
		result.stats.legs= 2 + rand(2);
		result.stats.abdomen = rand(2);
		result.stats.hasArms = true;
		result.stats.wing = rand(2)
		result.stats.hair = rand(5) + 1
		result.stats.type = t
		result.portStats.eyes = rand(portInsectEyes.length)
		
		
		var randType = Math.random();
		
	if(randType > 0.6){	//no weapon
			result.weapon.push(PunchInsect());
			result.weapon.push(insectHeal());
			result.weapon.push(blank());
		}else if(randType > 0.4){//Well armed
			result.weapon.push(Punch0());
			result.weapon.push(insectHeal());
			if(Math.random() < 0.2) result.giveGun(SMG(), 2)
			else result.giveGun(PISTOL(),2)
			
		}else {//proper twisted monster
			
			result.stats.torso = 4
			result.stats.hair = 0
			result.stats.armorPlate = false
			randType = Math.random();
			
			if(randType > 0.7) result.weapon.push(PunchInsect());
			else if(randType > 0.4) result.weapon.push(Monster1Punch());
			else result.weapon.push(Monster2Punch());
			result.weapon.push(insectHeal());
		
		}
		
		if(Math.random() > 0.95) result.stats.armorPlate = true
		
		for(var i=0; i < 5; i++) result.levelUP();
		
		return result
	}
	
	function HighInsect(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.greets.push("Time to feast!");
		result.greets.push("More prey!");
		result.greets.push("Easy meat.");
		if(Math.random() > 0.5) result.greeting = addSound('Sounds/greeting2.ogg');
		else result.greeting = addSound('Sounds/greeting1.ogg')
		var randType = Math.random();
		if(randType > 0.6){		
			result.weapon.push(PunchInsect());
			result.weapon.push(insectHeal());
			result.weapon.push(blank());
			for(var i=0; i < 8; i++) result.levelUP();
		}else if(randType > 0.2){
			result.weapon.push(Punch0());
			result.weapon.push(insectHeal());
			if(Math.random() < 0.5) result.giveGun(SMG(), 2)
			else result.giveGun(RIFLE(),2)
			for(var i=0; i < 10; i++) result.levelUP();
		}else{
			result.weapon.push(Monster2Punch());
			result.weapon.push(insectHeal());
			for(var i=0; i < 7; i++) result.levelUP();
		}
		result.weapon.push(blank());
		//result.stats.health = 250;
		result.stats.torso = 3;
		if(Math.random() < 0.5){
			result.stats.legs= 2 + rand(2);
			result.stats.abdomen = 1 + rand(2);
		}else{
			result.stats.legs= 4;
			result.stats.abdomen = 0;
		}
			if(Math.random() > 0.8) result.stats.armorPlate = true
			
			
		result.portStats.eyes = rand(portInsectEyes.length)
			
		result.stats.hasArms = true;
		result.stats.wing = rand(2)
		result.stats.hair = rand(6)
		result.stats.type = t
		
		
		return result
	}
	
	function LowReptile(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.greets.push("Kill it!");
		result.greets.push("Another one!");
		result.greets.push("I'm on it!");
		result.weapon.push(Punch0());
		result.weapon.push(acidSpray());
		/*
		if(Math.random() < 0.2){
			result.giveGun(SMG(), 2);
		}else{
			result.giveGun(PISTOL(), 2);
		}*/
		
		result.sw = 0
		result.weapon.push(blank());
		
		//result.stats.health = 100;
		result.stats.torso = rand(2);
		result.stats.legs= 0;
		result.stats.abdomen = 0;
		result.stats.hasArms = true;
		result.stats.wing = 0
		result.stats.hair = rand(5)+1
		result.stats.type = 1
		
		//result.portStats.mouth = rand(3)
		result.portStats.eyes = rand(portReptileEyes.length)
		
		
		return result
	}
	
	function MedReptile(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.weapon.push(Punch0());
		result.weapon.push(acidSpray());
		result.greets.push("Not another one");
		result.greets.push("Kill it quick!");
		result.greets.push("Putrid creature!");
		if(Math.random() < 0.4){
			result.giveGun(SMG(), 2);
			for(var i=0; i < 5; i++) result.levelUP();
		}else{
			result.giveGun(RIFLE(), 2);
			for(var i=0; i < 6; i++) result.levelUP();
		}
		
		result.sw = 0
		//result.stats.health = 150;
		result.stats.torso = rand(2) + 1;
		result.stats.legs= rand(2) + 1;
		result.stats.abdomen = 0;
		
		if(Math.random() > 0.9) result.stats.armorPlate = true
		result.stats.hasArms = true;
		result.stats.wing = rand(2)
		result.stats.hair = rand(5)+1
		result.stats.type = 1
		
		result.portStats.eyes = rand(portReptileEyes.length)
		
		
		return result
	}
	
	function HighReptile(a,b,t){
		var result = createCreature(80,45,40,155);
		result.x = a;
		result.y = b;
		result.weapon.push(Punch0());
		result.weapon.push(acidSpray());
		result.greets.push("Break its bones!");
		result.greets.push("Make it bleed");
		result.greets.push("More prey meat.");
		if(Math.random() < 0.4){
			result.giveGun(SMG(), 2);
			result.giveGun(PISTOL(), 3);
			for(var i=0; i < 8; i++) result.levelUP();
		}else{
			result.giveGun(RIFLE(), 2);
			result.giveGun(SMG(), 3);
			for(var i=0; i < 10; i++) result.levelUP();
		}
		
		result.sw = 1 +rand(2)
		//result.stats.health = 200;
		result.stats.torso = rand(2) + 1;
		result.stats.legs= 4 + rand(2);
		if(Math.random() > 0.90) {//Snake tail!
			result.stats.legs = 6;
			result.stats.speed += 1
		}
		result.stats.abdomen = 0;
		result.stats.hasArms = true;
		
		if(Math.random() > 0.5) result.stats.armorPlate = true
		
		if(Math.random() > 0.6) result.stats.wing = 1
		else result.stats.wing = 0
		result.stats.hair = rand(5)+1
		result.stats.type = 1
		
		result.portStats.eyes = rand(portReptileEyes.length)
		
		
		return result
	}

	function mutation(){
	
	}
	
	function hitWall(x,y){
		var result = false;
		for(var i=0; i < wall.length;i++){
			if(wall[i].collidePoint(x,y)) return true
		}
		return false;
	}
	function createCreature(a,b,c,d){
		var wArray = [];
		var tPath = [];
		var eArray = [];
		var ga = [];
		
		var result = {
			homeRange:50+rand(100),
			x:300,
			y:-150,
			sx:0,
			sy:0,
			state:0,
			recoil:0,
			level:1,
			exp:0,
			croucher:rand(2),
			name:"T-" + (rand(80) + 10),
			name2:PNames[rand(PNames.length)],
			gainXP:function(n){
				this.exp += n
				if(this.exp >= this.level * 50){
					this.exp -= this.level * 50;
					this.levelUP();
					
				}
			},
			levelUP:function(){
				this.level += 1;
				this.stats.health += Math.floor(this.stats.maxHealth*0.1);
				this.stats.maxHealth *= 1.1
				this.stats.maxHealth = Math.floor(this.stats.maxHealth)
				if(this.stats.health > this.stats.maxHealth) this.stats.health = this.stats.maxHealth;
				
				this.stats.health = Math.floor(this.stats.health)
				
				this.weapon[0].stats.damage *= 1.1
				if(this.weapon[1] != null) {
					this.weapon[1].stats.damage *= 1.1
					this.weapon[1].stats.damage = Math.floor(this.weapon[1].stats.damage)
				}
				this.weapon[0].stats.damage = Math.floor(this.weapon[0].stats.damage)
				
				
				//this.speak("Level Up!");
				
				
				//try torso
				//try legs
				//try wings
				if(this.stats.type == 1){//reptile
					if(this.stats.torso < 3){
						this.stats.torso++;
						this.speak("My back itches.");
					}else if(this.stats.legs < 5) {
						this.stats.legs++;
						this.speak("My legs feel weird.");
					}
					
				}
				
			},
			hasGun:true,
			fireCool:0,
			walkSpeed:5,
			aniFrame:1,
			reloading:-1,
			retarget:20,
			facing:0, 	//0 right, 1- left: based on mouse position
			cFloor:0,
			hitBox:{x:a,y:b,width:c,height:d},
			stats:{armorPlate:false, speed:5+Math.random(), jump:10, health:100, maxHealth:100, armor:0, arm:0, torso:0, legs:0, hair:1, abdomen:0, hasArms:true, wings:0, type:0}, //type 0- Insect, 1-Reptile
			weapon:wArray, 
			sw:0,
			light:true,
			aimer:{x:rand(w), y: rand(h)},//{x:a-200,y:b-100},
			taimer: {x:rand(w), y: rand(h)},//{x:a - 200,y:b - 100},
			aimerD:{x:rand(10) - 5,y: rand(10) - 5},
			canFire:true,
			deathF:0, //goes to 10
			speakAni:0,
			speech:"",
			greets:ga,
			greeting:null,
			target:-1,
			path: tPath,
			giveGun:function(w,i){
				updateWeapon(w, this.stats.type);
				this.weapon[i] = w;
			
			},
			enemies: eArray,
			targeter:16,
			getEnemies: function(){
				this.enemies = [];
				for(var i=0; i < creature.length; i++) if(this.stats.type != creature[i].stats.type && creature[i].stats.health > 0) this.enemies.push(creature[i]);
			},
			move:function(){
			
				this.targeter++
				
				if(this.targeter > 16) {
					//console.log("Refreshing target list...");
					this.getEnemies();
					this.targeter = 0;
					if(this.enemies.length > 0 && this.greeting != null){
						this.greeting.play();
					}
					if(this.greets.length > 0 && this.enemies.length > 0) this.speak(this.greets[rand(this.greets.length)]);
				
				}
				
				
				//Confirm target is valid
				if(this.target >= this.enemies.length || this.retarget == 0) this.target = -1;
				
				this.retarget--
				if(this.retarget <0) this.retarget = 20
				
				
				var eExist = this.enemies.length > 0;
				
				
				if(this.stats.health <= 0) eExist = false;
				
				//Find a target
				if(this.target == -1 && eExist){
					var bestInd = -1;
					var bestD = -1;
					
					for(var i=0; i < this.enemies.length;i++){
					
						if(dist(this.enemies[i].x, this.enemies[i].y, this.x, this.y) < bestD || bestD < 0){
							bestD = dist(this.enemies[i].x, this.enemies[i].y, this.x, this.y)
							bestInd = i
						}
					}
					
					this.target = bestInd;
					if(this.target != -1) {
						//In future paly sound here for when target 
					
					
					}
				}else if(eExist){
				//Confirm target is not allied
					if(this.enemies[this.target].stats.type == this.stats.type) {
						this.target = -1;
						this.enemies.splice(this.target,1);
						alert("error 59 this has no way to happen any more, ir does it?");
					}
					
					//Confirm enemy is not already dead
					if(this.enemies[this.target].stats.health <= 0){
						this.enemies.splice(this.target,1);
						this.target = -1
						//this.speak("Target Down!");
						this.path = [];
					}
				}else this.target = -1;
				
				
				if(this.sw >= this.weapon.length) this.sw = 0
				//If a useless character, stop targettting
				if(this.weapon[this.sw].useless) this.target = -1;
				
				
				if(this.target != -1){
				//Target is valid
					this.taimer.x = this.enemies[this.target].x + this.enemies[this.target].hitBox.x + this.enemies[this.target].hitBox.width/2
					this.taimer.y = this.enemies[this.target].y + this.enemies[this.target].hitBox.y + this.enemies[this.target].hitBox.height/2
					
				
					
					if(this.stats.type == 0){
					//Insect, switch to heal if needed
						if (this.stats.health < 40 && Math.abs(this.x + 100 - this.taimer.x) < 200) this.sw = 1;
					}
					
					if(this.stats.wing > 0){
						
					
					}
					
					if(this.path.length == 0){
							if(this.x - this.enemies[this.target].x < -50) {
								this.state = 2;
								this.sx = this.stats.speed;
							}else if(this.x - this.enemies[this.target].x > 50){
								this.state = 3;
								this.sx = this.stats.speed * -1;
							}
							
							if(dist(this.x, this.y, this.enemies[this.target].x, this.enemies[this.target].y) > 50){
								var start = {x:Math.floor((this.x + 100)/50), y: Math.floor((this.y + 100)/50)}
								var end = {x:Math.floor((this.enemies[this.target].x + 100)/50), y: Math.floor((this.enemies[this.target].y + 100)/50)}
								
								if(mapGrid[start.x][start.y].wall) start = this.getCorner();
								if(mapGrid[end.x][end.y].wall ) end = this.enemies[this.target].getCorner();
								
								/*
								if(start.x < 0){
									console.log("Unable to find a clear corner, left or right.");
								}else console.log("Start position: " + mapGrid[start.x][start.y].wall);
								
								if(end.x < 0){
									console.log("Unable to find a clear corner on target, left or right.");
								}else console.log("End position: " + mapGrid[end.x][end.y].wall);
								*/
								if(start.x >= 0 && end.x >= 0){
									if(!mapGrid[start.x][start.y].wall && !mapGrid[end.x][end.y].wall) {
										this.path = aStar(start, end, this.stats.wing>0);
										this.path = smoothPath(this.path);
										}
									
								}else{//Either start pt or end point is absorbing walls, thus unreachable
									//console.log("Positions unreachable.. Aborting.");
									this.enemies.splice(this.target,1);
									this.path = []
									this.target = -1;
									
								}
							}
						}else{//Path exists, move along it
							if(dist(this.x + 100, this.y + 100, this.path[0].x*50 + 25, this.path[0].y*50 + 25) < 50) this.path.splice(0,1);
							else{//Move to path 0
								if(this.WillFire() != this.target && this.target >= 0 || this.weapon[this.sw].type != 1){
								
								if(this.x + 100 - this.path[0].x*50 -25< -30){
									this.state = 2;
									this.sx = this.stats.speed;
								}else if(this.x + 100 - this.path[0].x*50 -25 > 30){
									this.state = 3;
									this.sx = this.stats.speed * -1;
								}else if(this.falling()){
									this.sx = 2;
								
								}
								
								if(this.y + 100 - this.path[0].y*50 - 25 > -20)	this.jump();
								//There is no plan for down motion!	
									//this.speak("jump!");
								}else {
									if(this.weapon[this.sw] != null){
										if(this.weapon[this.sw].type == 1){
											this.sx = 0
											this.state = 0;
										}
									}
								}
								
							
								if(dist(this.x + 100, this.y + 1100, this.path[0].x*50 + 50, this.path[0].y*50 + 50) > 100){
									var start = {x:Math.floor((this.x + 100)/50), y: Math.floor((this.y + 100)/50)}
									var end = {x:Math.floor((this.enemies[this.target].x + 100)/50), y: Math.floor((this.enemies[this.target].y + 100)/50)}
								
									if(mapGrid[start.x][start.y].wall ) start = this.getCorner();
									if(mapGrid[end.x][end.y].wall ) end = this.enemies[this.target].getCorner();
									if(start.x >= 0 && end.x >= 0){
										if(!mapGrid[start.x][start.y].wall && !mapGrid[end.x][end.y].wall){
											this.path = aStar(start, end, this.stats.wing>0);
											this.path = smoothPath(this.path);
										}
									}else{
										//console.log("Target Unreachable!  Removing from target list.")
										this.enemies.splice(this.target,1);
										this.path = []
										this.target = -1;
									}
								}
							}
						
						}
				
				
				//wierd gun problem
				if(this.weapon[this.sw].useless || this.weapon[this.sw] == null) this.sw = 0;//default punch!
				
				
					if((this.weapon[this.sw].type == 0 || this.weapon[this.sw].type ==3) && this.target>= 0){//melee selected
					
						//console.log(dist(this.x+100, this.y+100, creature[this.target].x+100, creature[this.target].y + 100));
						if(dist(this.x+100, this.y+100, this.enemies[this.target].x+100, this.enemies[this.target].y + 100) <= this.weapon[this.sw].stats.range) {
							if(this.fireCool <= 0 && this.canFire && this.recoil == 0)this.fire();
							
							if(dist(this.x+100, this.y+100, this.enemies[this.target].x+100, this.enemies[this.target].y + 100) <= 30) {
							//Too close, back up!
								if(this.facing == 0){
									this.state = 3;
									this.sx = this.stats.speed * -1;
								}else{
									this.state = 2;
									this.sx = this.stats.speed;
								}
								
								this.path = [];
							}else{
								this.sx = 0;
								this.state = 0;
							}
						
						}else if(this.path.length == 0){//Move to target
						
						
							//If hit obstacle
							for(var i=0; i < wall.length; i++) {
								if(wall[i].collidePoint(this.x +this.hitBox.x + this.sx, this.y +this.hitBox.y + this.hitBox.height - 5) ||wall[i].collidePoint(this.x +this.hitBox.x+ this.sx, this.y +this.hitBox.y + 5) || wall[i].collidePoint(this.x +this.hitBox.x + this.sx, this.y +this.hitBox.y + this.hitBox.height /2)){
								//left side has hit a wall.
								this.sx = 0;
								this.jump();
							}else if(wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + this.hitBox.height - 5) || wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + 5) || wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + this.hitBox.height /2)){
								//right wall collision

								this.sx = 0;
								this.jump();
							}
						}
							
							
						}
						
						//Switch to other gun if possible
						if(this.weapon.length >= 4){
							if(!this.weapon[2].useless && this.weapon[2] != null && this.weapon[3] != null && !this.weapon[3].useless){
								if(Math.random() > 0.5){
									if(this.weapon[3].ammo + this.weapon[3].clip > 0) this.sw = 3
								}else{
									if(this.weapon[2].ammo + this.weapon[2].clip > 0) this.sw = 2
								}
							}else if((this.weapon[2].useless||this.weapon[2] == null) && this.weapon[3] != null && !this.weapon[3].useless) {
								if(this.weapon[3].ammo + this.weapon[3].clip > 0) this.sw = 3
							}
							else if(!this.weapon[2].useless && !this.weapon[3].useless && this.weapon[2] != null && this.weapon[3] == null){
								if(this.weapon[2].ammo + this.weapon[2].clip > 0) this.sw = 2
							}
						}else if(this.weapon.length == 3){
						//Have only 1 spare gun slot, the other two are melee by definition
							if(this.weapon[2] != null){
								if(!this.weapon[2].useless && this.weapon[2].ammo + this.weapon[2].clip > 0) this.sw = 2
							
							}
						}
					}else if(this.weapon[this.sw].type == 1){//Gun selected
					if(this.enemies[this.target] == null) this.target = -1
					if(this.path.length == 0 && this.target != -1){
				
						if(dist(this.x, this.y, this.enemies[this.target].x, this.enemies[this.target].y) < 250){//too close
							if(this.enemies[this.target].x < this.x){
							//target creature is on the left, so walk right
								this.sx = this.stats.speed;
								this.state = 2;
							}else{
							//target creature is on the right, so walk left
								this.sx = -this.stats.speed;
								this.state = 3
							}
						}else if(dist(this.x, this.y, this.enemies[this.target].x, this.enemies[this.target].y) > 400 /*&& this.stats.type == this.creature[cS].stats.type*/){//too far
							if(this.enemies[this.target].x < this.x){
							//target creature is on the left, so walk left
								this.sx = -this.stats.speed;
								this.state = 3;
							}else{
							//target creature is on the right, so walk right
								this.sx = this.stats.speed;
								this.state = 2
							}
						}else{//acceptable firing distance
								if(this.state != 4) this.crouch();
						}
						
						if(Math.abs(this.x - this.enemies[this.target].x) < 50 && Math.abs(this.y - this.enemies[this.target].y) > 250){
							this.enemies.splice(this.target,1);
							this.target = -1;
						}
						
						
						}
						if(this.weapon[this.sw].ammo <= 0 && this.weapon[this.sw].clip <= 0 && this.weapon[this.sw].type == 1) {
							if(this.weapon[0] != null) this.sw = 0;
							this.speak("Ammo Out!");
							//alert("I'm out of ammo, switching to another gun ifpossilbe")
							///alert(this.weapon.length);
							for(var i=0; i < this.weapon.length; i++){
								if(this.weapon[i] != null && !this.weapon[i].useless){
									if(this.weapon[i].type == 1) {
										if(this.weapon[i].ammo > 0) this.sw = i;
									}
								}
							}
						}else if(this.fireCool <= 0 && this.canFire && this.recoil == 0 && this.reloading < 0){
							//Fire ranged weapon
							
							if(this.target != -1){
								if(dist(this.x, this.y, this.enemies[this.target].x, this.enemies[this.target].y) < w/2 && this.WillFireGeneral()){
								this.fire();
								}
							}
						}
					}
				}
			
				if(this.target == -1){
					this.taimer.x += this.aimerD.x
					this.taimer.y += this.aimerD.y
					this.sx = 0
					this.state = 0;
					
					if(this.taimer.x < this.x - 350 ) {
						this.aimerD.x = 2
						this.taimer.x = this.x - 340;
					}else if(this.taimer.x > this.x + 450) {
						this.aimerD.x = -2
						this.taimer.x = this.x + 440;
					}
					if(this.taimer.y < this.y - 50 ) {
						this.aimerD.y = 2
						this.taimer.y = this.y - 40;
					}else if(this.taimer.y > this.y + 200) {
						this.aimerD.y = -2
						this.taimer.y = this.y + 190;
					}
					//if(this.aimerD.y < this.y - 100 || this.aimerD.y > this.y + 150) this.aimerD.y *= -1
					if(this.retarget == 20 && rand(30) == 1){
						if(Math.random() > 0.5){
							this.sx = this.stats.speed;
							this.state = 2;								
						}else{
							this.sx = -this.stats.speed;
							this.state = 3
						}
					}
					
					//I near player and is of the same type, try to tag along
					if(cS >=0 && cS < creature.length){
					 if(this.stats.type == creature[cS].stats.type){
						if(dist(creature[cS].x, creature[cS].y, this.x,this.y) < 250){	
							if(this.x < creature[cS].x - this.homeRange){
								this.sx = this.stats.speed;
								this.state = 2;
							}else if(this.x > creature[cS].x + this.homeRange){
								this.sx = -this.stats.speed;
								this.state = 3;
							}
							this.taimer.x = creature[cS].aimer.x
							this.taimer.y = creature[cS].aimer.y
						}
					}
					}
				}
				
				if(!(this.x >= 0 && this.x < w*2) && this.stats.health > 0){
					
					this.stats.health = 0
					this.x = -100
					this.y = -100
				}
				
				//wierd gun problem
				if(this.weapon[this.sw].useless || this.weapon[this.sw] == null) this.sw = 0;//default punch!
				
			},
			jump:function(){
				if(this.sy == 0 && !this.falling() && this.stats.health > 0) {
					this.sy = -1.5 * this.stats.jump
					this.y -= 5
				}
				
				if(this.falling() && this.stats.wing > 0){
					this.sy -= this.stats.jump*2;
					//this.sy = -4
					if(this.sy < -1 * this.stats.jump) this.sy = this.stats.jump * -1
				}
			},
			lGun:-1,
			rGun:-1,
			goggles:rand(2),
			drawIcon:function(x,y, pw, ph){
				
				if(this.stats.type == 3){
					if(this.stats.torso == 4 || this.stats.torso == 1 || this.stats.torso == 0) ctx.drawImage(mBase, x,y, pw,ph);
					
					else{
						ctx.drawImage(fBase, x,y, pw,ph);
						ctx.drawImage(portNoses[this.portStats.nose], x,y, pw,ph);
						ctx.drawImage(portMouth[this.portStats.mouth], x,y, pw,ph);
						ctx.drawImage(portEyeBrow[this.portStats.eyebrow], x,y, pw,ph);
					}
				}else {
					
				}
				
				if (this.stats.type == 0){//Insect
					//ctx.drawImage(InsectTorso[this.stats.torso], 80,40,46,46, x,y, 46,46);
					if(this.stats.torso == 6)ctx.drawImage(bugFace, x,y, pw,ph);//bug face
					else if(this.stats.torso == 7 || this.stats.torso == 5)ctx.drawImage(maggotFace, x,y, pw,ph);//maggot face
					else{
						ctx.drawImage(fBase, x,y, pw,ph);
						ctx.drawImage(portNoses[this.portStats.nose], x,y, pw,ph);
						ctx.drawImage(portMouth[this.portStats.mouth], x,y, pw,ph);
						ctx.drawImage(portEyeBrow[this.portStats.eyebrow], x,y, pw,ph);
						ctx.drawImage(portInsectEyes[this.portStats.eyes], x,y, pw,ph);
						if(this.level > 9) ctx.drawImage(portInsect[2], x,y, pw,ph);
						else if(this.level > 6) ctx.drawImage(portInsect[1], x,y, pw,ph);
						else if(this.level > 3) ctx.drawImage(portInsect[0], x,y, pw,ph);
						ctx.drawImage(portBarcode[this.portStats.barcode], x,y, pw,ph);
					}
				}else if(this.stats.type == 1){//Reptile
					//ctx.drawImage(ReptileTorso[this.stats.torso], 80,40,46,46, x,y, 46,46);
					ctx.drawImage(fBase, x,y, pw,ph);
					ctx.drawImage(portNoses[this.portStats.nose], x,y, pw,ph);
					ctx.drawImage(portMouth[this.portStats.mouth], x,y, pw,ph);
					ctx.drawImage(portEyeBrow[this.portStats.eyebrow], x,y, pw,ph);
					ctx.drawImage(portReptileEyes[this.portStats.eyes], x,y, pw,ph);
					ctx.drawImage(portBarcode[this.portStats.barcode], x,y, pw,ph);
					if(this.level > 9) ctx.drawImage(portReptile[2], x,y, pw,ph);
					else if(this.level > 6) ctx.drawImage(portReptile[1], x,y, pw,ph);
					else if(this.level > 3) ctx.drawImage(portReptile[0], x,y, pw,ph);
				}else if(this.stats.type == 2){//Human
					//ctx.drawImage(HumanTorso[this.stats.torso], 80,40,46,46, x,y, 46,46);
					ctx.drawImage(portEyes[this.portStats.eyes], x,y, pw,ph);
				}else if(this.stats.type == 3){//Human
					//ctx.drawImage(HumanTorso[this.stats.torso], 80,40,46,46, x,y, 46,46);
					ctx.drawImage(portEyes[this.portStats.eyes], x,y, pw,ph);
					if(this.stats.torso <= 3){//marine
						
						ctx.drawImage(marineBase, x,y, pw,ph);
						if(this.stats.torso == 1 || this.stats.torso==2) ctx.drawImage(marineFace, x,y, pw,ph);
					
						if(this.stats.torso == 2 || this.stats.torso==3) ctx.drawImage(portHair[1], x,y, pw,ph);
						
					}else{//scientist
						if(this.stats.torso == 6){
							ctx.drawImage(mask[0], x,y, pw,ph);
					
						}
						 ctx.drawImage(doctorClothes, x,y, pw,ph);
						
					}
				}
				//if(this.stats.hair >= 0) ctx.drawImage(hair[this.stats.hair], 80,40,46,46, x,y, 46,46);
				
				if(this.stats.hair >= 0) ctx.drawImage(portHair[this.stats.hair], x,y, pw,ph);
			},
			portStats:{nose: rand(portNoses.length), eyes:rand(portEyes.length), mouth:rand(portMouth.length), eyebrow:rand(portEyeBrow.length), barcode:rand(portBarcode.length)},
			drawBody:function(fNum, x,y){
				var off = 0;
				if(this.state != 0) off = 10;
			
				
				if(this.stats.type == 0){	//Insect
					if(this.stats.health > 0){
						//hip gun!
						ctx.translate(x+100,y + 120 + off)
						ctx.rotate(degRad(35))
						
						if(this.facing == 1){
							if(this.weapon[2]!= null && this.sw != 2)ctx.drawImage(this.weapon[2].IconPic, -50, -20)
						}else {
							if(this.weapon[3]!= null && this.sw != 3) ctx.drawImage(this.weapon[3].IconPic, -50, -20)
						}
						ctx.rotate(-degRad(35));
						ctx.translate(-x - 100, -120 - y - off)
						
						
						if(this.weapon[this.sw].stats.singleHand && this.stats.hasArms) ctx.drawImage(leftArm[0], fNum*200, 0, 200,200, x, y, 200,200);
						ctx.drawImage(InsectTorso[this.stats.torso], fNum*200, 0, 200,200, x, y, 200,200);
						if(this.stats.hair != -1) ctx.drawImage(hair[this.stats.hair], fNum*200, 0, 200,200, x, y, 200,200);

						if(this.stats.wing > 0) {
							if(this.falling() ){	
								ctx.drawImage(InsectLeg[this.stats.legs], (10+this.aniFrame%2)*200, 0, 200,200, x, y, 200,200);
								if(this.stats.armorPlate) ctx.drawImage(HumanArmor, fNum*200, 0, 200,200, x, y, 200,200);
						
								if(this.stats.abdomen > 0) ctx.drawImage(InsectAb[this.stats.abdomen], (10+this.aniFrame%2)*200, 0, 200,200, x, y, 200,200);
								ctx.drawImage(InsectWing[0], (this.aniFrame+9)*200, 0, 200,200, x, y, 200,200);
							}else {
								ctx.drawImage(InsectLeg[this.stats.legs], fNum*200, 0, 200,200, x, y, 200,200);
								if(this.stats.armorPlate) ctx.drawImage(HumanArmor, fNum*200, 0, 200,200, x, y, 200,200);
						
								if(this.stats.abdomen > 0) ctx.drawImage(InsectAb[this.stats.abdomen], fNum*200, 0, 200,200, x, y, 200,200);
								ctx.drawImage(InsectWing[0], fNum*200, 0, 200,200, x, y, 200,200);
							}
						}else{
							ctx.drawImage(InsectLeg[this.stats.legs], fNum*200, 0, 200,200,x, y, 200,200);
							if(this.stats.armorPlate) ctx.drawImage(HumanArmor, fNum*200, 0, 200,200, x, y, 200,200);
						
							if(this.stats.abdomen > 0) ctx.drawImage(InsectAb[this.stats.abdomen], fNum*200, 0, 200,200, x, y, 200,200);
						}
						
						if (this.weapon[this.sw].pic == null) ctx.drawImage(this.weapon[0].pic, x+ 95 + this.weapon[0].pX + this.weapon[0].oX,y+80 + this.weapon[0].pY + this.weapon[0].oY + off)//ctx.drawImage(this.weapon[0].pic, x+ 85 + this.weapon[0].oX,y+80 + this.weapon[0].oY + off)
						//hip guns!
						//Is always 3 and 4
						ctx.translate(x+100,y + 120 + off)
						ctx.rotate(degRad(30))
						
						if(this.facing == 0){
							if(this.weapon[2]!= null && this.sw != 2)ctx.drawImage(this.weapon[2].IconPic, -50, -20)
						}else {
							if(this.weapon[3]!= null && this.sw != 3) ctx.drawImage(this.weapon[3].IconPic, -50, -20)
						}
						ctx.rotate(-degRad(30));
						ctx.translate(-x - 100, -120 - y - off)
					}else{
						if(this.deathF < 10){
							ctx.globalAlpha = (10-this.deathF)/10
							ctx.translate(x+100,y+100+ this.deathF*9);
							ctx.rotate(degRad(-90 * this.deathF/10));
						
							ctx.drawImage(InsectTorso[this.stats.torso], 3*200, 0, 200,200,-100,-100, 200,200);
							ctx.drawImage(InsectLeg[this.stats.legs], 3*200, 0, 200,200, -100, -100, 200,200);
							if(this.stats.armorPlate) ctx.drawImage(HumanArmor, 600, 0, 200,200, x, y, 200,200);
						
							if(this.stats.abdomen > 0) ctx.drawImage(InsectAb[this.stats.abdomen], 3*200, 0, 200,200, -100, -100, 200,200);
							if(this.stats.hair != -1)ctx.drawImage(hair[this.stats.hair/*this.stats.torso*/], 3*200, 0, 200,200, -100, -100, 200,200);
							if(this.stats.wing >0) ctx.drawImage(InsectWing[0], 3*200, 0, 200,200, -100, -100, 200,200);
						
							if(this.weapon[this.sw].pic != null) ctx.drawImage(this.weapon[this.sw].pic, 0,0,150,40,this.weapon[this.sw].oX + this.weapon[this.sw].pX, this.weapon[this.sw].oY - 5 + this.weapon[this.sw].pY, 150,40)
							else ctx.drawImage(this.weapon[0].pic, 0,0,150,40,this.weapon[0].oX + this.weapon[0].pX, this.weapon[0].pY + this.weapon[0].oY - 5, 150,40)
						
						
							ctx.rotate(degRad(90 * this.deathF/10));
							ctx.translate(-x-100,-y-100- this.deathF*9);
						}else {
							
							ctx.globalAlpha = 1
							ctx.translate(x+100,y+100);
							ctx.drawImage(InsectTorso[this.stats.torso], 12*200, 0, 200,200,-100,-100, 200,200);
							ctx.drawImage(InsectLeg[this.stats.legs], 12*200, 0, 200,200, -100, -100, 200,200);
							//if(this.stats.armorPlate) ctx.drawImage(HumanArmor, 600, 0, 200,200, x, y, 200,200);
						
							if(this.stats.abdomen > 0) ctx.drawImage(InsectAb[this.stats.abdomen], 12*200, 0, 200,200, -100, -100, 200,200);
							if(this.stats.hair != -1)ctx.drawImage(hair[this.stats.hair/*this.stats.torso*/], 12*200, 0, 200,200, -100, -100, 200,200);
							if(this.stats.wing >0) ctx.drawImage(InsectWing[0], 12*200, 0, 200,200, -100, -100, 200,200);
						
							ctx.translate(-x-100,-y-100);
						}
						if(ani == 0)this.deathF += 2;
						if(this.deathF >= 10) {
							this.deathF = 10;
							this.stats.health = 0;
							
						}else{//Extra blood splatters for death sequence, not working quite right yet
							 bloodSplat.push(createBlood(this.x  +this.hitBox.x + rand(this.hitBox.width), this.y + this.hitBox.y + rand(this.hitBox.height) + this.deathF*9));
						
						}
						ctx.globalAlpha = 1;
						
					}
				}else if (this.stats.type == 1){	//Reptile
					if(this.stats.health > 0){
						ctx.translate(x+100,y + 120 + off)
						ctx.rotate(degRad(35))
						
						if(this.facing == 1){
							if(this.weapon[2]!= null && this.sw != 2)ctx.drawImage(this.weapon[2].IconPic, -50, -20)
						}else {
							if(this.weapon[3]!= null && this.sw != 3) ctx.drawImage(this.weapon[3].IconPic, -50, -20)
						}
						ctx.rotate(-degRad(35));
						ctx.translate(-x - 100, -120 - y - off)
					
						if(this.weapon[this.sw].stats.singleHand && this.stats.hasArms) ctx.drawImage(leftArm[0], fNum*200, 0, 200,200, x, y, 200,200);
						
					

						ctx.drawImage(ReptileTorso[this.stats.torso], fNum*200, 0, 200,200, x, y, 200,200);
						if(this.stats.hair != -1)ctx.drawImage(hair[this.stats.hair], fNum*200, 0, 200,200, x, y, 200,200)
							
						if(this.stats.wing > 0) {
							if(this.falling() ){
								ctx.drawImage(ReptileLeg[this.stats.legs], (10+this.aniFrame%2)*200, 0, 200,200, x, y, 200,200);
								if(this.stats.armorPlate) ctx.drawImage(HumanArmor, fNum*200, 0, 200,200, x, y, 200,200);
						
								ctx.drawImage(ReptileWing[0], (this.aniFrame+9)*200, 0, 200,200, x, y, 200,200);
							}else {
								ctx.drawImage(ReptileLeg[this.stats.legs], fNum*200, 0, 200,200, x, y, 200,200);
								if(this.stats.armorPlate) ctx.drawImage(HumanArmor, fNum*200, 0, 200,200, x, y, 200,200);
						
								ctx.drawImage(ReptileWing[0], fNum*200, 0, 200,200, x, y, 200,200);
							}
						}else{	
							ctx.drawImage(ReptileLeg[this.stats.legs], fNum*200, 0, 200,200, x, y, 200,200);
							if(this.stats.armorPlate) ctx.drawImage(HumanArmor, fNum*200, 0, 200,200, x, y, 200,200);
						}
						//if(this.stats.abdomen > 0) ctx.drawImage(InsectAb, fNum*200, 0, 200,200, x, y, 200,200);
						ctx.translate(x+100,y + 120 + off)
						ctx.rotate(degRad(30))
						
						if(this.facing == 0){
							if(this.weapon[2]!= null && this.sw != 2)ctx.drawImage(this.weapon[2].IconPic, -50, -20)
						}else {
							if(this.weapon[3]!= null && this.sw != 3) ctx.drawImage(this.weapon[3].IconPic, -50, -20)
						}
						ctx.rotate(-degRad(30));
						ctx.translate(-x - 100, -120 - y - off)
						if (this.weapon[this.sw].pic == null) ctx.drawImage(this.weapon[0].pic, x+ 85,y+70 + off)
						
					}else{
						if(this.deathF < 10){
						ctx.globalAlpha = (10-this.deathF)/10
						//ctx.save();
						ctx.translate(x+100,y+100+ this.deathF*9);
						ctx.rotate(degRad(-90 * this.deathF/10));
						ctx.drawImage(ReptileTorso[this.stats.torso], 3*200, 0, 200,200,-100,-100, 200,200);
						ctx.drawImage(ReptileLeg[this.stats.legs], 3*200, 0, 200,200, -100, -100, 200,200);
						if(this.stats.armorPlate) ctx.drawImage(HumanArmor, 600, 0, 200,200, x, y, 200,200);
						
						//if(this.stats.abdomen > 0) ctx.drawImage(InsectAb, 3*200, 0, 200,200, -100, -100, 200,200);
						if(this.stats.hair != -1)ctx.drawImage(hair[this.stats.hair], 3*200, 0, 200,200, -100, -100, 200,200);
						if(this.stats.wing >0) ctx.drawImage(ReptileWing[0], 3*200, 0, 200,200, -100, -100, 200,200);
						
						
						if(this.weapon[this.sw].pic != null) ctx.drawImage(this.weapon[this.sw].pic, 0,0,150,40,this.weapon[this.sw].oX, this.weapon[this.sw].oY - 5, 150,40)
						else ctx.drawImage(this.weapon[0].pic, 0,0,150,40,this.weapon[0].oX, this.weapon[0].oY - 5, 150,40)
						
						
						ctx.rotate(degRad(90 * this.deathF/10));
						ctx.translate(-x-100,-y-100- this.deathF*9);
						}else{
							ctx.translate(x+100,y+100);
							ctx.drawImage(ReptileTorso[this.stats.torso], 12*200, 0, 200,200,-100,-100, 200,200);
							ctx.drawImage(ReptileLeg[this.stats.legs], 12*200, 0, 200,200, -100, -100, 200,200);
						//if(this.stats.armorPlate) ctx.drawImage(HumanArmor, 600, 0, 200,200, x, y, 200,200);
							if(this.stats.hair != -1)ctx.drawImage(hair[this.stats.hair], 12*200, 0, 200,200, -100, -100, 200,200);
							//if(this.stats.wing >0) ctx.drawImage(ReptileWing[0], 3*200, 0, 200,200, -100, -100, 200,200);
							
							ctx.translate(-x-100,-y-100);
						}
						//ctx.restore();
						if(ani == 0) this.deathF += 2;
						if(this.deathF >= 10) {
							this.deathF = 10;
							this.stats.health = 0;
						}else{//Extra blood splatters for death sequence, not working quite right yet
							//bloodSplat.push(createBlood(this.x  +this.hitBox.x + rand(this.hitBox.width), this.y + this.hitBox.y + rand(this.hitBox.height) + this.deathF*9));
						
						}
						ctx.globalAlpha = 1;
					}
				}else if(this.stats.type == 3){ 
				
					if(this.stats.health > 0){
						//hip gun!
						ctx.translate(x+100,y + 120 + off)
						ctx.rotate(degRad(35))
						
						if(this.facing == 1){
							if(this.weapon[2]!= null && this.sw != 2)ctx.drawImage(this.weapon[2].IconPic, -50, -20)
						}else {
							if(this.weapon[3]!= null && this.sw != 3) ctx.drawImage(this.weapon[3].IconPic, -50, -20)
						}
						ctx.rotate(-degRad(35));
						ctx.translate(-x - 100, -120 - y - off)
					
						
						if(this.weapon[this.sw].stats.singleHand && this.stats.hasArms) ctx.drawImage(leftArm[1], fNum*200, 0, 200,200, x, y, 200,200);
						
						ctx.drawImage(HumanTorso[this.stats.torso], fNum*200, 0, 200,200, x, y, 200,200);
						
						if(this.stats.hair != -1) ctx.drawImage(hair[this.stats.hair], fNum*200, 0, 200,200, x, y, 200,200);

						if(this.stats.wing > 0) {
							if(this.falling() ){	
								if(this.weapon[this.sw].useless ||this.stats.torso < 4)ctx.drawImage(HumanLeg[this.stats.legs], (10+this.aniFrame%2)*200, 0, 200,200, x, y, 200,200);
								else ctx.drawImage(HumanLeg[this.stats.legs + 1], (10+this.aniFrame%2)*200, 0, 200,200, x, y, 200,200);
							}else {
								if(this.weapon[this.sw].useless||this.stats.torso < 4)ctx.drawImage(HumanLeg[this.stats.legs], fNum*200, 0, 200,200, x, y, 200,200);
								else ctx.drawImage(HumanLeg[this.stats.legs+1], fNum*200, 0, 200,200, x, y, 200,200);
							}
						}else{
							if(this.weapon[this.sw].useless||this.stats.torso < 4)ctx.drawImage(HumanLeg[this.stats.legs], fNum*200, 0, 200,200, x, y, 200,200);
							else ctx.drawImage(HumanLeg[this.stats.legs + 1], fNum*200, 0, 200,200, x, y, 200,200);
							//if(this.stats.abdomen > 0) ctx.drawImage(InsectAb[this.stats.abdomen], fNum*200, 0, 200,200, x, y, 200,200);
						}
						if (this.weapon[this.sw].pic == null) ctx.drawImage(this.weapon[0].pic, x+ 85,y+70 + off)
						//hip guns!
						//Is always 3 and 4
						ctx.translate(x+100,y + 120 + off)
						ctx.rotate(degRad(30))
						
						if(this.facing == 0){
							if(this.weapon[2]!= null && this.sw != 2)ctx.drawImage(this.weapon[2].IconPic, -50, -20)
						}else {
							if(this.weapon[3]!= null && this.sw != 3) ctx.drawImage(this.weapon[3].IconPic, -50, -20)
						}
						ctx.rotate(-degRad(30));
						ctx.translate(-x - 100, -120 - y - off)
					}else{
						if(this.deathF < 10){
							ctx.globalAlpha = (10-this.deathF)/10
						
							ctx.translate(x+100,y+100+ this.deathF*9);
							ctx.rotate(degRad(-90 * this.deathF/10));
							ctx.drawImage(HumanTorso[this.stats.torso], 3*200, 0, 200,200,-100,-100, 200,200);
							ctx.drawImage(HumanLeg[this.stats.legs], 3*200, 0, 200,200, -100, -100, 200,200);
							//if(this.stats.abdomen > 0) ctx.drawImage(InsectAb[this.stats.abdomen], 3*200, 0, 200,200, -100, -100, 200,200);
							if(this.stats.hair != -1)ctx.drawImage(hair[this.stats.hair/*this.stats.torso*/], 3*200, 0, 200,200, -100, -100, 200,200);
							//if(this.stats.wing >0) ctx.drawImage(InsectWing[0], 3*200, 0, 200,200, -100, -100, 200,200);
						
							if(this.weapon[this.sw].pic != null) ctx.drawImage(this.weapon[this.sw].pic, 0,0,150,40,this.weapon[this.sw].oX, this.weapon[this.sw].oY - 5, 150,40)
							else ctx.drawImage(this.weapon[0].pic, 0,0,150,40,this.weapon[0].oX, this.weapon[0].oY - 5, 150,40)

							ctx.rotate(degRad(90 * this.deathF/10));
							ctx.translate(-x-100,-y-100- this.deathF*9);
						}else{
							ctx.translate(x+100,y+100);
						
							ctx.drawImage(HumanTorso[this.stats.torso], 12*200, 0, 200,200,-100,-100, 200,200);
							ctx.drawImage(HumanLeg[this.stats.legs], 12*200, 0, 200,200, -100, -100, 200,200);
							if(this.stats.hair != -1)ctx.drawImage(hair[this.stats.hair/*this.stats.torso*/], 12*200, 0, 200,200, -100, -100, 200,200);
							//if(this.stats.wing >0) ctx.drawImage(InsectWing[0], 3*200, 0, 200,200, -100, -100, 200,200);
							ctx.translate(-x-100,-y-100);	
						}
						//ctx.restore();
						if(ani == 0)this.deathF += 2;
						if(this.deathF >= 10) {
							this.deathF = 10;
							this.stats.health = 0;
						}else{//Extra blood splatters for death sequence, not working quite right yet
							//bloodSplat.push(createBlood(this.x  +this.hitBox.x + rand(this.hitBox.width), this.y + this.hitBox.y + rand(this.hitBox.height) + this.deathF*9));
						
						}
						ctx.globalAlpha = 1;
					}
				}
				//ctx.rotate(-fAngle);
				//ctx.translate(-this.weapon[this.sW].pX, -this.weapon[this.sW].pY);
				/*
				ctx.translate(x + 100, y + 100)
				ctx.rotate(-degRad(45))
				ctx.translate(-x-100, -y-100);*/
			},
			died:false,
			die:function(){
				if(!this.died){
					for(var i=2; i < this.weapon.length; i++) this.dropWeapon(i);
					this.died = true;
					if(this.stats.type == 0) playInsectDeathSound(this.x, this.y);
				
				/*
					if(this.stats.type != creature[cS].stats.type) {
						for(var i=0; i < creature.length; i++){
							if(creature[i].stats.type == creature[cS].stats.type) creature[i].gainXP(this.level * 5);
						}
					}*/
					
					this.weapon[0] = blank();
					this.weapon[1] = blank();
				
					this.fire = function(){};
					this.move = function(){};
				}
			},
			dropWeapon:function(i){
				if(i >= 2 && i < this.weapon.length && this.weapon[i] != null){
					this.weapon[i].drop(this.x + 50, this.y + 150);
					this.weapon[i] = blank();
					this.sw = 0
				}
			},
			speak:function(words){
				this.speech = words;
				this.speakAni = 0;// words.length * 2;
			},
			sayWords:function(){
				//Speech
				if(this.speech != ""){
					speechBubble(this.x - ctx.measureText(this.speech).width/2 + 90, this.y + 28, ctx.measureText(this.speech).width + 20, 25);
					ctx.fillStyle = 'white'
					if(this.speakAni < this.speech.length && this.speakAni > 0) {
						ctx.fillStyle = 'black'
						ctx.fillText(this.speech.slice(0,this.speakAni), this.x + 99 - ctx.measureText(this.speech.slice(0,this.speakAni)).width/2, this.y+ 46)
						//ctx.fillStyle = 'white'
						//ctx.fillText(this.speech.slice(0,this.speakAni), this.x + 100 - ctx.measureText(this.speech.slice(0,this.speakAni)).width/2, this.y+ 45)
				
					}else if(this.speakAni >= this.speech.length) {
						ctx.fillStyle = 'black'
						ctx.fillText(this.speech, this.x + 100 - ctx.measureText(this.speech).width/2 - 1, this.y+ 46)
						//ctx.fillStyle = 'white'
						//ctx.fillText(this.speech, this.x + 100 - ctx.measureText(this.speech).width/2, this.y+ 45)
					}
					if(ani == 0) this.speakAni+=2;
				
					if(this.speakAni > this.speech.length * 2) {
						this.speakAni = 0;
						this.speech = "";
					}
				}
			
			
			},
			fall:false,
			stepped:false,
			aniSpeed:2,
			aniCount:0,
			crouch:function(){
				if(this.state != 4) {
					this.state = 4
					this.sx = 0
				}
				else this.state = 0;
			},
			draw:function(){
			
				var oldState = {x:this.x, y:this.y, sx:this.sx, sy:this.sy, aF:this.aniFrame}
			
				var fAngle = 0
				if(this.sx != 0) fAngle = -0.5* Math.atan(this.sy/this.sx)/Math.PI;
				
			
				var oDx = this.x
				var oDy = this.y
				ctx.translate(oDx + 100, oDy + 100)
				ctx.rotate(fAngle)
				ctx.translate(-oDx-100, -oDy-100);
			
			
				//ctx.fillStyle = 'yellow'
				//ctx.fillText(this.weapon[this.sw].clip + " / " + this.weapon[this.sw].ammo, this.x, this.y);
				//ctx.fillText(this.weapon[this.sw].name + " " + this.sw, this.x, this.y);
				ctx.font = "11pt Orbitron"
				fall = this.falling();
				this.stepped = false;
				//Check horizontals
				for(var i=0; i < wall.length; i++) {
					if(this.collideLeft(wall[i])){
					//left side has hit a wall.
						//Check for stairs
						if(!wall[i].collidePoint(this.x +this.hitBox.x + this.sx, this.y +this.hitBox.y + this.hitBox.height - 40) && wall[i].collidePoint(this.x +this.hitBox.x + this.sx, this.y +this.hitBox.y + this.hitBox.height)&& !fall){
							this.sy = 0;
							this.x += this.sx
							if(!hitWall(this.x + this.hitBox.x, wall[i].y - this.hitBox.height)){//this.cFloor - this.hitBox.y)){
								this.y = wall[i].y - 200;
								this.stepped = true;
							}else{
								this.x -= this.sx
								this.sx = 0
								this.state = 0;
							}
						}else{
							this.x += Math.abs((wall[i].x + wall[i].width) - (this.x + this.hitBox.x)) + 1
							//this.x = wall[i].x + wall[i].width - this.hitBox.x + 40

							this.sx = 0;
						}
					//}else if(wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + this.hitBox.height - 5) || wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + 5) || wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + this.hitBox.height /2)){
					}else if(this.collideRight(wall[i])){
					//right wall collision
						//Check for stair step
						if(!wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + this.hitBox.height - 40)&&wall[i].collidePoint(this.x +this.hitBox.x + this.hitBox.width+ this.sx, this.y +this.hitBox.y + this.hitBox.height) && !fall){
							this.sy = 0;
							this.x += this.sx
							//this.falling();
						
							if(!hitWall(this.x + this.hitBox.x + this.hitBox.width, wall[i].y - this.hitBox.height)){
								//this.y = this.cFloor;
								this.y = wall[i].y - 200
								this.stepped = true;
							}else{
								this.x -= this.sx
								this.sx = 0
								this.state = 0;
							}
						}else{
							this.x -= Math.abs((wall[i].x) - (this.x +this.hitBox.x + this.hitBox.width)) + 1
							this.sx = 0;
						}
					}
				}
				if(!this.stepped) this.x += this.sx;
			
				
				//	ctx.fillStyle = 'green'
				//ctx.fillRect(this.x + this.hitBox.x, this.y + this.hitBox.y, this.hitBox.width, this.hitBox.height)
				ctx.save()
				
				//ctx.fillText(this.aimer.x + " " + this.aimer.y + " - " + this.taimer.x + " " + this.taimer.y, this.x, this.y+10); 
				
				//Process aiming
				dA = {x:Math.abs(this.taimer.x - this.aimer.x), y: Math.abs(this.taimer.y - this.aimer.y)}
				
				if(this.aimer.x < this.taimer.x - 100) this.aimer.x+=dA.x/5
				else if(this.aimer.x > this.taimer.x + 100) this.aimer.x-=dA.x/5;
				else this.aimer.x = this.taimer.x
				
				if(this.aimer.y < this.taimer.y - 100) this.aimer.y+=dA.y/5
				else if(this.aimer.y > this.taimer.y + 100) this.aimer.y-=dA.y/5;
				else this.aimer.y = this.taimer.y
				
				
				if(this.sw >= this.weapon.length) this.sw = 0;
				//if(this.aimer.x >= this.x + 100){
				if(this.weapon.length > 0){
					if((this.aimer.x > (90+this.weapon[this.sw].pX+this.x))){//facing right
						this.facing = 0
					}else{//facing left
						ctx.translate(this.x,this.y);
						ctx.scale(-1,1);
						this.facing = 1;
					}
				}else{
					if((this.aimer.x > (90+this.x))){//facing right
						this.facing = 0
					}else{//facing left
						ctx.translate(this.x,this.y);
						ctx.scale(-1,1);
						this.facing = 1;
					}
				}
				
		
				if(this.falling()){
				//fall
					this.sy += 2;
					this.state = 1;
					
					if(this.stats.wing > 0){//reduced gravity for flight
						//This is the reptile wing
						this.sy -= 1;
					}
					
					if(this.y > h*2 - 200) {//Stop falling at bottom of level
						this.sy = 0;
						this.y = h*2 - 200;
					}
				}
				
				
				if(this.state == 1 && !this.falling()) {//Airborne, collision with ground detected
					//this.hitBox.y =45
					//this.hitBox.height = 155
				
					if(this.sy > 0){
						this.state = 0;
						this.y = this.cFloor;
						this.sy = 0;	
					}
				}
					
				//Fallen into floor
				if (this.y + this.sy > this.cFloor && !this.falling()){
					this.sy = this.cFloor - this.y;
					this.state = 0
				}
				
				//hit head on ceiling
				if(this.hitHead() && this.sy <= 0)this.sy = 0;
				
				
				if(this.sy > terminalVel) this.sy = terminalVel;
				else if(this.sy < -terminalVel) this.sy = -terminalVel;
				
				this.y += this.sy;
				
				
				if(this.state == 0){//Standing Still
					if(this.facing==0)	{
						this.drawBody(0, this.x,this.y);
					}else {
						this.drawBody(0, -200,0);
					}
					this.sx = 0;
					this.aimArm(0);
					//this.hitBox.y = 45
					//this.hitBox.height = 155
				}else if(this.state == 1){//Jumping 
					if(this.facing == 0) this.drawBody(10, this.x,this.y);
					else this.drawBody(10, -200, 0);
					
					this.aimArm(-1)
					//this.hitBox.y = 45 //aborting jump hitbox resize
					//this.hitBox.height = 155
					if(ani == 0)this.aniFrame++;
					if(this.aniFrame > 2) this.aniFrame = 0;
				}else if(this.state == 2){//walking right
					if(this.facing == 0){
						this.drawBody(this.aniFrame, this.x,this.y);
					}else {
						this.drawBody(9 - this.aniFrame, -200, 0);
					}
					
					this.aimArm(2);
					//this.hitBox.y = 45
					//this.hitBox.height = 155
					if(ani == 0)this.aniFrame++;
					if(this.aniFrame > 8) this.aniFrame = 1;
					
					
					
					//Check horizontal collisions.
				//	for(var i=0; i < wall.length; i++) if(this.collideWallMove(wall[i])) this.sx = 0;
				}else if(this.state == 3){//walking left
					//this.sx = -1 * this.stats.speed;
					
					if(this.facing == 0) {
						this.drawBody(9 - this.aniFrame, this.x,this.y);
					}else {
						this.drawBody(this.aniFrame, -200, 0);
					}
					//this.hitBox.y = 45
					//this.hitBox.height = 155
					this.aimArm(2);
					if(ani == 0) this.aniFrame++;
					if(this.aniFrame > 8) this.aniFrame = 1;
	
				}else if(this.state == 4){//crouch
					
						if(this.facing == 0) {
							this.drawBody(9, this.x,this.y + 25);
						}else {
							this.drawBody(9, -200, 25);
						}
				//be sure to fix the hair, a regular hair from frame 1 (The second frame) has the same hair height as the jump frame
					//this.hitBox.y = 80
					//this.hitBox.height = 120
					this.aimArm(0);
					this.sx = 0;
				}else if(this.state == 5){
				//Death Animation
				//After animation remove creature from list in game engine, prevent shooting dead creature
					if(this.facing == 0) {
						this.drawBody(9, this.x,this.y);
					}else {
						this.drawBody(9, -200, 0);
					}
				}else{//Just in case something crazy happens
					//this.hitBox.y = 45
					//this.hitBox.height = 155
				}
		
		/*
				if(this.stats.health <= 0){
					if(this.facing == 0) {
						this.drawBody(12, this.x,this.y);
					}else {
						this.drawBody(12, -200, 0);
					}
		
				}*/
				ctx.restore();
				
				
				//Check collisions with items
				for(var i=0; i < items.length; i++){
					if(items[i].collideCreature(this))items[i].collect(this)
				}
				
				//Health bar
				if(this.stats.health > 0){
					ctx.fillStyle = '#220000'
					//ctx.fillRect(this.x + 40, this.y + 50, 2, 10);
					ctx.fillStyle = '#FF0000'
					//ctx.fillRect(this.x + 40, this.y + 60 - this.stats.health/10, 2, this.stats.health/10)
				}else {
					this.state = 0;
					if(!this.died) this.die()
				}
				
				//Cool lights!
				if(this.weapon[this.sw].type == 1 && this.light){
					var dc = dist(this.x+100, this.y+100, this.aimer.x,this.aimer.y)
					//if(dc > 130) roundLight(this.aimer.x,this.aimer.y, dc/2, 200/dc);
					//else roundLight(this.aimer.x,this.aimer.y, 70, 1);
					/*
					if(Math.floor(this.aimer.x/100) >= 0 && Math.floor(this.aimer.x/100) < mapGrid.length && Math.floor(this.aimer.y/100) >= 0 && Math.floor(this.aimer.y/100) < mapGrid[0].length){
						for(var i=0; i< mapGrid[Math.floor(this.aimer.x/100)][Math.floor(this.aimer.y/100)].panels.length; i++){
							wallPanels[mapGrid[Math.floor(this.aimer.x/100)][Math.floor(this.aimer.y/100)].panels[i]].light += 0.2
						}
					}
					*/
					//lightArea(this.aimer.x, this.aimer.y,1,0.1);
					//ctx.fillStyle = 'yellow'
					//ctx.fillText(Math.floor(dc) + " " + (1-dc/1200)/10, this.x, this.y);
					if(dc > 50 && dc < 1200) lightRegion(this.aimer.x,this.aimer.y, Math.floor((dc/2)/lightRes), (1- dc/1200)/3);
					else if(dc <= 50) lightRegion(this.aimer.x,this.aimer.y, 5, 0.2);
				}
				//	Path stuff
				/*
				ctx.fillStyle = 'red'
				ctx.fillText(this.path.length, this.x + 100, this.y + 100, 10,10);
				ctx.beginPath()
				ctx.moveTo(this.x+100, this.y+100);
				ctx.strokeStyle = 'yellow'
				for(var i=0; i < this.path.length; i++){
					ctx.lineTo(this.path[i].x*50 + 25, this.path[i].y*50 + 25);
				
				}
				ctx.stroke()
				ctx.closePath();
				ctx.strokeStyle = 'black'*/
				ctx.translate(oDx + 100, oDy + 100)
				ctx.rotate(-fAngle)
				ctx.translate(-oDx-100, -oDy-100);
				
				/*
				this.aniCount++
				if(this.aniCount >= this.aniSpeed) this.aniCount = 0
				else{
					this.x = oldState.x
					this.y = oldState.y
					this.sx = oldState.sx
					this.sy = oldState.sy
					this.aniFrame = oldState.aF
				
				}*/
				
				
				
			},
			aimArm:function(x){
			
				var angle = Math.atan((this.aimer.y - (this.y + 80 + this.weapon[this.sw].pY)) / (this.aimer.x-(90+this.weapon[this.sw].pX+this.x)))
				var off = 0 
				
			
				
				if(x == 0) off = 10
				if(this.state == 4) off -= 35
				this.canFire = true;
				if(this.facing == 0){
					
				}else angle*= -1
				
				
				
				//if(this.reloading != -1) angle = 0;  //Some kind of forced reloading holding angle
	
				if(this.stats.health <= 0){
					if(this.facing == 0) angle = -1.1;
					else angle = 1.1
					off -= this.deathF*8;
					this.recoil = 0;
					this.canFire = false
					this.fireCool = 0;
					
				}
				
				if(this.reloading >= 0) this.canFire = false;
				if(this.stats.health >0){
				//ctx.save();
				
					if(this.facing == 0) ctx.translate(95+this.x+ this.weapon[this.sw].pX, 90 + this.y - off+ this.weapon[this.sw].pY);
					else ctx.translate(95 - 200 + rand(0)+ this.weapon[this.sw].pX, 90 + rand(0) - off+ this.weapon[this.sw].pY);
				
				if(this.recoil > 0)	angle -= degRad(rand(5));
				ctx.rotate(angle);
		
				if(this.recoil > 0) {
					if(this.weapon[this.sw].firePic[this.recoil-1] == null){
						this.recoil = 1
					}
					
					if(this.weapon[this.sw].type == 1 && this.light) directedLight(50, 0, 100);
					if(this.weapon[this.sw].firePic.length > 0)ctx.drawImage(this.weapon[this.sw].firePic[this.recoil - 1], this.weapon[this.sw].oX - 1, this.weapon[this.sw].oY)
					
					//if (this.weapon[this.sw].type == 3) ctx.drawImage(this.weapon[0].firePic[this.recoil - 1], this.weapon[0].oX - 1, this.weapon[0].oY)
				
					 this.recoil--;
				}else {
				
					if(this.reloading == -1) {
						
						if(this.weapon[this.sw].type == 1 &&this.light)directedLight(50, 0, 100);
						if(this.weapon[this.sw].pic != null) {
							if(this.weapon[this.sw].type == 1) ctx.drawImage(this.weapon[this.sw].pic, 0,0,150,40,this.weapon[this.sw].oX, this.weapon[this.sw].oY, 150,40)
							else ctx.drawImage(this.weapon[this.sw].pic, this.weapon[this.sw].oX, this.weapon[this.sw].oY)
						}
					}else{
						if(this.weapon[this.sw].type == 1 && this.light)directedLight(50, 0, 100);
						if(this.weapon[this.sw].pic!= null) ctx.drawImage(this.weapon[this.sw].pic, 0,this.reloading * 40 + 40,150,40,this.weapon[this.sw].oX, this.weapon[this.sw].oY, 150,40)
						
						if(ani == 0) this.reloading += 1;
						if(this.reloading > 2) this.reloading = -1;
					}
						
				}
				//ctx.restore();
				ctx.rotate(-angle);
				}
				if(this.fireCool > 0) this.fireCool--;
				
			},
			falling:function(){
				//this.cFloor = 0;
				//return this.y < 0
				this.cFloor = -1;
				var result = true;
				for(var i=0; i < wall.length; i++) if(this.collideBottom(wall[i])) {result = false; this.cFloor = wall[i].y - 200;}
				
				return result;
			},
			hitHead:function(){
				
				var result = false;
				for(var i=0; i < wall.length; i++) if(this.collideTop(wall[i])) {result = true;}
				
				return result;
			},
			collideCreature:function(obj){
			
			
			},
			collidePoint:function(x,y){
				return (x >= this.x + this.hitBox.x && x <= this.x+this.hitBox.x + this.hitBox.width && y >= this.y + this.hitBox.y && y <= this.y + this.hitBox.y + this.hitBox.height)
			},
			collideLeft: function(obj){
				var result = false;
				for(var i = this.y + this.hitBox.y + 5;i < this.y + this.hitBox.y + this.hitBox.height - 5; i+=10){
					if(obj.collidePoint(this.x + this.hitBox.x + this.sx, i)) return true
				}
				
				return result;
			},
			collideRight:function(obj){
				var result = false;
				for(var i = this.y + this.hitBox.y + 5; i < this.y + this.hitBox.y + this.hitBox.height - 5; i+=10){
					if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width + this.sx, i)) return true
				}
				
				return result;
			},
			collideWall:function(obj){
				var result = false;
				
				if(this.collidePoint(obj.x,obj.y)) result = true;
				else if(this.collidePoint(obj.x + obj.width,obj.y)) result = true;
				else if(this.collidePoint(obj.x,obj.y + obj.height)) result = true;
				else if(this.collidePoint(obj.x + obj.width,obj.y + obj.height)) result = true;
				
				if(obj.collidePoint(this.x + this.hitBox.x, this.y + this.hitBox.y)) result = true;
				else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width, this.y + this.hitBox.y)) result = true;
				else if(obj.collidePoint(this.x + this.hitBox.x, this.y + this.hitBox.y + this.hitBox.height)) result = true;
				else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width, this.y + this.hitBox.y + this.hitBox.height)) result = true;
				
				if(this.collideLeft(obj) || this.collideRight(obj)) result = true
				
				return result;
			},
			collideBottom:function(obj){
				var result = false;
				
				//if(this.collidePoint(obj.x,obj.y)) result = true;
				//else if(this.collidePoint(obj.x + obj.width,obj.y)) result = true;
				if(this.collidePoint(obj.x,obj.y + obj.height)) result = true;
				else if(this.collidePoint(obj.x + obj.width/2,obj.y + obj.height)) result = true;
				else if(this.collidePoint(obj.x + obj.width,obj.y + obj.height)) result = true;
				
				//if(obj.collidePoint(this.x + this.hitBox.x, this.y + this.hitBox.y)) result = true;
				//else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width, this.y + this.hitBox.y)) result = true;
			//	if(obj.collidePoint(this.x + this.hitBox.x, this.y + this.hitBox.y + this.hitBox.height + this.sy)) result = true;
			//	else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width/2, this.y + this.sy + this.hitBox.y + this.hitBox.height)) result = true;
			//	else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width, this.y + this.sy + this.hitBox.y + this.hitBox.height)) result = true;
				
				for(var i=this.x + this.hitBox.x; i <= this.x + this.hitBox.x + this.hitBox.width; i+= 10){
					if(obj.collidePoint(i, this.y + this.sy + this.hitBox.y + this.hitBox.height)) {
						result = true;
						break;
					}
				}
				
				
				return result;
			},
			collideTop:function(obj){
				var result = false;
				
				//if(this.collidePoint(obj.x,obj.y)) result = true;
				//else if(this.collidePoint(obj.x + obj.width,obj.y)) result = true;
				//if(this.collidePoint(obj.x,obj.y + obj.height)) result = true;
				//else if(this.collidePoint(obj.x + obj.width,obj.y + obj.height)) result = true;
				
				if(obj.collidePoint(this.x + this.hitBox.x, this.y + this.hitBox.y + this.sy)) result = true;
				else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width, this.y + this.hitBox.y + this.sy)) result = true;
				else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width/3, this.y + this.hitBox.y + this.sy)) result = true;
				else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width*2/3, this.y + this.hitBox.y + this.sy)) result = true;
				//if(obj.collidePoint(this.x + this.hitBox.x, this.y + this.hitBox.y + this.hitBox.height)) result = true;
				//else if(obj.collidePoint(this.x + this.hitBox.x + this.hitBox.width, this.y + this.hitBox.y + this.hitBox.height)) result = true;
				
				return result;
			},
			getCorner:function(){
			//Returns a corner on the hitbox not currently impacting any walls or stuck in mapGrid
				var result = {x:-1,y:-1}
				
				//console.log("getCorner report.");
				//console.log("Left coordinates: " + Math.floor((this.x + this.hitBox.x)/100) + ", " + Math.floor((this.y + this.hitBox.y)/100) + "--> " + mapGrid[Math.floor((this.x + this.hitBox.x)/100)][Math.floor((this.y + this.hitBox.y)/100)]);
				//console.log("Right coordinates: " + Math.floor((this.x + this.hitBox.x + this.hitBox.width)/100) + ", " + Math.floor((this.y + this.hitBox.y)/100));
				if(mapGrid[Math.floor((this.x + this.hitBox.x)/50)][Math.floor((this.y + this.hitBox.y)/50)].wall == false) {
					result = {x:Math.floor((this.x + this.hitBox.x)/50), y:Math.floor((this.y + this.hitBox.y)/50)};
					//console.log("Top left corner is fine.");
			}else if(mapGrid[Math.floor((this.x + this.hitBox.x + this.hitBox.width)/50)][Math.floor((this.y + this.hitBox.y)/50)].wall == false) result = {x:Math.floor((this.x + this.hitBox.x + this.hitBox.width)/50), y:Math.floor((this.y + this.hitBox.y)/50)};
				
				
				return result;
			},
			collideWallMove:function(obj){//Allows a 1 pixel slippery area
				var result = false;
				
				if(this.collidePoint(obj.x+1,obj.y+1)) result = true;
				else if(this.collidePoint(obj.x + obj.width - 1,obj.y+1)) result = true;
				else if(this.collidePoint(obj.x + 1,obj.y + obj.height + 1)) result = true;
				else if(this.collidePoint(obj.x + obj.width-1,obj.y + obj.height - 1)) result = true;
				
				if(obj.collidePointNoEdge(this.x + this.hitBox.x, this.y + this.hitBox.y)) result = true;
				else if(obj.collidePointNoEdge(this.x + this.hitBox.x + this.hitBox.width, this.y + this.hitBox.y)) result = true;
				else if(obj.collidePointNoEdge(this.x + this.hitBox.x, this.y + this.hitBox.y + this.hitBox.height)) result = true;
				else if(obj.collidePointNoEdge(this.x + this.hitBox.x + this.hitBox.width, this.y + this.hitBox.y + this.hitBox.height)) result = true;
				
				return result;
			},
			td:0,//Used for distance sound calculations
			reload: function(){
				var savedAmmo = this.weapon[this.sw].clip
				if(this.weapon[this.sw].ammo >= this.weapon[this.sw].capacity){
					this.weapon[this.sw].ammo -= this.weapon[this.sw].capacity;
					this.weapon[this.sw].clip = this.weapon[this.sw].capacity;
					this.reloading = 0;
					this.weapon[this.sw].ammo += savedAmmo;
				}else if(this.weapon[this.sw].ammo > 0){
					this.weapon[this.sw].clip = this.weapon[this.sw].ammo;
					this.weapon[this.sw].ammo = 0;
					this.reloading = 0;
					this.weapon[this.sw].ammo += savedAmmo;
				}
				
				if(this.weapon[this.sw].ammo <= 0) this.speak("Out of ammo!");
			},
			fire:function(){ //x and y are the destination of the projectile
				if(this.weapon[this.sw].sound != null){
					this.td = dist(this.x+100, this.y +100, -ctxOx + w/2, -ctxOy + h/2)
					if(this.td < 500 && this.weapon[this.sw].clip > 0){
						for(var i=0; i < this.weapon[this.sw].sound.length; i++){
							if(this.weapon[this.sw].sound[i].soundVar.currentTime == 0){
							
								this.weapon[this.sw].sound[i].setVolume(1-this.td/500);
								this.weapon[this.sw].sound[i].play();
								break;
							
							}
						}
					}
				}
				var sx = this.x + this.weapon[this.sw].pX + 95
				var sy = this.y + this.weapon[this.sw].pY + 90
				
				var dc = dist(this.aimer.x, this.aimer.y, sx,sy);
				var x = this.aimer.x + rand(dc/this.weapon[this.sw].accuracy)//rand(this.weapon[this.sw].accuracy)-this.weapon[this.sw].accuracy/2
				var y = this.aimer.y + rand(dc/this.weapon[this.sw].accuracy)//rand(this.weapon[this.sw].accuracy)-this.weapon[this.sw].accuracy/2
				
				
				
				var ta, tb;
				
				var results = [];
				
				
				//t:0 means is a wall
				for(var i=0; i < wall.length; i++){
					ta = slope(sx,sy,x,y) * (wall[i].x - sx) + sy;
					tb = slope(sx,sy,x,y) * (wall[i].x +wall[i].width- sx) + sy;
					
					if(x > sx && ta >= wall[i].y && ta <= wall[i].y + wall[i].height) results.push({x:wall[i].x,y: ta, t:-1});
					else if(sx > x && tb >= wall[i].y && tb <= wall[i].y + wall[i].height) results.push({x:wall[i].x + wall[i].width,y: tb, t:-1});
					
					ta = (wall[i].y - sy) / slope(sx,sy,x,y)  + sx;
					tb = (wall[i].y + wall[i].height - sy) / slope(sx,sy,x,y)  + sx;
					
					if(y > sy && ta >= wall[i].x && ta <= wall[i].x + wall[i].width) results.push({x: ta, y:wall[i].y, t:-1});
					else if(y < sy && tb >= wall[i].x && tb <= wall[i].x + wall[i].width) results.push({x: tb, y:wall[i].y + wall[i].height, t:-1});
				}
				//replicate for all creatures
				for(var i=0; i < creature.length;i++){
				//Same as above
				//Add provision with id numbers so that creature doesn't shoot itself
					if(creature[i].stats.health > 0 && creature[i].stats.type != this.stats.type){
						ta = slope(sx,sy,x,y) * (creature[i].x + creature[i].hitBox.x - sx) + sy;
						tb = slope(sx,sy,x,y) * (creature[i].x +creature[i].hitBox.x + creature[i].hitBox.width- sx) + sy;
					
						if(x > sx && ta >= creature[i].y + creature[i].hitBox.y && ta <= creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height) results.push({x:creature[i].x + creature[i].hitBox.x,y: ta, t:i});
						else if(sx > x && tb >= creature[i].y + creature[i].hitBox.y && tb <= creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height) results.push({x:creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width,y: tb, t:i});
					
						ta = (creature[i].y + creature[i].hitBox.y - sy) / slope(sx,sy,x,y)  + sx;
						tb = (creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height - sy) / slope(sx,sy,x,y)  + sx;
					
						if(y > sy && ta >= creature[i].x + creature[i].hitBox.x && ta <=creature[i].x +creature[i].hitBox.x + creature[i].hitBox.width) results.push({x: ta, y:creature[i].y + creature[i].hitBox.y, t:i});
						else if(y < sy && tb >= creature[i].x +creature[i].hitBox.x && tb <= creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width) results.push({x: tb, y:creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height, t:i});
					}
				}
				
				//sift out the horizontal sides not needed
				for(var i=0; i < results.length; i++){
					if(x > sx){ //firing to the right
						if(results[i].x < sx){//Is on the left
							results.splice(i,1);
							i--;
						}
					}else{//Firing left
						if(results[i].x > sx){//Is on the right
							results.splice(i,1);
							i--;
						}
					}
				}
				//Splice out the verticals
				for(var i=0; i < results.length; i++){
					if(y > sy){ //
						if(results[i].y < sy){//
							results.splice(i,1);
							i--;
						}
					}else{//
						if(results[i].y > sy){//
							results.splice(i,1);
							i--;
						}
					}
				}
				
				if(this.weapon[this.sw].type == 1){//Ranged projectile weapon
				//Check ammo counts, clear results if no ammo
				
				if(this.reloading != -1 || this.fireCool > 0){//Weapon currently reloading
					results = []; 
					
				}else{
				if(this.weapon[this.sw].clip <= 0){ //Magazine has no ammo
					results = [];
					this.reload();
				
				}else if(this.fireCool <= 0) {
					this.weapon[this.sw].clip--;
					//lightArea(sx,sy, 2, 0.5);
					lightRegion(sx,sy, 16, 0.4);
				}
				}
				
				
				//Find the closest one to the source
				if(results.length > 0){
					var bestI = 0;
					var bestV = dist(sx,sy, results[0].x,results[0].y);
				
					for(var c=1; c < results.length; c++){
						if(dist(sx,sy, results[c].x,results[c].y) < bestV){
							bestV = dist(sx,sy, results[c].x,results[c].y);
							bestI = c;
						}
					}
					
					if(results[bestI].t >= 0){
						results[bestI].x = creature[results[bestI].t].x + creature[results[bestI].t].hitBox.x + rand(creature[results[bestI].t].hitBox.width)
						
						
						if(creature[results[bestI].t].stats.armorPlate) creature[results[bestI].t].stats.health -= Math.round(this.weapon[this.sw].stats.damage * (Math.random() /10 + 0.5));
						else creature[results[bestI].t].stats.health -= Math.round(this.weapon[this.sw].stats.damage);
						
						//Make creature just hit target this one
						
						this.gainXP(Math.round(this.weapon[this.sw].stats.damage / 5));
						creature[results[bestI].t].enemies[0] = this
						creature[results[bestI].t].target = 0
						if(creature[results[bestI].t].stats.type == 3){
							if(creature[results[bestI].t].weapon[creature[results[bestI].t].sw].useless) creature[results[bestI].t].sw = 1;
						}
						
						bloodSplat.push(createBlood(results[bestI].x,results[bestI].y));
						if(this.weapon[this.sw].stats.burst > 1) bloodSplat.push(createBlood(results[bestI].x - rand(14) + 7,results[bestI].y - rand(14) + 7));
						if(this.weapon[this.sw].stats.burst > 2) bloodSplat.push(createBlood(results[bestI].x + rand(14) - 7,results[bestI].y + rand(14) - 7));
					}else{
						sparks.push(createSpark(results[bestI].x,results[bestI].y));
						if(this.weapon[this.sw].stats.burst > 1) sparks.push(createSpark(results[bestI].x - rand(14) + 7,results[bestI].y - rand(14) + 7));
						if(this.weapon[this.sw].stats.burst > 2) sparks.push(createSpark(results[bestI].x + rand(14) - 7,results[bestI].y + rand(14) - 7));
					}
				}
				
				if(this.stats.health > 0 && this.reloading == -1 && this.weapon[this.sw].clip > 0){
					this.fireCool = this.weapon[this.sw].stats.coolDown;
					this.recoil = this.weapon[this.sw].firePic.length
				}
				
				}else if (this.weapon[this.sw].type == 0 || this.weapon[this.sw].type == 3){
					//Melee Weapons
					
					for(var i=0; i < results.length;i++){
						if(dist(this.x+100, this.y+100, results[i].x, results[i].y) > this.weapon[this.sw].stats.range || results[i].t < 0){
							results.splice(i,1);
							i--;
						}
					}
					
					for(var i=0; i < results.length;i++){
						if(results[i].t >= 0) {
							creature[results[i].t].stats.health -= Math.round(this.weapon[this.sw].stats.damage)
							if(this.weapon[this.sw].type == 3) {
								this.stats.health += Math.round(this.weapon[this.sw].stats.damage)
								if(this.stats.health > this.stats.maxHealth) this.stats.health = this.stats.maxHealth;
							}
							this.gainXP(Math.round(this.weapon[this.sw].stats.damage / 5));	
							creature[results[i].t].enemies[0] = this
							creature[results[i].t].target = 0
							if(creature[results[i].t].stats.type == 3){
								if(creature[results[i].t].weapon[creature[results[i].t].sw].useless) creature[results[i].t].sw = 1;
							}
						
						}
					}
					
					if(this.stats.health > 0){
						this.fireCool = this.weapon[this.sw].stats.coolDown;
						this.recoil = this.weapon[this.sw].firePic.length
					}
				}
				
				
			},
			WillFire:function(){ //x and y are the destination of the projectile
				var sx = this.x //+ this.weapon[this.sw].pX + 95
				var sy = this.y //+ this.weapon[this.sw].pY + 90
				
				var dc = dist(this.aimer.x, this.aimer.y, sx,sy);
				var x = this.aimer.x //+ rand(dc/this.weapon[this.sw].accuracy)//rand(this.weapon[this.sw].accuracy)-this.weapon[this.sw].accuracy/2
				var y = this.aimer.y //+ rand(dc/this.weapon[this.sw].accuracy)//rand(this.weapon[this.sw].accuracy)-this.weapon[this.sw].accuracy/2
				
				
				
				var ta, tb;
				
				var results = [];
				
				
				//t:0 means is a wall
				for(var i=0; i < wall.length; i++){
					ta = slope(sx,sy,x,y) * (wall[i].x - sx) + sy;
					tb = slope(sx,sy,x,y) * (wall[i].x +wall[i].width- sx) + sy;
					
					if(x > sx && ta >= wall[i].y && ta <= wall[i].y + wall[i].height) results.push({x:wall[i].x,y: ta, t:-1});
					else if(sx > x && tb >= wall[i].y && tb <= wall[i].y + wall[i].height) results.push({x:wall[i].x + wall[i].width,y: tb, t:-1});
					
					ta = (wall[i].y - sy) / slope(sx,sy,x,y)  + sx;
					tb = (wall[i].y + wall[i].height - sy) / slope(sx,sy,x,y)  + sx;
					
					if(y > sy && ta >= wall[i].x && ta <= wall[i].x + wall[i].width) results.push({x: ta, y:wall[i].y, t:-1});
					else if(y < sy && tb >= wall[i].x && tb <= wall[i].x + wall[i].width) results.push({x: tb, y:wall[i].y + wall[i].height, t:-1});
				}
				//replicate for all creatures
				for(var i=0; i < creature.length;i++){
				//Same as above
				//Add provision with id numbers so that creature doesn't shoot itself
					if(creature[i].stats.health > 0 && creature[i].stats.type != this.stats.type){
						ta = slope(sx,sy,x,y) * (creature[i].x + creature[i].hitBox.x - sx) + sy;
						tb = slope(sx,sy,x,y) * (creature[i].x +creature[i].hitBox.x + creature[i].hitBox.width- sx) + sy;
					
						if(x > sx && ta >= creature[i].y + creature[i].hitBox.y && ta <= creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height) results.push({x:creature[i].x + creature[i].hitBox.x,y: ta, t:i});
						else if(sx > x && tb >= creature[i].y + creature[i].hitBox.y && tb <= creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height) results.push({x:creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width,y: tb, t:i});
					
						ta = (creature[i].y + creature[i].hitBox.y - sy) / slope(sx,sy,x,y)  + sx;
						tb = (creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height - sy) / slope(sx,sy,x,y)  + sx;
					
						if(y > sy && ta >= creature[i].x + creature[i].hitBox.x && ta <=creature[i].x +creature[i].hitBox.x + creature[i].hitBox.width) results.push({x: ta, y:creature[i].y + creature[i].hitBox.y, t:i});
						else if(y < sy && tb >= creature[i].x +creature[i].hitBox.x && tb <= creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width) results.push({x: tb, y:creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height, t:i});
					}
				}
				
				//sift out the horizontal sides not needed
				for(var i=0; i < results.length; i++){
					if(x > sx){ //firing to the right
						if(results[i].x < sx){//Is on the left
							results.splice(i,1);
							i--;
						}
					}else{//Firing left
						if(results[i].x > sx){//Is on the right
							results.splice(i,1);
							i--;
						}
					}
				}
				//Splice out the verticals
				for(var i=0; i < results.length; i++){
					if(y > sy){ //
						if(results[i].y < sy){//
							results.splice(i,1);
							i--;
						}
					}else{//
						if(results[i].y > sy){//
							results.splice(i,1);
							i--;
						}
					}
				}
				

				
				//Find the closest one to the source
				if(results.length > 0){
					var bestI = 0;
					var bestV = dist(sx,sy, results[0].x,results[0].y);
				
					for(var c=1; c < results.length; c++){
						if(dist(sx,sy, results[c].x,results[c].y) < bestV){
							bestV = dist(sx,sy, results[c].x,results[c].y);
							bestI = c;
						}
					}
					
					if(results[bestI].t >= 0){
						results[bestI].x = creature[results[bestI].t].x + creature[results[bestI].t].hitBox.x + rand(creature[results[bestI].t].hitBox.width)
						//creature[results[bestI].t].stats.health -= this.weapon[this.sw].stats.damage;
						return results[bestI].t
					}else return -1;
				}
				
				
				
				
				
				
			},
			WillFireGeneral:function(){ //x and y are the destination of the projectile
				var sx = this.x +100//+ this.weapon[this.sw].pX + 95
				var sy = this.y +100//+ this.weapon[this.sw].pY + 90
				
				var dc = dist(this.aimer.x, this.aimer.y, sx,sy);
				var x = this.aimer.x //+ rand(dc/this.weapon[this.sw].accuracy)//rand(this.weapon[this.sw].accuracy)-this.weapon[this.sw].accuracy/2
				var y = this.aimer.y //+ rand(dc/this.weapon[this.sw].accuracy)//rand(this.weapon[this.sw].accuracy)-this.weapon[this.sw].accuracy/2
				
				var ta, tb;
				
				var results = [];
				
				
				//t:-1 means is a wall
				for(var i=0; i < wall.length; i++){
					ta = slope(sx,sy,x,y) * (wall[i].x - sx) + sy;
					tb = slope(sx,sy,x,y) * (wall[i].x +wall[i].width- sx) + sy;
					
					if(x > sx && ta >= wall[i].y && ta <= wall[i].y + wall[i].height) results.push({x:wall[i].x,y: ta, t:-1});
					else if(sx > x && tb >= wall[i].y && tb <= wall[i].y + wall[i].height) results.push({x:wall[i].x + wall[i].width,y: tb, t:-1});
					
					ta = (wall[i].y - sy) / slope(sx,sy,x,y)  + sx;
					tb = (wall[i].y + wall[i].height - sy) / slope(sx,sy,x,y)  + sx;
					
					if(y > sy && ta >= wall[i].x && ta <= wall[i].x + wall[i].width) results.push({x: ta, y:wall[i].y, t:-1});
					else if(y < sy && tb >= wall[i].x && tb <= wall[i].x + wall[i].width) results.push({x: tb, y:wall[i].y + wall[i].height, t:-1});
				}
				
				//replicate for all creatures
				for(var i=0; i < creature.length;i++){
				//Same as above
				//Add provision with id numbers so that creature doesn't shoot itself
					if(creature[i].stats.health > 0 && creature[i].stats.type != this.stats.type){
						ta = slope(sx,sy,x,y) * (creature[i].x + creature[i].hitBox.x - sx) + sy;
						tb = slope(sx,sy,x,y) * (creature[i].x +creature[i].hitBox.x + creature[i].hitBox.width- sx) + sy;
					
						if(x > sx && ta >= creature[i].y + creature[i].hitBox.y && ta <= creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height) results.push({x:creature[i].x + creature[i].hitBox.x,y: ta, t:i});
						else if(sx > x && tb >= creature[i].y + creature[i].hitBox.y && tb <= creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height) results.push({x:creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width,y: tb, t:i});
					
						ta = (creature[i].y + creature[i].hitBox.y - sy) / slope(sx,sy,x,y)  + sx;
						tb = (creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height - sy) / slope(sx,sy,x,y)  + sx;
					
						if(y > sy && ta >= creature[i].x + creature[i].hitBox.x && ta <=creature[i].x +creature[i].hitBox.x + creature[i].hitBox.width) results.push({x: ta, y:creature[i].y + creature[i].hitBox.y, t:i});
						else if(y < sy && tb >= creature[i].x +creature[i].hitBox.x && tb <= creature[i].x + creature[i].hitBox.x + creature[i].hitBox.width) results.push({x: tb, y:creature[i].y + creature[i].hitBox.y + creature[i].hitBox.height, t:i});
					}
				}
				//sift out the horizontal sides not needed
				for(var i=0; i < results.length; i++){
					if(x > sx){ //firing to the right
						if(results[i].x < sx){//Is on the left
							results.splice(i,1);
							i--;
						}
					}else{//Firing left
						if(results[i].x > sx){//Is on the right
							results.splice(i,1);
							i--;
						}
					}
				}
				//Splice out the verticals
				for(var i=0; i < results.length; i++){
					if(y > sy){ //
						if(results[i].y < sy){//
							results.splice(i,1);
							i--;
						}
					}else{//
						if(results[i].y > sy){//
							results.splice(i,1);
							i--;
						}
					}
				}
				
				
				//Find the closest one to the source
				if(results.length > 0){
					
					var bestI = 0;
					var bestV = dist(sx,sy, results[0].x,results[0].y);
				
					for(var c=0; c < results.length; c++){
						if(dist(sx,sy, results[c].x,results[c].y) < bestV){
							bestV = dist(sx,sy, results[c].x,results[c].y);
							bestI = c;
						}
					}
					
					return results[bestI].t >= 0
						
				}
				return false;
			}
			
	
	
		}
		
		return result;
		
	}
	
	
	
	
	
	
	function rand(n){
		return Math.floor(Math.random() * n);
	}
	
	
	function staticLight(a,b,c){
		this.x = a
		this.y = b
		this.size = c
		this.draw = function(){
			roundLight(this.x,this.y,this.size + rand(4), 1)
		};
	}
	
	function pulseLight(a,b){
		this.type = "PLight"
		this.x = []
		this.y = []
		this.x.push(a)
		this.y.push(b)
		this.addPLight = function (i,j){
			this.x.push(i);
			this.y.push(j);
		}
		this.size = 15
		this.on = 0;
		this.timer = 0
		this.rTime = 40
		this.distance = 0
		this.sound = null//pulseLightSound[rand(pulseLightSound.length)]
		this.temp = -1;
		this.draw = function(){
			if(this.timer <= 0) {
				roundLight(this.x[this.on],this.y[this.on],this.size, 1)
				this.on++
			}else this.timer--;
			
			if(this.on >= this.x.length){
				this.timer = this.rTime;
				this.on = 0;
			}
			
			this.distance = dist(this.x[this.on], this.y[this.on], -ctxOx + w/2, -ctxOy + h/2)
				if(this.distance < 300 && this.timer == 0) {
					if(this.sound == null){
						this.temp = getSound(pulseLightSound)
						if(this.temp != -1) {
							this.sound = pulseLightSound[this.temp]
							this.sound.claimed = true
						}
					}
					if(this.sound != null){
						this.sound.play();
						this.sound.setVolume ((1- this.distance / 300)/3); //has a 50% drop in volume
						//if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
						
					}
				}else {
					if(this.sound != null){
						//this.sound.pause();
						this.sound.claimed = false;
						this.sound = null
					}
				}
			
			/*
			this.timer--;
			if(this.timer < 0) {
				this.timer = 1
				this.on++
				if(this.on > this.x.length) this.on = 0;
			}*/
			
		};
	}
	
	
	
	
	
	
	function angledLight(a,b,c,d){
		this.x = a;
		this.y = b;
		this.size = c;
		this.angle = d;
		this.draw = function(){directedAngleLight(this.x,this.y,this.size, this.angle)};
	}
	
	function spinLight(a,b,c,d){
		this.x = a;
		this.y = b;
		this.size = c;
		this.CSize = c;
		this.angle = d;
		this.sound = null;//spinSound[rand(spinSound.length)]
		this.temp = -1;
		this.distance = 0;
		this.draw = function(){
			ctx.drawImage(spinLightPic, this.x,this.y);
			if(Math.abs(this.CSize) < 40) {
				roundLight(this.x+5,this.y+10, 30, 1);	
				lightRegion(this.x+5, this.y+5, 4, 0.5);
			}else roundLight(this.x+5,this.y+10, 20, 0.5);
	
			//directedAngleLight(this.x+5,this.y+10,this.CSize, this.angle)
			//directedAngleLight(this.x+5,this.y+10,this.CSize* -1, this.angle)
			
			lightRegion(this.x - this.CSize, this.y + 10, 4, 0.2);
			lightRegion(this.x +this.CSize, this.y + 10, 4, 0.2);
			
			this.CSize-=15;
			
			if(this.CSize <= this.size * -1) this.CSize = this.size
			
			
			this.distance = dist(this.x, this.y, -ctxOx + w/2, -ctxOy + h/2)
				if(this.distance < 200) {
					if(this.sound == null){
						this.temp = getSound(spinSound)
						if(this.temp != -1) {
							this.sound = spinSound[this.temp]
							this.sound.claimed = true
						}
					}
					if(this.sound!= null){
					//	this.sound.play();
						this.sound.setVolume ((1- this.distance / 200 / 10)); //has a 50% drop in volume
						if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
					}
				}else {
					if(this.sound != null){
						this.sound.stop();
						this.sound.claimed = false;
						this.sound = null
					}
				}
		}
	}
	
	function roundLight(x,y,size, intensity){
		ctx.globalAplha = 0.1 * intensity;
		ctx.fillStyle = 'white'
		lightRegion(x,y, 8, 0.2 + Math.random()/50);
		//lightRegion(x,y, 8, 0.2 + Math.random()/50, {r:0,g:100,b:100});
		for(var i=0 ; i < size; i+=size/40){
				ctx.globalAlpha = ((size - i)/size)/10 * intensity;
				ctx.beginPath();
			
				ctx.arc(x, y, i*0.5, 0, Math.PI*2);
				ctx.fill();
				ctx.closePath();
			}
		ctx.globalAlpha = 1;
	}
	
	function directedLight(x,y,size){
		ctx.globalAplha = 0.1;
		ctx.fillStyle = 'white'
		
		for(var i=0 ; i < size; i+=size/40){
				ctx.globalAlpha = ((size - i)/size)/10;
				ctx.beginPath();
			
				ctx.arc(x + i, y, i*0.2, 0, Math.PI*2);
				ctx.fill();
				ctx.closePath();
			}
		ctx.globalAlpha = 1;
	}
	
	function directedAngleLight(x,y,s, a){
		ctx.save();
		
		ctx.globalAplha = 0.1;
		ctx.fillStyle = 'white'
		var angle = a;
		var size = Math.abs(s);
		if (s < 0) angle += 180;
		
		
		
		ctx.translate(x,y);
		ctx.rotate(degRad(angle));
		for(var i=0 ; i < size; i+=size/40){
				ctx.globalAlpha = ((size - i)/size)/10;
				ctx.beginPath();
			
				ctx.arc(i, 0, i*0.2, 0, Math.PI*2);
				if(Math.random() < 0.95) ctx.fill();
				ctx.closePath();
				
				
			}
		ctx.globalAlpha = 1;
		ctx.restore();
	}
	
	
	function wordTicker(a,b,m){
		this.x = a
		this.y = b
		this.message = m
		this.ani = 0
		this.draw = function(){
			ctx.fillStyle = 'black'
			ctx.globalAlpha = 0.4
			ctx.fillRect(this.x,this.y, 100, 20);
			ctx.font = 'Bold 8pt Orbitron';
			ctx.fillStyle = 'red'
			ctx.globalAlpha = this.ani/10
			ctx.fillText(this.message, this.x + 50 - ctx.measureText(this.message).width/2, this.y + 15);
			
			ctx.fillRect(this.x +5, this.y + 2 + this.ani/10, 90, this.ani/5);
			ctx.fillRect(this.x +5, this.y + 18 - this.ani/10, 90, this.ani/5);
			ctx.globalAlpha = 1;
			this.ani++
			
			if(this.ani > 10) this.ani = 0
			//lightStrip(this.x,this.y, {x:100,y:10}, 1);
			//lightRegion(this.x,this.y, 2, 1);
			//lightRegion(this.x + 100,this.y, 2, 1);
		}
		this.shade = function(){}
	}
	
	
	function lightArea(x,y, r, intensity){
	var gX = Math.floor(x/100)
	var gY = Math.floor(y/100)

	for(var i = gX - r; i <= gX+r; i++){
		for(var j = gY - r; j <= gY+r; j++){
			if(i >= 0 && i < mapGrid.length && j >= 0 && j < mapGrid[0].length){
				for(var a=0; a< mapGrid[i][j].panels.length; a++){
					if(dist(gX,gY,i,j) > 0) wallPanels[mapGrid[i][j].panels[a]].light += intensity * r/(dist(gX,gY, i,j))
					else wallPanels[mapGrid[i][j].panels[a]].light += intensity*10
				}
			}
		}
	
	}
	
	

	}
	
	
	
	function lightRegion(x,y,r,intensity){
		gX = Math.floor((x + ctxOx - ctxOx%lightRes)/lightRes) + 1
		gY = Math.floor((y + ctxOy - ctxOy%lightRes)/lightRes) + 1
		var bOffx = gX - r;
		var bOffy = gY - r;
		if(brushes[r] == null) brushes[r] = new Brush(r*2 + 1);
		
		if(gX + r < lightGrid.length || gX - r >= 0 || gY + r < lightGrid[0].length || gY -r >= 0){
			for(var i = gX - r; i <= gX+r; i++){
				for(var j = gY - r; j <= gY+r; j++){
					if(i >= 0 && i < lightGrid.length && j >= 0 && j < lightGrid[0].length && brushes[r].row[i-bOffx][j-bOffy] <= r){
						lightGrid[i][j]+= intensity *(r/(brushes[r].row[i-bOffx][j-bOffy]) -1)
					}
				}
			}
		}
	}
	
		function lightRegionCol(x,y,r,intensity, col){
		gX = Math.floor((x + ctxOx - ctxOx%lightRes)/lightRes) + 1
		gY = Math.floor((y + ctxOy - ctxOy%lightRes)/lightRes) + 1
		var bOffx = gX - r;
		var bOffy = gY - r;
		if(brushes[r] == null) brushes[r] = new Brush(r*2 + 1);
		var tempVal = 0
		if(gX + r < lightGrid.length || gX - r >= 0 || gY + r < lightGrid[0].length || gY -r >= 0){
			for(var i = gX - r; i <= gX+r; i++){
				for(var j = gY - r; j <= gY+r; j++){
					if(i >= 0 && i < lightGrid.length && j >= 0 && j < lightGrid[0].length && brushes[r].row[i-bOffx][j-bOffy] <= r){
						if(brushes[r].row[i-bOffx][j-bOffy] > 0) tempVal = intensity *(r/(brushes[r].row[i-bOffx][j-bOffy]) -1)
						else tempVal = 1
						lightGrid[i][j]+= tempVal
						lightGridC[i][j].r += col.r * tempVal
						lightGridC[i][j].g += col.g * tempVal
						lightGridC[i][j].b += col.b * tempVal
					
						if(lightGridC[i][j].r > 255) lightGridC[i][j].r = 255
						if(lightGridC[i][j].g > 255) lightGridC[i][j].g = 255
						if(lightGridC[i][j].b > 255) lightGridC[i][j].b = 255
					}
				}
			}
		}
	}
	
	function lightRegionSlow(x,y,r,intensity){
		//var ts = Date.now();
		gX = Math.floor((x + ctxOx)/lightRes) + 1
		gY = Math.floor((y + ctxOy)/lightRes) + 1
		if(gX + r < lightGrid.length || gX - r >= 0 || gY + r < lightGrid[0].length || gY -r >= 0){
			for(var i = gX - r; i <= gX+r; i++){
				for(var j = gY - r; j <= gY+r; j++){
					if(i >= 0 && i < lightGrid.length && j >= 0 && j < lightGrid[0].length && dist(i,j, gX,gY) <= r){
						lightGrid[i][j]+= intensity *(r/(dist(gX,gY, i,j)) -1)
					}
				}
			}
		}
		
	//	alert("Radius: " + r + " Time: " + (Date.now() - ts));
	}
	

	function lightStrip(x,y,size,intensity){
	
		gX = Math.floor(x/lightRes)
		gY = Math.floor(y/lightRes)
		
		mgX = Math.floor(size.x/lightRes)
		mgY = Math.floor(size.y/lightRes)
		
		for(var i = gX; i <= gX+ mgX; i++){
			for(var j = gY; j <= gY+mgY; j++){
				if(i >= 0 && i < lightGrid.length && j >= 0 && j < lightGrid[0].length){
				lightGrid[i][j]+= intensity 
				}
			}
		}
	
	
	}
	
	
		function directedSteam(x,y,s, a){
		ctx.save();
		
		ctx.globalAplha = 0.1;
		ctx.fillStyle = 'white'
		var angle = a;
		var size = Math.abs(s);
		if (s < 0) angle += 180;
		
		ctx.translate(x,y);
		ctx.rotate(degRad(angle));
		for(var i=0 ; i < size; i+=size/20){
				ctx.globalAlpha = 0.15//((size - i)/size)/10;
				ctx.beginPath();
			
				ctx.arc(i, 0, i*0.4 * Math.random(), 0, Math.PI*2);
				if(Math.random() < 0.95) ctx.fill();
				ctx.closePath();
				
				
			}
		ctx.globalAlpha = 1;
		ctx.restore();
	}
	
	function steamJet(a,b){
		this.x = a;
		this.y = b;
		this.size = 30 + rand(30);
		this.angle = Math.random() * 360;
		this.distance = 0;
		this.sound = null
		this.temp = -1;
		this.draw = function(){
			directedSteam(this.x,this.y, this.size - rand(10), this.angle);
			
			this.distance = dist(this.x, this.y, -ctxOx + w/2, -ctxOy + h/2)
				if(this.distance < 200) {
					if(this.sound == null){
						this.temp = getSound(steamSound)
						if(this.temp != -1) {
							this.sound = steamSound[this.temp]
							this.sound.claimed = true
						}
					}
					
					if(this.sound!= null){
						this.sound.play();
						this.sound.setVolume (1-this.distance / 200); //has a 50% drop in volume
						if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
					}
				}else {
					if(this.sound != null){
						this.sound.stop();
						this.sound.claimed = false;
						this.sound = null
					}
				}
		}
		this.sound = steamSound[rand(steamSound.length)]
	}
	
	
	
	
	function getNextAlly(){
		var typeGet = creature[cS].stats.type;
	
		
		for(var i= cS + 1; i < creature.length; i++){
			if(creature[i].stats.type == typeGet) {
				cS = i;
				creature[cS].state = 0
				creature[cS].sx = 0
				break;
			}
		}
		
	}
	
	function getPrevAlly(){
	
	for(var i= cS - 1; i >= 0; i--){
			if(creature[i].stats.type == creature[cS].stats.type) {
				cS = i;
				creature[cS].state = 0
				creature[cS].sx = 0
				break;
			}
		}
	}
	
	
	
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	


	/////////////////
	// Mouse Click
	///////////////

	
	
	canvas.addEventListener('click', function (evt){
		if(screen == 1){
			if(!prompting){
				for(var i=0; i < mainMenuButtons.length; i++) if(mainMenuButtons[i].isMouseOver()) mainMenuButtons[i].job();
			}else {
					if(promptAni < 100) promptAni = 100;
					else if(OKButton.isMouseOver()) OKButton.job();
				
			}
		}else if(screen == 5){
			if(prompting){
				if(promptAni < 100) promptAni = 100;
				else if(OKButton.isMouseOver()) OKButton.job();
			}else{
			
			}
		}else if(screen == 6){
			if(lighter.isMouseOver()) lighter.job();
			
			if(gridToggle.isMouseOver()) gridToggle.job();
			if(loadEdit.isMouseOver())loadEdit.job();
			if(leftSlide.isMouseOver())leftSlide.job();
			if(rightSlide.isMouseOver())rightSlide.job();
			
			if(selEdit == 1){//Background panels
				var btnd = false;
				for(var i=0; i < bgOptions.length; i++){
					if(bgOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <bgOptions.length; j++) bgOptions[j].selected = false;
						bgOptions[i].selected = true;
					}
				}
				
				if(config.isMouseOver()){
					for(var i=0; i < bgOptions.length; i++){
						if(bgOptions[i].selected) bgOptions[i].config();
					}
					btnd = true;
				}
				
				if(!btnd && my < h - 150 && my > 50){//We have clicked on the screen to place something
					for(var i=0; i < bgOptions.length; i++){
						if(bgOptions[i].selected) bgOptions[i].job();
					}
				}
				
				
			}else if(selEdit == 2){//walls, floors, celings
				var btnd = false;
				for(var i=0; i < wOptions.length; i++){
					if(wOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <wOptions.length; j++) wOptions[j].selected = false;
						wOptions[i].selected = true;
					}
				}
				
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < wOptions.length; i++){
						if(wOptions[i].selected) wOptions[i].job();
					}
				}
			}else if(selEdit == 3){//lamps
				var btnd = false;
				for(var i=0; i < lOptions.length; i++){
					if(lOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <lOptions.length; j++) lOptions[j].selected = false;
						lOptions[i].selected = true;
					}
				}
				if(config.isMouseOver()){
					for(var i=0; i < lOptions.length; i++){
						if(lOptions[i].selected) lOptions[i].config();
					}
					btnd = true;
				}
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < lOptions.length; i++){
						if(lOptions[i].selected) lOptions[i].job();
					}
				}
			}else if(selEdit == 4){//Items
				var btnd = false;
				for(var i=0; i < iOptions.length; i++){
					if(iOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <iOptions.length; j++) iOptions[j].selected = false;
						iOptions[i].selected = true;
					}
				}
				if(config.isMouseOver()){
					
					for(var i=0; i < iOptions.length; i++){
						if(iOptions[i].selected) iOptions[i].config();
					}
					btnd = true;
				}
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < iOptions.length; i++){
						if(iOptions[i].selected) iOptions[i].job();
					}
				}
			}else if(selEdit == 5){//Foreground
				var btnd = false;
				for(var i=0; i < fOptions.length; i++){
					if(fOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <fOptions.length; j++) fOptions[j].selected = false;
						fOptions[i].selected = true;
					}
				}
				if(config.isMouseOver()){
					
					for(var i=0; i < fOptions.length; i++){
						if(fOptions[i].selected) fOptions[i].config();
					}
					btnd = true;
				}
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < fOptions.length; i++){
						if(fOptions[i].selected) fOptions[i].job();
					}
				}
			}else if(selEdit == 6){//Background panels
				var btnd = false;
				for(var i=0; i < cOptions.length; i++){
					if(cOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <cOptions.length; j++) cOptions[j].selected = false;
						cOptions[i].selected = true;
					}
				}
				
				if(config.isMouseOver()){
					for(var i=0; i < cOptions.length; i++){
						if(cOptions[i].selected) cOptions[i].config();
					}
					btnd = true;
				}
				
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < cOptions.length; i++){
						if(cOptions[i].selected) cOptions[i].job();
					}
				}
				
				
			}else if(selEdit == 7){//Sound objects
				var btnd = false;
				for(var i=0; i < sOptions.length; i++){
					if(sOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <sOptions.length; j++) sOptions[j].selected = false;
						sOptions[i].selected = true;
					}
				}
				if(config.isMouseOver()){
					for(var i=0; i < sOptions.length; i++){
						if(sOptions[i].selected) sOptions[i].config();
					}
					btnd = true;
				}
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < sOptions.length; i++){
						if(sOptions[i].selected) sOptions[i].job();
					}
				}
			}else if(selEdit == 8){//Bio stuffs
				var btnd = false;
				for(var i=0; i < bOptions.length; i++){
					if(bOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <bOptions.length; j++) bOptions[j].selected = false;
						bOptions[i].selected = true;
					}
				}
				if(config.isMouseOver()){
					
					for(var i=0; i < bOptions.length; i++){
						if(bOptions[i].selected) bOptions[i].config();
					}
					btnd = true;
				}
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < bOptions.length; i++){
						if(bOptions[i].selected) bOptions[i].job();
					}
				}
			}else if(selEdit == 9){//Animated Items
				var btnd = false;
				for(var i=0; i < aOptions.length; i++){
					if(aOptions[i].b.isMouseOver()) {
						btnd = true;
						for(var j=0; j <aOptions.length; j++) aOptions[j].selected = false;
						aOptions[i].selected = true;
					}
				}
				if(config.isMouseOver()){
					for(var i=0; i < aOptions.length; i++){
						if(aOptions[i].selected) aOptions[i].config();
					}
					btnd = true;
				}
				if(!btnd && my < h - 150&& my > 50){//We have clicked on the screen to place something
					for(var i=0; i < aOptions.length; i++){
						if(aOptions[i].selected) aOptions[i].job();
					}
				}
			}
	      
		}
	}, false);

	
	canvas.addEventListener('mousedown', function (evt){
		
		mDown = true;
	      
	}, false);
	
	canvas.addEventListener('mouseup', function (evt){
		mDown = false;
		
	      
	}, false);
	
	

	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){pause = false;}, false);

	function updateMouse(){
	//Set player aiming
			if(screen == 5) creature[cS].taimer = {x:mx - ctxOx,y:my - ctxOy};
		
	
	}
	
      	canvas.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

		
		updateMouse();
		
      	}, false);


	function getMousePos(canvas, evt) 
	{
	        var rect = canvas.getBoundingClientRect();
			
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
		
	}
      

	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////

	
	var keys = []
	function inKeys(v){
		var result = false
		for(var i=0; i < keys.length; i++){
			if(v == keys[i])result =  true;
		}
		return result;
	}
	
	function clearKeys(v){
		for(var i=0; i < keys.length; i++){
			if(keys[i] == v){
				keys.splice(i,1);		
				break;
			}
		}
	}
	
window.addEventListener('keyup', function(evt){
		var key = evt.keyCode;
		clearKeys(key);
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
	
		if(key == 38 || key == 87){
		//up
			
		}else if(key == 39 || key == 68){
		//stop right
			if(screen == 5){
				creature[cS].state =0;
				creature[cS].aniFrame = 3;
			}
		}else if (key== 37 || key == 65){
			//left
			if(screen == 5){
				creature[cS].state = 0;
				creature[cS].aniFrame = 5;
			}
		}else if(key==40|| key == 83){
		//down
			if(screen == 5) creature[cS].state = 0;
		}
		
	}, false);
	
	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		if(!inKeys(key))keys.push(key);
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
	
	
	//w 87
	//a 65
	//s 83
	//d 68
	
	//alert(key)
	//219 back
	//221 forward
		if(key == 38){
		//up
			if(screen == 5 && false){
				/*ridingElevator = false;
				for(var i=0;i<elevators.length;i++){
					if(elevators[i].inUse) {
						elevators[i].goUp();
						ridingElevator = true;
					}
				}
				if(!ridingElevator) creature[cS].jump();*/
			}else if(screen == 6) ctxOy += 100
			
			if(prompting && promptScroll > 0) promptScroll--;
			
		}else if(key == 39){
		//right
			if(screen == 5 && false){
				/*creature[cS].state = 2
				if(creature[cS].stats.wing > 0 && creature[cS].falling()&& creature[cS].sx < 8)creature[cS].sx+=1
				else creature[cS].sx = creature[cS].stats.speed;*/
			}else if (screen == 6) ctxOx-=100
		}else if (key== 37){
			//left
			if(screen == 5 && false){
			/*	creature[cS].state = 3;
				if(creature[cS].stats.wing > 0 && creature[cS].falling() && creature[cS].sx > -8)creature[cS].sx-=1
				else creature[cS].sx =-1* creature[cS].stats.speed;*/
			}else if(screen == 6) ctxOx += 100
		}else if(key==40 ){
		//down
			if(screen == 5 && false){
				/*ridingElevator = false;
				for(var i=0;i<elevators.length;i++){
					if(elevators[i].inUse) {
						elevators[i].goDown();
						ridingElevator = true;
					}
				}*/
			}
				
			//if(false && !ridingElevator && screen == 5 && !creature[cS].falling() && creature[cS].sy == 0)creature[cS].state = 4;
			else if(screen == 6) ctxOy -= 100;
			if(prompting && promptScroll < promptLines - 220/12)promptScroll++;
			
		}else if(key == 49) {
			if(screen == 5 && !creature[cS].weapon[0].useless && creature[cS].weapon[0] != null)creature[cS].sw = 0;
			else if (screen == 6) selEdit = 1;
		}else if(key == 50){
			if(screen == 5){
				if(creature[cS].weapon[1] != null && !creature[cS].weapon[1].useless ) creature[cS].sw = 1;
			}else if (screen == 6) selEdit = 2;
		}else if(key == 51){
			if(screen == 5){
				if(creature[cS].weapon[2] != null&& !creature[cS].weapon[2].useless) creature[cS].sw = 2;
				
			}else if (screen == 6) selEdit = 3;
		}else if(key == 52) {
			if(screen == 5){
				if(creature[cS].weapon[3] != null&& !creature[cS].weapon[3].useless) creature[cS].sw = 3;
			}else if (screen == 6) selEdit = 4;
		}else if (key == 53){
			if (screen == 6) selEdit = 5;
		}else if (key == 54){
			if (screen == 6) selEdit = 6;
		}else if (key == 55){
			if (screen == 6) selEdit = 7;
		}else if (key == 56){
			if (screen == 6) selEdit = 8;
		}else if (key == 57){
			if (screen == 6) selEdit = 9;
		}else if (key == 219){//backselect
			if (screen == 5) getPrevAlly()
		}else if (key == 221){//forward selct
			if (screen == 5) getNextAlly();
		}else if (key == 69){//swap weapons
			if(w1 != null && w2 != null && screen == 5){
				creature[cS].dropWeapon(creature[cS].sw);
				w1.collect(creature[cS]);
			}
		}else if (key == 82){//reload
			if(screen == 5){
				creature[cS].reload();
			}
		}else if(key == 84){
			if(screen == 6) {
				if(creature.length > 0){
					if(prompt("Are you sure you want to test this level live? Y / N","") == "Y"){
						screen = 5;
						cS = creature.length-1
					}
				}else alert("You can't run this level without at least 1 creature in it!  Put in a creature and try again.");
			}else if(screen == 5){
				if(prompt("Are you sure you want to go to the editor? Y / N","") == "Y"){
					screen = 6;
					ctxOx = 0
					ctxOy = 0
					for(var i=0; i < creature.length;i++) {
						creature[i].sx = 0
						creature[i].sy = 0
						creature[i].state = 0;
					}
				}
			
			}
		}else if(key == 32){
			if(screen == 4) cutscene[scene].frame = cutscene[scene].endFrame
		
		}else if(key == 8 && screen == 6){//backspace control
			if(lastEdit[lastEdit.length-1]== 0) dLights.splice(dLights.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 1)pulseLights.splice(pulseLights.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 2)lamps.splice(lamps.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 3)wall.splice(wall.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 4)wallPanels.splice(wallPanels.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 5)creature.splice(creature.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 6)items.splice(items.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 7)foreGround.splice(foreGround.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 8)rLights.splice(rLights.length - 1, 1);
			else if(lastEdit[lastEdit.length-1] == 9){
				elevators[elevators.length-1].remove();
				elevators.splice(elevators.length-1,1);
			}else if(lastEdit[lastEdit.length-1] == 10){
				if(wallPanels[wallPanels.length-1].sound!=null)wallPanels[wallPanels.length-1].sound.stop();
				wallPanels.splice(wallPanels.length - 1, 1);
			}
		
			if(lastEdit.length > 0) lastEdit.splice(lastEdit.length-1,1);
			

			//delete last line of the output box
			var cO = document.getElementById("output").value;
			var index = -1
			var foundFirst = false
			var foundSecond = false;
			//Search for ';' tag
			for(var i = cO.length-1; i > 0; i--){
				if(cO[i] == ';'){
					index = i+1;
					if(foundFirst) {
						foundSecond = true;
						break;
					}
					foundFirst = true;		
				}
			}
			
			if(index >= 0) cO = cO.slice(0,index)
			if(!foundSecond) cO = ""
			
			document.getElementById("output").value = cO
		}else if(key == 13){
		//Enter key
			if(screen == 5){
				if(prompting){
					if(promptAni < 100) promptAni = 100;
					else OKButton.job();
				}else{
				//Transition to another level
					for(var i=0; i < exits.length; i++){
						if(dist(creature[cS].x + 100, creature[cS].y + 100, exits[i].x, exits[i].y) < 100){
							exits[i].load();
							break;
						}
					}
				}
				
			}
		}
	}, false);


	
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////					UTILITY CONSTRCTORS
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var sparks = [];
	var sPics = [];
	sPics.push(makePicture('Animations/Sparks/sparks1.png'));
	sPics.push(makePicture('Animations/Sparks/sparks2.png'));
	sPics.push(makePicture('Animations/Sparks/sparks3.png'));
	function createSpark(a,b){
		return {x:a,
			y:b,
			f:0 - rand(5),
			pIndex:rand(sPics.length),
			
			draw:function(){
				ctx.drawImage(sPics[this.pIndex], this.f* 20, 0, 20,20, this.x-10,this.y-10, 20,20);
				this.f++;
				
			}
		}
	}
	
	var bloodSplat = [];
	var bloodSplatLarge = [];
	var bloodPics = [];
	bloodPics.push(makePicture('Animations/Sparks/blood1.png'))
	bloodPics.push(makePicture('Animations/Sparks/blood2.png'))
	
	var bloodPicsLarge = [];
	bloodPicsLarge.push(makePicture('Animations/Sparks/bigSplat2.png'))
	bloodPicsLarge.push(makePicture('Animations/Sparks/bigSplat3.png'))
	bloodPicsLarge.push(makePicture('Animations/Sparks/bigSplat4.png'))
	
	function createBlood(a,b){
		if(Math.random() > 0.7) {
			//check if on a door
			//check for smear == null
			var result = false;
			for(var i=0; i < wallPanels.length; i++){
				if(a > wallPanels[i].x  && a < wallPanels[i].x + 140 && b > wallPanels[i].y  && b < wallPanels[i].y + 200){
					if(wallPanels[i].smears != null){
						result = true;
						wallPanels[i].addSmear();
					}
				}
			}
			if(!result) wallPanels.push(new Panel( a + rand(40), b + rand(40),BloodSmear[rand(BloodSmear.length)], 0, 2))
		}
		
		return {x:a,
			y:b,
			f:0 - rand(5),
			pIndex:rand(bloodPics.length),
			draw:function(){
				ctx.drawImage(bloodPics[this.pIndex], this.f* 20, 0, 20,20, this.x-10,this.y-10, 20,20);
				this.f++;
			}
		}
	}
	
	
	function createBloodLarge(a,b){
		
		return {x:a,
			y:b,
			f:0,
			pIndex:rand(bloodPicsLarge.length),
			draw:function(){
				//ctx.drawImage(bloodPics[this.pIndex], this.f* 20, 0, 20,20, this.x-10,this.y-10, 20,20);
				ctx.drawImage(bloodPicsLarge[this.pIndex], this.f * 100,0, 100,100, this.x - 50, this.y-50, 100,100);
				this.f++;
			}
		}
	}
	
	
	
	var sparkler = []
	
	
	
	function sparker(a,b){
		this.x = a + 5
		this.y = b + 5
		this.seq = 0
		this.temp = 2;
		this.yOff = [];
		this.size = 10;
		this.length = 20;
		this.pause = 0;
		this.sound = null;//sparkSound[rand(sparkSound.length)]
		this.temp = -1;
		this.distance = 0;
		for(var i=0; i < this.size; i++) this.yOff[i] = Math.random()*5//rand(5);
		this.draw = function(){
			if(this.pause <= 0){
			ctx.fillStyle = 'white'
			ctx.globalAlpha = 1 - this.seq/this.length + Math.random()/5
			for(var i=0; i < this.size; i++){
				this.temp = rand(this.seq/(this.length*2)) + 1
				ctx.fillRect(this.x + rand(4)-2, this.y + this.seq*this.yOff[i], this.temp, this.temp);
			}
			if(this.seq % 2 == 0 && this.seq < 5){
				roundLight(this.x, this.y, Math.random() * 10, 10);
			}
			ctx.globalAlpha = 1;
			this.seq++;
			if(this.seq > this.length) {
				this.seq = 0
				this.pause = rand(30);
			}
			
			this.distance = dist(this.x, this.y, -ctxOx + w/2, -ctxOy + h/2)
				
				if(this.distance < 200) {
					if(this.sound == null){
						this.temp = getSound(sparkSound)
						if(this.temp != -1) {
							this.sound = sparkSound[this.temp]
							this.sound.claimed = true
						}
					}
					if(this.sound!= null){
						this.sound.play();
						this.sound.setVolume ((1- this.distance / 200)/2); //has a 50% drop in volume
						if(this.sound.soundVar.currentTime > this.sound.soundVar.duration - 0.5) this.sound.soundVar.currentTime = 0.1
					}
				}else {
					if(this.sound != null){
						this.sound.stop();
						this.sound.claimed = false;
						this.sound = null
					}
				}
			
			
			}else{
				this.pause--;
			
			}
		}
	}
	
	function waterDrop(a,b){
		this.x = a
		this.y = b
		
		this.length = 80
		this.seq = rand(this.length);
		this.size = 3
		this.seqOff = []
		this.pause = [];
		for(var i=0; i < this.size; i++) {
			this.seqOff[i] = rand(this.length)
			this.pause[i] = 10 + rand(20);
		}
		this.draw = function(){
			ctx.fillStyle = 'white'
			
			for(var i=0; i < this.size; i++){
				if(this.pause[i] ==0){
					//ctx.fillRect(this.x + i * 1.8, this.y + this.seqOff[i]  - 10, 1, this.seqOff[i]/10);
					ctx.fillRect(this.x + i * 1.8, this.y + this.seqOff[i]  - 10, 1, 2);
					this.seqOff[i]+=5
					if(this.seqOff[i] > this.length) {
						this.seqOff[i] = 10;
						this.pause[i] = rand(20) + 10
					}
				}
				if(this.pause[i] > 0) this.pause[i]--;
			}
		}
	}
	
	
	
	function Fire(a,b){
		this.x = a
		this.y = b
		
		this.particles = []
		for(var i=0; i < 10; i++) this.particles.push({x:a + rand(20) - 10, y:b, radius: rand(2) + 1, sy:rand(3) + 1});
		
		this.draw = function(){
			
			ctx.fillStyle = 'white'
			
			
			//Particles
			for(var i=0; i < this.particles.length; i++){
			
				this.particles[i].y -= this.particles[i].sy;
				if(Math.random() < 0.4) this.particles[i].radius *= 0.7;
				
				if(this.particles[i].y < this.y - 80){
					this.particles[i].y = this.y + rand(2);
					this.particles[i].x = this.x + rand(20) - 10;
					this.particles[i].radius = rand(3) + 1;
					this.particles[i].sy = 2 + rand(5);
				}
				ctx.beginPath();
				ctx.arc(this.particles[i].x, this.particles[i].y, this.particles[i].radius, 0 , Math.PI *2);
				ctx.fill();
				ctx.closePath();
			
			}
			
			
			//Base flame
			/*
			for(var i=0; i < 10; i++){
				ctx.globalAlpha = Math.random();
				ctx.beginPath();
				ctx.arc(this.x + rand(20), this.y - rand(10) + i, 1 + rand(i), 0, Math.PI *2);
				ctx.fill();
				ctx.closePath();
			
			}*/
			
			for(var j=0; j < 3;j++){
				for(var i=0; i < 5 + j; i++){
					ctx.globalAlpha = (1-i/5)/2;
					ctx.beginPath();
					ctx.arc(this.x + rand(i) + (rand(j*2) - j)*3, this.y - rand(2) - i *5, 6 -i, 0, Math.PI *2);
					ctx.fill();
					ctx.closePath();
				}
			}
			
			ctx.globalAlpha = 1;

			lightRegion(this.x + rand(20) - 10, this.y, 2 + rand(5), 0.5);
		}
	
	}
	
	function createWall(x,y,wi,he, p){
	
		var newObject = {
			x:x,
			y:y,
			width:wi,
			height:he,
			setWidth:function(i){
				this.width = i;
			},
			setHeight:function(i){
				this.height = i;
			},
			collideObject:function(obj){
				var result = false;
			
				if(obj.x >= this.x && obj.x <= this.x + this.width && obj.y >= this.y && obj.y <= this.y + this.height) result = true;
				
				if(obj.x + obj.width>= this.x && obj.x + obj.width <= this.x + this.width && obj.y >= this.y && obj.y <= this.y + this.height) result = true;
				
				if(obj.x >= this.x && obj.x <= this.x + this.width && obj.y + obj.height>= this.y && obj.y + obj.height <= this.y + this.height) result = true;
				
				if(obj.x + obj.width>= this.x && obj.x + obj.width <= this.x + this.width && obj.y + obj.height>= this.y && obj.y + obj.height <= this.y + this.height) result = true;
				if(obj.collideObject(this)) result = true;
			
				return result;
			},
			collidePoint:function(x,y){
				var result = false;
				if(x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height)	result = true;
				return result;
			},
			collidePointNoEdge:function(x,y){
				var result = false;
				if(x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height)	result = true;
				return result;
			},
			image:p,
			
			draw:function(){
				ctx.drawImage(this.image, this.x,this.y, this.width, this.height);
				this.setHeight (this.image.height);
				this.setWidth (this.image.width);	
			}	
		}
		
		return newObject;
	}

function BSGBox(x,y,W,H){
	ctx.strokeStyle = ctx.fillStyle;
	ctx.beginPath();
	ctx.moveTo(x + 5, y)
	ctx.lineTo(x + W - 5, y)
	ctx.lineTo(x + W , y + 5 )
	ctx.lineTo(x+W , y + H-5)
	ctx.lineTo(x + W - 5 , y + H )
	ctx.lineTo(x + 5, y + H)
	ctx.lineTo(x , y + H-5 )
	ctx.lineTo(x , y + 5 )
	ctx.lineTo(x +5, y)
	ctx.globalAlpha = 0.5;
	ctx.fill();
	ctx.globalAlpha = 1
	ctx.stroke();
	ctx.closePath();
}

function speechBubble(x,y,W,H){
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.fillStyle = 'white'
	ctx.beginPath();
	ctx.moveTo(x + 5, y)
	ctx.lineTo(x + W - 5, y)
	ctx.lineTo(x + W , y + 5 )
	ctx.lineTo(x+W , y + H-5)
	ctx.lineTo(x + W - 5 , y + H )
	
	ctx.lineTo(x + W/2 - 10, y + H);
	ctx.lineTo(x + W/2 - 10, y + H + 10);
	ctx.lineTo(x + W/2 - 20, y + H);
	
	ctx.lineTo(x + 5, y + H)
	ctx.lineTo(x , y + H-5 )
	ctx.lineTo(x , y + 5 )
	ctx.lineTo(x + 5, y)
	ctx.globalAlpha = 0.8;
	ctx.fill();
	ctx.globalAlpha = 1
	ctx.stroke();
	ctx.closePath();
}
	function ButtonGraphic(a,b,c,d, t){
		this.x = a
		this.y = b
		this.width = c
		this.height = d
		this.text = t
		this.panelBack = [];
		this.panelBack.push(new Panel(this.x, this.y, panelHall[1], 1, 0.4))
		this.panelBack.push(new Panel(this.x + 100, this.y, panelHall[1], 1, 0.4))
		this.lights = []
		//this.lights.push(new UpLamp(this.x + 45, this.y + 80))
		//this.lights.push(new UpLamp(this.x + 145, this.y + 80))
		this.lights.push(new BigLamp(this.x + 60, this.y + 10));
		
		this.draw = function(){
			//for(var i =0; i < this.panelBack.length; i++) this.panelBack[i].draw();
			ctx.fillStyle = '#808080'
			ctx.fillRect(this.x+10, this.y+10, 180,80);
			
			ctx.drawImage(panelHall[1], this.x, this.y)
			ctx.drawImage(panelHall[1], this.x + 100, this.y)
			if(this.isMouseOver()){
				//for(var i =0; i < this.lights.length; i++) this.lights[i].draw();
				ctx.fillStyle = 'white'
				lightRegion(this.x + 50, this.y + 50, 10, 0.2);
				lightRegion(this.x + 150, this.y + 50, 10, 0.2);
			}else {
				lightRegion(this.x + 50, this.y + 50, 7, 0.1);
				lightRegion(this.x + 150, this.y + 50, 7, 0.1);
				ctx.fillStyle = 'black'
				//ctx.drawImage(biglampOut, this.x + 60, this.y + 10)
			}
			ctx.font = "10pt wallFont"
			ctx.fillText(this.text, this.x + 100 - ctx.measureText(this.text).width/2, this.y + 55);
		}
		this.isMouseOver = function (){
			return mx > this.x && mx  <this.x + this.width && my > this.y && my < this.y + this.height
		}
		
		this.job = function(){
			alert("boop!");
		}
	}

	function Button(a,b,c,d, t){
		this.x = a
		this.y = b
		this.width = c
		this.height = d
		this.text = t
		this.draw = function(){
			ctx.fillStyle = 'white'
			BSGBox(this.x,this.y, this.width, this.height);
			
			if(this.isMouseOver()){
				ctx.fillStyle = 'white'
			}else {
				ctx.fillStyle = 'black'
			}
			ctx.font = "5pt wallFont"
			ctx.fillText(this.text, this.x + this.width/2 - ctx.measureText(this.text).width/2, this.y + 12);
		}
		this.isMouseOver = function (){
			return mx > this.x && mx  <this.x + this.width && my > this.y && my < this.y + this.height
		}
		
		this.job = function(){
			alert("boop!");
		}
	}

	
	function editOption(x,y,p){
		this.pic = p;
		this.text = ""
		this.b = new Button(x,y,50,50);
		this.selected = false;
		this.imageText = "--"
		this.name = ""
		this.config = function(){
			alert("This option has no configuration options, sorry.");
		}	
		this.spec = 0;
		this.spec2 = 0;
		this.isMouseOver = function(){
			return mx >= this.b.x && mx <= this.b.x + this.b.width && my >= this.b.y && my <= this.b.y + this.b.height;
		}
		this.draw = function(){
			ctx.globalAlpha = 1
			if(this.selected){
				ctx.fillStyle ='white'
				ctx.fillText("Current Selection", 230, 460);
				ctx.fillText("Config Value 1: " + this.spec, 240, 470);
				ctx.fillText("Config Value 2:" + this.spec2, 240, 480);
				if(this.spec3 != null) ctx.fillText("Config Value 3:" + this.spec3, 240, 490);
			}else if(this.isMouseOver()){
				ctx.fillStyle = 'white'
			}else ctx.fillStyle = 'gray'
			
			
			BSGBox(this.b.x, this.b.y, this.b.width, this.b.height);
			ctx.fillStyle = '#111111'
			ctx.globalAlpha = 1;
			
			if(this.pic!= null){
				if(this.selected) ctx.drawImage(this.pic, Math.floor((mx) / snapSize)*snapSize,Math.floor((my) / snapSize)*snapSize, this.pic.width,this.pic.height);
			
				if(this.pic.width <= 100)	ctx.drawImage(this.pic, this.b.x,this.b.y, this.pic.width/2,this.pic.height/2);
				else ctx.drawImage(this.pic, this.b.x,this.b.y, 50,50);
				
				ctx.font = "4pt wallFont"
				ctx.fillStyle = 'yellow'
				textBox(this.name, this.b.x, this.b.y + 25, 50);
				ctx.fillText(this.pic.width + "x" + this.pic.height, this.b.x, this.b.y + 15);
			}else{
				if(this.selected) {
					ctx.fillStyle = 'green'
					ctx.globalAlpha = 0.5;
					ctx.fillRect(Math.floor((mx) / snapSize)*snapSize,Math.floor((my) / snapSize)*snapSize, 10,10);
					ctx.globalAlpha = 1;
				}
				//ctx.fillStyle = '#555555'
				//ctx.fillRect(this.b.x,this.b.y, 50,50);
				ctx.fillStyle = 'yellow'
				
				ctx.fillText("S1: " + this.spec, this.b.x, this.b.y + 35);
				ctx.fillText("S2: " + this.spec2, this.b.x, this.b.y + 45);
				ctx.font = "4pt wallFont"
				ctx.fillStyle = 'yellow'
				textBox(this.name, this.b.x, this.b.y + 15, 50);
			}
			
		}
		this.job = function(){
			this.insert()
			if(this.text != "") output(header + this.text)//Output code
		}
		this.insert = function(){}
		
	
	}
	
	function degRad(angle){
		return angle / 180 * Math.PI;
	}
	
	function slope(x1,y1,x2,y2){
		return (y2-y1)/(x2-x1);
	}

	function dist( p1x, p1y, p2x, p2y )
    {
        var xs = 0;
        var ys = 0;
 
        xs = p2x - p1x;
        xs = xs * xs;
 
        ys = p2y - p1y;
        ys = ys * ys;
 
        return Math.sqrt( xs + ys );
    }

	function rand(n){
		return Math.floor(Math.random() * n)
	}

	
	function newNode(pos){
		return {f:0,
				g:0,
				h:0,
				x:pos.x,
				y:pos.y,
				parent:null
		}
	}
	
	function aStar(s,e, flight){

		var openList = [];
		openList.push(newNode(s));
		
		var closedList = [];
		var tries = 1000;
		
		while(openList.length >0 && tries > 0){
			tries--;
			//Find best scoring node
			var bI = 0;
			
			for(var i=0; i< openList.length;i++){
				if(openList[i].f < openList[bI].f) bI = i;
			}
			
			var currentNode = openList[bI];
			
			//End case
			if(currentNode.x == e.x && currentNode.y == e.y) {
				
				var curr = currentNode;
				var ret = [];
				while(curr.parent && tries > 0) {
					ret.push(curr);
					curr = curr.parent;
					tries--;
				}
				if(tries <= 0) return [];
				
				return ret.reverse();
			}
			
			//Remove current node from openlist
			for(var a =0; a < openList.length;a++){
				if(openList[a].x == currentNode.x && openList[a].y == currentNode.y) openList.splice(a,1);
			}
			
			//Push current node onto closed list
			closedList.push(currentNode);
			
			//Load in the neighbors for checking
			var neighbors;
			if(flight) neighbors = getNeighbors(currentNode.x, currentNode.y);			
			else neighbors = getNeighborsNoFlight(currentNode.x, currentNode.y);
			
			for(var a =0; a < neighbors.length;a++){
				var neighbor = neighbors[a];
			
				//Make sure neighbor is not already processed
				var onClosed = false;
				for(var b =0; b < closedList.length;b++){
					if(closedList[b].x == neighbor.x && closedList[b].y == neighbor.y) onClosed = true 
				}
				
				if(onClosed) continue;
				
				//Find best scoring neighbor
				var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
				var gScoreIsBest = false;
				
				
				//Check if this neighbor is on the list or not, if new is best so far
				var onList = false;
				for(var b =0; b < openList.length;b++){
					if(openList[b].x == neighbor.x && openList[b].y == neighbor.y) onList = true 
				}
				
				if(!onList){
				//Is new, is the best so far
					gScoreIsBest = true;
					neighbor.h = hValue(neighbor, e); 
					openList.push(neighbor);
				}else if(gScore < neighbor.g) {
					// We have already seen the node, but last time it had a worse g (distance from start)
					gScoreIsBest = true;
				}
 
				if(gScoreIsBest) {
					// Found an optimal (so far) path to this node.	 Store info on how we got here and
					//	just how good it really is...
					neighbor.parent = currentNode;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
				}	
			}
		}
		
		if(tries <= 0) console.log("astar stability 4 error");
		return [];//PAth find failure.
	}
	
	function getNeighbors(x,y){
		var result = [];

		for(var i= x-1; i <= x+1; i++){
			for(var j = y-1; j <= y+1;j++){
				if(i >= 0 && i < mapGrid.length && j>=0&&j< mapGrid[0].length&& !(i==x && j==y)){
					if(mapGrid[i][j].wall == false)	result.push(newNode({x:i,y:j}));
				}
			}
		}
		return result;
	}
	
	function getNeighborsNoFlight(x,y){
		var result = [];

		for(var i= x-1; i <= x+1; i++){
			for(var j= y-1; j <= y; j++){
				if(i >= 0 && i < mapGrid.length && j>=0&&j< mapGrid[i].length&& i!=x && j != y){
					if(mapGrid[i][j].wall == false)	result.push(newNode({x:i,y:j}));
				}
			}
		}
		return result;
	}
	
	
	function hValue(pos0, pos1) {
		// This is the Manhattan distance
		var d1 = Math.abs (pos1.x - pos0.x);
		var d2 = Math.abs (pos1.y - pos0.y);
		return d1 + d2;
	}
	
	
	
	function smoothPath(p){
		var result = [];
		var newX, newY
		for(var i=0; i < p.length-1; i++){
			result.push(p[i]);
			
			if(p[i+1].x > p[i].x) newX = p[i].x + 0.5
			else newX = p[i].x - 0.5
			
			if(p[i+1].y > p[i].y) newY = p[i].y + 0.5
			else newY = p[i].y - 0.5
			
			result.push({x:newX, y:newY});
			i++;
		}
		result.push(p[p.length-1]);
		
		if(p.length > 1) return result;
		else return p
	}
	
	
	
	function textBox(message, x, y, width){
		var line = 0;
		var cursor = 0;
		var part = "";
		var cWord = "";
		var cFont = ctx.font;
		var bolding = false;
		
		for(var a = cursor; a < message.length; a++){

			if (message[a] != '@' && message[a] != '~' &&message[a] != '^')
			{
				
				cWord += message[a];
			}
			
			
			if(message[a] == "^") bolding = !bolding	
			
			if(bolding) ctx.font = "bold " + cFont
			else ctx.font = cFont
			
			
			cursor += 1;

			if (ctx.measureText(part + cWord).width >= width){
				
				ctx.fillText(part, x, y + (line * 12));
				line++;
				
				part = "";
			}
			
			if (message[a] == '^' || message[a] == ' ' || message[a] == '~' || message[a] == '@'|| cursor == message.length){part += cWord; cWord = "";}
			if (message[a] == '@'){
				ctx.fillText(part, x, y + (line * 12));
				line += 2;
				part = "";
			}else if (message[a] == '~'){
				ctx.fillText(part, x, y + (line * 12));
				line += 1;
				
				part = "";
			}
			
		}
		
		
		ctx.fillText(part, x, y + (line * 12));
		ctx.font = cFont;
	}



function textBoxScroll(message, x, y, width, height){
		var line = 0;
		var cursor = 0;
		var part = "";
		var cWord = "";
		var cFont = ctx.font;
		var bolding = false;
		
		var numLines = Math.floor(height/12)
		
		var lines = [];
		
		for(var a = cursor; a < message.length; a++){

			if (message[a] != '@' && message[a] != '~' &&message[a] != '^')
			{
				
				cWord += message[a];
			}
			
			
			if(message[a] == "^") bolding = !bolding	
			
			if(bolding) ctx.font = "bold " + cFont
			else ctx.font = cFont
			
			
			cursor += 1;

			if (ctx.measureText(part + cWord).width >= width){
				
				//ctx.fillText(part, x, y + (line * 12));
				//line++;
				lines.push(part);
				part = "";
			}
			
			if (message[a] == '^' || message[a] == ' ' || message[a] == '~' || message[a] == '@'|| cursor == message.length){part += cWord; cWord = "";}
			
			if (message[a] == '@'){
				//ctx.fillText(part, x, y + (line * 12));
				//line += 2;
				lines.push(part)
				lines.push("");
				part = "";
			}else if (message[a] == '~'){
				//ctx.fillText(part, x, y + (line * 12));
				//line += 1;
				lines.push(part);
				part = "";
			}
			
		}
		lines.push(part)
		var beginLine = promptScroll
		var endline = numLines + beginLine
		for(var i=promptScroll; i < lines.length && i < promptScroll + numLines; i++) ctx.fillText(lines[i], x,y + (i-promptScroll) * 12);
		
		promptLines = lines.length;
		//ctx.fillText(part, x, y + (line * 12));
		ctx.font = cFont;
	}
	
	
	
	function roundRect(x,y,W,H){
		var r = 10
		ctx.beginPath()
		ctx.moveTo(x + r, y)
		ctx.lineTo(x + W - r, y)
		ctx.quadraticCurveTo(x + W - r, y, x + W, y + r);
		ctx.strokeStyle = 'red'
		ctx.stroke();
		ctx.closePath();
	}
	
	})