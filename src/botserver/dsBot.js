/**
 * Created by mhasko on 2/26/17.
 */
var Discord = require("discord.js");
var Seedrandom = require('seedrandom');
var Dice = require('node-dice-js');

var client = new Discord.Client();
Seedrandom(Math.random(), {entropy:true, global:true});
var dice = new Dice();

client.on("message", msg => {
    if (msg.content.startsWith("/ds")) {
    var diceVal = dice.parse('1d20+5');
    msg.channel.sendMessage(diceVal.times + '--times '+ diceVal.faces + '--faces ' + diceVal.modifier + '--modifier');
}
});

client.on('ready', () => {
    console.log('I am ready!');
});

client.login("tokenme");