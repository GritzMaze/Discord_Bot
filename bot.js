var Discord = require('discord.js');
var logger = require('winston');
var {prefix, token} = require('./config.json');
var fs = require('fs');
var http = require('http');
var request = require('request');
var fetch = require('node-fetch');
var util = require('util');

var bot = new Discord.Client({disableEveryone:true});

var hasChangedSmth = true;
var passObj = {
    maps: []
}
bot.once('ready', () => {
    console.log('Ready!'),
bot.guilds.forEach((guild) => {
    let defaultChannel = "";
guild.channels.forEach((channel) => {
    if(channel.type == "text" && defaultChannel == "")
{
    if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
    }
}
})

setInterval(function () {

    fetch('http://wozep.eu/csgo/maps/')
        .then(function(res) {
            return res.text();
        }).then(function(body) {
        //var maps = require('./data.json');
        var content = fs.readFileSync('./data.json');
        var maps = JSON.parse(content);
        console.log('Scanning...')
        if(hasChangedSmth === true) {
            passObj = {
                maps: []
            }
            for(let i = 0; i < maps.maps.length; i++)
            {

                passObj.maps.push(
                    {
                        name: maps.maps[i].name,
                        lastModified: maps.maps[i].lastModified
                    }
                )
            }
            hasChangedSmth = false;
        }
        let msgArray = body.split(/[<->]/g);
        Loop1:
            for(let i = 0; i < msgArray.length; i++)
            {
                if(msgArray[i].substr(0,2) === "ze")
                {
                    let mapName = msgArray[i];
                    let lastMod = msgArray[i+7];
                    for(let j = 0; j < maps.maps.length; j++)
                    {
                        if(mapName === maps.maps[j].name) {
                            if(lastMod.substr(lastMod.length - 7, 5) === passObj.maps[j].lastModified.substr(passObj.maps[j].lastModified.length - 7, 5)) {
                                continue Loop1;
                            }
                            else {
                                passObj.maps[j].lastModified = lastMod;
                                console.log("Changes has been found!")
                                console.log(`${mapName.substr(0, mapName.length - 8 )} has been changed!`);
                                defaultChannel.send(`\`\`\` ${mapName.substr(0, mapName.length - 8 )} has been changed! \`\`\``);
                                hasChangedSmth = true;
                                continue Loop1;
                            }
                        }
                    }
                    passObj.maps.push(
                        {
                            name: mapName,
                            lastModified: lastMod
                        }
                    )
                    mapName = mapName.substr(0, mapName.length - 8 )
                    console.log('New map found!')
                    console.log(`${mapName} has been added!`);
                    defaultChannel.send(`\`\`\` ${mapName} has been added!\`\`\``);
                    hasChangedSmth = true;
                }
            }
            if(hasChangedSmth) {
                let data = JSON.stringify(passObj, null, 2);
                fs.writeFileSync('./data.json', data, 'utf-8');
                console.log("Changes saved!")
            }
        console.log("The scan was successuful! Next one in one minute.")
    });
}, 50000);
})
})

bot.on('message', message => {
    if(message.content.startsWith(`${prefix} greet`))
{
    message.channel.send(`Hello, nub ${message.author}!`);
}
})

bot.on('message', message => {
    if(message.content.startsWith(`${prefix} changelog`))
{
    fetch('http://wozep.eu/csgo/maps/')
        .then(function(res) {
            return res.text();
        }).then(function(body) {
        //var maps = require('./data.json');
        var content = fs.readFileSync('./data.json');
        var maps = JSON.parse(content);
        console.log('Scanning...')
        if(hasChangedSmth === true) {
            passObj = {
                maps: []
            }
            for(let i = 0; i < maps.maps.length; i++)
            {

                passObj.maps.push(
                    {
                        name: maps.maps[i].name,
                        lastModified: maps.maps[i].lastModified
                    }
                )
            }
            hasChangedSmth = false;
        }
        let msgArray = body.split(/[<->]/g);
        Loop1:
            for(let i = 0; i < msgArray.length; i++)
            {
                if(msgArray[i].substr(0,2) === "ze")
                {
                    let mapName = msgArray[i];
                    let lastMod = msgArray[i+7];
                    for(let j = 0; j < maps.maps.length; j++)
                    {
                        if(mapName === maps.maps[j].name) {
                            if(lastMod.substr(lastMod.length - 7, 5) === passObj.maps[j].lastModified.substr(passObj.maps[j].lastModified.length - 7, 5)) {
                                continue Loop1;
                            }
                            else {
                                passObj.maps[j].lastModified = lastMod;
                                console.log("Changes has been found!")
                                console.log(`${mapName.substr(0, mapName.length - 8 )} has been changed!`);
                                message.channel.send(`\`\`\` ${mapName.substr(0, mapName.length - 8 )} has been changed! \`\`\``);
                                hasChangedSmth = true;
                                continue Loop1;
                            }
                        }
                    }
                    passObj.maps.push(
                        {
                            name: mapName,
                            lastModified: lastMod
                        }
                    )
                    mapName = mapName.substr(0, mapName.length - 8 )
                    console.log('New map found!')
                    console.log(`${mapName} has been added!`);
                    message.channel.send(`\`\`\` ${mapName} has been added!\`\`\``);
                    hasChangedSmth = true;
                }
            }
            if(!hasChangedSmth) message.channel.send(`\`\`\` There are no changes made!\`\`\``)
        else {
                let data = JSON.stringify(passObj, null, 2);
                fs.writeFileSync('./data.json', data, 'utf-8');
            }
        console.log("Everything was fine!")
    });
}
})


bot.login(token);