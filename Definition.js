exports.action = function(data, callback){

	let client = setClient(data);
	info("Definition from:", data.client, "To:", client);
	definir (data, client);
	callback();
 
}


function definir (data, client) {
	
	let definition = data.action.rawSentence.toLowerCase().replace("la", "").replace("définition", "").replace("du", "").replace("de", "").replace("mot", "").replace("verbe", "").trim();

	if(!definition) {
	Avatar.speak('je ne comprend pas quel synonyme que tu veux!', data.client, () => {
		Avatar.Speech.end(data.client);
	});
	return;
	}

	fetch(`https://www.le-dictionnaire.com/definition/${definition}`)
	.then(response => {
		if (!response.ok) {
		  throw new Error(`Code erreur: ${response.status}`);
		}
		return response.text();
	  })
	.then((html) => {
	const cheerio = require('cheerio');
	const $ = cheerio.load(html);
	const definir = $('#maincontent > div:nth-child(5) > ul > li:nth-child(1)').text();

	Avatar.speak(`Voici la définition de. ${definition}. ${definir}.`, data.client, () => {
		Avatar.Speech.end(data.client);
	});
	return;
	})
	.catch(error => {
	Avatar.speak(`Erreur lors de la requête au site synonyme:, ${error.message}`, data.client, () => {
	Avatar.Speech.end(data.client);
	  });
	  });
	
}


function setClient (data) {
	var client = data.client;
    if (data.action.room)
	client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
	client = data.action.setRoom;
	return client;
}