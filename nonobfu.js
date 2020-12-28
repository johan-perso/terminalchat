// Dépendances et variable importantes
const Discord = require('discord.js'); // http://npmjs.com/package/discord.js
const client = new Discord.Client(); // http://npmjs.com/package/discord.js
var term = require('terminal-kit').terminal; // https://www.npmjs.com/package/terminal-kit
var config = require('./config.json') // Fichier local

// Indication du pseudo
term("Votre pseudo : ") 
term.cyan(config.pseudo + "\n")

// Connexion au bot Discord
client.login(config.token).catch(err => {
  term.red("Token de bot Discord invalide : Contactez votre fournisseur de terminalchat")
  process.exit()
});
 
// Quand le bot est "prêt", Lancer la fonction send (Demande de texte puis envoie d'un message sur le discord)
client.on('ready', () => {
    send()
    function send() {
    term.inputField(function(error, text){
        term.deleteLine()
        if(error){
          term.red("Erreur...")
        }
        if(text.length === 0){
          term.red("Message vide... ")
          return send()
        }
        client.channels.cache.get(config.channelId).send(config.pseudo + " : " + text)
        send()
    });
}
});

// Quand on voit un message, L'afficher dans Terminalchat
client.on('message', msg => {
    const args = msg.content.slice().trim().split('');
    var message = args.join('')
    term(message + "\n")
});

// Si on appuie sur CTRL_Z / CTRL_C / CTRL_D, Arrêter le processus
term.grabInput(true);
term.on('key', function(name, matches, data){
  if (name === 'CTRL_Z'){
		process.exit();
  }
  if (name === 'CTRL_C'){
    process.exit();
  }
  if (name === 'CTRL_D'){
		process.exit();
	}
  });
