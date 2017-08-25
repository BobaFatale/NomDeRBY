//Future additions to the app

//change similar algorithm to search through names for matching string of first three letters (ex. Kate would return ExtermiKate)
//string input validation just to be safe
var generatorApp = {};
generatorApp.inputFirstName = '';
generatorApp.inputLastName = '';
generatorApp.firstArray = [];
generatorApp.lastArray = [];
generatorApp.outputFirstName = '';
generatorApp.outputLastName = '';
generatorApp.databaseFile = 'scripts/testnames.json'

generatorApp.init = function(){
	// console.log('engaged');
	generatorApp.loadData();
	generatorApp.hashCheck();
	generatorApp.events();
		//jqueryUI 
	$('.draggable').draggable({
		cancel:false,
		revert:true,
		revertDuration: 100
	});
	$( ".dropBox" ).droppable({
		accept: ".draggable",
		drop: function( event, ui ) {
			var boxDropped = this.id;
			var nameDropped = $(ui.draggable[0]).html();
			generatorApp.reRoll(boxDropped,nameDropped);
		}
	});
};
generatorApp.events = function(){
	$('a.twitter').on('click', function() {
		// console.log('share');
		var tempUrl = encodeURIComponent(window.location.href);
		var shareText;
		if (generatorApp.outputFirstName != '' && generatorApp.outputLastName != '') {
			shareText =	`My Derby name is: ${generatorApp.outputFirstName} ${generatorApp.outputLastName}`;
		}else{
			// console.log('nonameshare');
			shareText = `Check out the derby name generator`;
		};
		$(this).attr('href', `http://twitter.com/share?text=${shareText}, generate your own here!&url=${tempUrl}`);   
	});
	//when user clicks the submit button run name funciton
	$('form').on('submit', function(event){
		event.preventDefault();
		$('.outputArea').addClass('open');
		generatorApp.generateName();
		//calls the display randomizer 
		generatorApp.displayDelay(function(){
			generatorApp.displayNames(generatorApp.outputFirstName,generatorApp.outputLastName)
		});
	});
 // Twitter pop-up - thanks to webpop.com
	$('.popup').click(function(event) {
			var width  = 575,
			height = 400,
			left = ($(window).width() - width) / 2,
			top = ($(window).height() - height) / 2,
			url = $(this).attr('href'),
			opts = 'status=1' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
			window.open(url, 'twitter', opts);
			return false; 
	});
	// $('button').on('click', function(){
	// 	console.log(this.id);
		// var buttonClicked = this.id;
	// 	console.log($(this).html());
		// var nameClicked = $(this).html();
		// generatorApp.reRoll(buttonClicked,nameClicked);
	// });
}
//loadData() accesses the JSON object and splits the names in to an array of first and last names. It takes no arguments and returns nothing
generatorApp.loadData = function(){
	$.getJSON(generatorApp.databaseFile, function(data){
		// console.log(data);
		generatorApp.parseData(data);
	});
}
//parseData() parses the object retrieved from the JSON file. It iterates through the object splitting the First and Last names in to seperate arrays. It rejects any blank names or names 13 characters or longer (13 characters is for styling and can change in the future). It passes the name to the capitalizeFirstLetter function to prevent later errors when matching names. It takes one argument [nameData] which is the object to be parsed it returns nothing
generatorApp.parseData = function(nameData){
	for (var i = 0; i < nameData.length; i++) {
		if (nameData[i]['First'] != '' && nameData[i]['First'].length <= 13) {
			var firstPush = generatorApp.capitalizeFirstLetter(nameData[i]['First']);
			generatorApp.firstArray.push(firstPush);
		};
		if (nameData[i]['Last'] != '' && nameData[i]['Last'].length <= 13) {
			var lastPush = generatorApp.capitalizeFirstLetter(nameData[i]['Last']);
			generatorApp.lastArray.push(lastPush);
		};
	};
	// console.log(generatorApp.firstArray);
	// console.log(generatorApp.lastArray);
}
//capitalizeFirstLetter 
generatorApp.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//hashCheck checks the current url for a value after the hash and displays that value in the display area. This enables the share on twitter functionality to show off fun generated names. It accepts no arguments and returns nothing
generatorApp.hashCheck = function(){
	//on load pull the url after a hash tag
	var urlHash = window.location.hash.substr(1); 
	// console.log(urlHash);
	//check if there is actually anything in the hasharea
	if (urlHash != ''){
		// console.log('not blank url');
		//splits urlHash at + seperators
		var hashArray = urlHash.split("+");
		// console.log(hashArray);
		//logs the names in to the outputNames variables
		generatorApp.outputFirstName = hashArray[0];
		generatorApp.outputLastName = hashArray[1];
		//calls the generatorApp.displayNames function to display the names containb
		$('.outputArea').addClass('open');
		generatorApp.displayNames(generatorApp.outputFirstName,generatorApp.outputLastName);
	};
};
//generatorApp.displayNames is a function that accepts two strings [displayFirst, displayLast] it outputs the arguments passed to it in to the buttons on the page. It returns nothing
generatorApp.displayNames = function(displayFirst,displayLast){
		$('#firstButton').text(displayFirst);
		$('#lastButton').text(displayLast);
		window.location.hash = `${displayFirst}+${displayLast}`;
};
// displayDelay() 
generatorApp.displayDelay = function(callBack){
	var counter = 25;
	var randomizerIndexA = 0;
	var randomizerIndexB = 0;
	$('button').addClass('randText');
	var randomizer = window.setInterval(function(){
		randomizerIndexA = Math.floor(Math.random()*generatorApp.firstArray.length);
		randomizerIndexB = Math.floor(Math.random()*generatorApp.lastArray.length);
		$('#firstButton').text(generatorApp.firstArray[randomizerIndexA]);
		$('#lastButton').text(generatorApp.lastArray[randomizerIndexB]);
		if (counter <= 0) {
			clearInterval(randomizer);
			$('button').removeClass('randText');
			callBack();
		};
		counter--;
	}, 50);
};
//the generatorApp.generateName() function resets the output variables, stores the value of the inputs in variables, calls the appropriate generation function based on user seleciton, and then calls the display function. It takes no arguments and returns nothing
generatorApp.generateName = function(){
	//check if the user selected name based or random
	// console.log($('#random').is(":checked"));
	generatorApp.outputFirstName = '';
	generatorApp.outputLastName = '';
	generatorApp.inputFirstName = $('#firstName').val();
	generatorApp.inputLastName = $('#lastName').val();
	// console.log(`inputFirst is ${generatorApp.inputFirstName}`);
	// console.log(`inputLast is ${generatorApp.inputLastName}`);
	if ($("#random").is(":checked") == true){
		generatorApp.generateRandom();
	}else{
		generatorApp.generateSimilar();
	};
	// console.log(generatorApp.outputFirstName);
	// console.log(generatorApp.outputLastName);
};

//if they selected name based
generatorApp.generateSimilar = function(){
	//check if either box is locked
	if ($('#saveFirst').is(":checked") == true || $('#saveLast').is(":checked") == true){
		// console.log('save checked');
		//check if both boxes are locked
		if ($('#saveFirst').is(":checked") == true && $('#saveLast').is(":checked") == true){
			generatorApp.outputFirstName = generatorApp.inputFirstName;
			generatorApp.outputLastName = generatorApp.inputLastName;
		}else if ($('#saveFirst').is(":checked") == true){
			//if first box is locked
			//store locked name in box in a variable
			generatorApp.outputFirstName = generatorApp.inputFirstName;
			//generate similar other name
			generatorApp.outputLastName = generatorApp.getSimilar('last', generatorApp.inputLastName);
		}else{
			//else being if second box is locked 
			generatorApp.outputLastName = generatorApp.inputLastName;
			generatorApp.outputFirstName = generatorApp.getSimilar('first', generatorApp.inputFirstName);
		};
	}else{
		//if box is unlocked
		generatorApp.outputFirstName = generatorApp.getSimilar('first', generatorApp.inputFirstName);
		generatorApp.outputLastName = generatorApp.getSimilar('last', generatorApp.inputLastName);
	};
};
//if the user selected random
generatorApp.generateRandom = function(){
	// console.log('random name')
	//check if either box is locked
	if ($('#saveFirst').is(":checked") == true || $('#saveLast').is(":checked") == true){
		// console.log('save checked');
		//check if both boxes are locked
		if ($('#saveFirst').is(":checked") == true && $('#saveLast').is(":checked") == true){
			generatorApp.outputFirstName = generatorApp.inputFirstName;
			generatorApp.outputLastName = generatorApp.inputLastName;
		}else if ($('#saveFirst').is(":checked") == true){
			//if first box is locked
			//store locked name in box in a variable
			generatorApp.outputFirstName = generatorApp.inputFirstName;
			//generate similar other name
			generatorApp.outputLastName = generatorApp.getRandom('last');
		}else{
			//else being if second box is locked 
			generatorApp.outputLastName = generatorApp.inputLastName;
			generatorApp.outputFirstName = generatorApp.getRandom('first');
		};
	}else{
		generatorApp.outputFirstName = generatorApp.getRandom('first');
		generatorApp.outputLastName = generatorApp.getRandom('last');
	};
};

//get similar selects a similar name from the array, it takes two arguments, the position of the name[first,last] and the name it has to be similar to and it returns one string
generatorApp.getSimilar = function(position, input){
	// console.log('generatorApp.getSimilar go!');
	var firstLetter = '';
	var matchArray = [];
	var matchIndex;
	//select a random match from the array of matching names
	if (position == 'first') {
		//error check for input
		if (input != '') {
			//slice the first letter from the name convert to uppercase and store in a variable
			firstLetter = generatorApp.inputFirstName.slice(0,1).toUpperCase();
			//search array for names matching firstLetter and store matches in an array
			matchArray = generatorApp.firstArray.filter(function(name){
				return name.slice(0,1) == firstLetter;
			});
			//select a random index from the array of matches
			matchIndex = Math.floor(Math.random()* matchArray.length);
			//return the random name from the list of matches 
			return matchArray[matchIndex];
		}else{
			//if no input then return a random name
			// console.log('no input first');
			return generatorApp.getRandom('first');
		};
	}else if (position == 'last'){
		if (input != '') {
			//slice the first letter from the name convert to uppercase and store in a variable
			firstLetter = generatorApp.inputLastName.slice(0,1).toUpperCase();
			//search array for names matching firstLetter and store matches in an array
			matchArray = generatorApp.lastArray.filter(function(name){
				return name.slice(0,1) == firstLetter;
			});
			//select a random index from the array of matches
			matchIndex = Math.floor(Math.random()* matchArray.length);
			//return the random name from the list of matches 
			return matchArray[matchIndex];
		}else{
			//if no input then return a random name
			// console.log('no input last');
			return generatorApp.getRandom('last');
		};
	};
};
//get random selects a random name from the array, it takes one argument, the position of the name[first,last] and it returns one string
generatorApp.getRandom = function(position){
	var randomIndex = 0;
	if (position == 'first') {
		randomIndex = Math.floor(Math.random()* generatorApp.firstArray.length);
		return generatorApp.firstArray[randomIndex];
	}else if (position == 'last'){
		randomIndex = Math.floor(Math.random()* generatorApp.lastArray.length);
		return generatorApp.lastArray[randomIndex];
	};
};
		
//The reRoll function accepts two arguments [position] (which accepts [firstButton||firstName] as valid inputs based on which event called reRoll) and [name] which accepts a string of the name to be saved for the reroll. Once it passes the names and ensures the proper save state is set it calls the generateName function. It returns nothing 
generatorApp.reRoll = function(position, name){
	//check which name position is to be saved
	if (position == 'firstButton' || position == 'firstName') {
		//passes the name to the proper box
		$('#firstName').val(name);
		//clears the other box
		$('#lastName').val('');
		//sets the proper savestate for both boxes
		$('#saveFirst').prop('checked',true);
		$('#saveLast').prop('checked',false);
	}else if(position == 'lastButton' || position == 'lastName'){
		//passes the name to the proper box
		$('#lastName').val(name);
		//clears the other box
		$('#firstName').val('');
		//sets the proper savestate for both boxes
		$('#saveFirst').prop('checked',false);
		$('#saveLast').prop('checked',true);
	};
	//runs the generateName function with the new input boxes set
	generatorApp.generateName();
	generatorApp.displayDelay(function(){
		generatorApp.displayNames(generatorApp.outputFirstName,generatorApp.outputLastName)
	});
};

//document ready
$(function(){
	//starts the generator app on document load
	generatorApp.init();	
});