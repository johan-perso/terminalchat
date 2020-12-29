// Dépendances et variable importantes
const Discord = require('discord.js'); // http://npmjs.com/package/discord.js
const client = new Discord.Client(); // http://npmjs.com/package/discord.js
var term = require('terminal-kit').terminal; // https://www.npmjs.com/package/terminal-kit
var config = require('./config.json') // Fichier local

// Vérification du pseudo + censure si besoin
if(config.pseudo.includes("INFORMATION") || config.pseudo.includes("Arrivage") || config.pseudo.includes("*")){
    var pseudo = "##########"
} else {
    var pseudo = config.pseudo
}

// Indication du pseudo
term("Votre pseudo : ") 
term.cyan(pseudo + "\n")

// Connexion au bot Discord
var tokenList = config.token // Liste des token
var token = tokenList[Math.floor(Math.random() * tokenList.length)] // Definition du token utilisé

client.login(token).catch(err => {  
  term.red("Token de bot Discord invalide : Contactez votre fournisseur de terminalchat")
  process.exit()
});
 
// Quand le bot est "prêt", Lancer la fonction send (Demande de texte puis envoie d'un message sur le discord)
client.on('ready', () => {
    client.channels.cache.get(config.channelId).send("Arrivage " + pseudo + " vient de rejoindre le chat.")
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
        client.channels.cache.get(config.channelId).send(pseudo + " : " + text)
        send()
    });
}
});

// Quand on voit un message, L'afficher dans Terminalchat sauf si le message commence par quelque chose en particulier
client.on('message', msg => {
    const args = msg.content.slice().trim().split('');
    var message = args.join('')

    if(message.startsWith("INFORMATION :")){
        term.red(message + "\n\n\n")
    } else {
    if(message.startsWith("Arrivage")){
        term.yellow(message.replace("Arrivage ", ""))
        term.yellow("\n")
    } else {
    if(message.startsWith("*shutdown")){
        term.red("Arrêt de Terminalchat demandé par " + msg.author.username + "\n")
        client.channels.cache.get(config.channelId).send("Arrivage " + pseudo + " vient de quitter le chat.").then(msg => process.exit())
    } else {
        term(message + "\n")
    }
    }
    }

});

// Si on appuie sur CTRL_Z / CTRL_C / CTRL_D, Arrêter le processus
term.grabInput(true);
term.on('key', function(name, matches, data){
  if (name === 'CTRL_Z'){
    client.channels.cache.get(config.channelId).send("Arrivage " + pseudo + " vient de quitter le chat.").then(msg => process.exit())
  }
  if (name === 'CTRL_C'){
    client.channels.cache.get(config.channelId).send("Arrivage " + pseudo + " vient de quitter le chat.").then(msg => process.exit())
  }
  if (name === 'CTRL_D'){
	client.channels.cache.get(config.channelId).send("Arrivage " + pseudo + " vient de quitter le chat.").then(msg => process.exit())
	}
  });
