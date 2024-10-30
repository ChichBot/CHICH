require('dotenv').config();
const { TwitterApi } = require("twitter-api-v2");
const OpenAI = require('openai');

const MinMinutesInterval = 10;
const MaxMinutesInterval = 100;

const openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_SECRET_KEY,
    accessToken: process.env.X_BOT_ACCESS_TOKEN,
    accessSecret: process.env.X_BOT_ACCESS_TOKEN_SECRET,
});

const bearer = new TwitterApi(process.env.X_BEARER_TOKEN);

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;


const tweet = async () => {
    try {
        const chatCompletion = await openAiClient.chat.completions.create({
            messages: [{ role: 'user', content: 'Could you please generate a random tweet for my account? Only the tweet content is needed.' }],
            model: 'gpt-4o-mini',
        });

        let newTweet = chatCompletion.choices[0].message.content;

        await twitterClient.v2.tweet(newTweet);

        console.log(`Tweet: ${newTweet}`);
    } catch (e) {
        console.log(e);
    } finally {
        waitAndTweetAgain();
    }
}

const waitAndTweetAgain = () => {

    const timeToWait = Math.floor(Math.random() * (MaxMinutesInterval - MinMinutesInterval + 1) + MinMinutesInterval) * 60000;

    setTimeout(() => {
        tweet();
    }, timeToWait);
};

tweet();