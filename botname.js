/**
 * By: Ryan Murray - JustNFTs
 * Created: 03/27/2023
 * Last Updated: 03/27/2023
 * Version: 1.01
 */

const Discord = require('discord.js');
const { Octokit } = require('@octokit/rest');

const client = new Discord.Client();
const octokit = new Octokit();

// Setting the Values. Please be sure to replace them with your own. Please note: The channel IDs can be different for different repos or the same.
const REPOSITORIES = [
  { name: 'GITHUB_USERNAME/REPO_NAME', discordChannelId: 'DISCORD_CHANNEL_ID' },
  { name: 'GITHUB_USERNAME/REPO_NAME2', discordChannelId: 'DISCORD_CHANNEL_ID' }
];
const DISCORD_BOT_TOKEN = 'DISCORD_BOT_TOKEN';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Adding a 5 min time delay for checking, to not spam the system.
setInterval(async () => {
  for (const { name, discordChannelId } of REPOSITORIES) {
    const { data: latestCommit } = await octokit.repos.getCommits({
      owner: name.split('/')[0],
      repo: name.split('/')[1],
      per_page: 1
    });

    const { author: { login }, html_url, sha, commit: { message } } = latestCommit[0];
    const { name: branch } = latestCommit[0].commit.tree;
    const commitUrl = `https://github.com/${name}/compare/${sha}~1...${sha}`;

    // You can change the display messsages below -- ONLY DO IF YOU KNOW WHAT YOU ARE DOING
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`${name} has been updated`)
      .setURL(html_url)
      .addField('Author', login, true)
      .addField('Branch', branch, true)
      .addField('Message', message)
      .addField('Compare Changes', commitUrl);

    client.channels.cache.get(discordChannelId).send(embed);
  }
}, 5 * 60 * 1000);

client.login(DISCORD_BOT_TOKEN);
