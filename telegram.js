const TeleBot = require('telebot')
const _ = require('lodash')
const env = require('./env')

const telBot = new TeleBot({
    token: env.TELEGRAM_TOKEN, // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        interval: 700, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
        // proxy: 'http://username:password@yourproxy.com:8080' // Optional. An HTTP proxy to be used.
    },
    // webhook: { // Optional. Use webhook instead of polling.
    //     key: 'key.pem', // Optional. Private key for server.
    //     cert: 'cert.pem', // Optional. Public key.
    //     url: 'https://....', // HTTPS url to send updates to.
    //     host: '0.0.0.0', // Webhook server host.
    //     port: 443, // Server port.
    //     maxConnections: 40 // Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
    // },
    allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    usePlugins: ['askUser'], // Optional. Use user plugins from pluginFolder.
    pluginFolder: '../plugins/', // Optional. Plugin folder location.
    pluginConfig: { // Optional. Plugin configuration.
        // myPluginName: {
        //   data: 'my custom value'
        // }
    }
});

exports.start = function (trading_pairs) {

    telBot.on('/chanel', async (msg) => {
        return telBot.sendMessage(msg.chat.id, "Chanel ID : " + msg.chat.id + "\n")
    });

    //Get Info. Open signals
    telBot.on('/info', async (msg) => {
        response = "Open Trades: " + _.values(trading_pairs).length + "\n"
        return telBot.sendMessage(env.TELEGRAM_CHAT_ID, response)
    });

    //Get Binace Spot Balance
    // telBot.on('/balance', async (msg) => {
    //     let response = "-------SPOT BALANCE-----\n"
    //     available_balances.forEach(c => {
    //         response += c.asset + ": " + c.available + "\n"
    //     })
    //     return telBot.sendMessage(env.TELEGRAM_CHAT_ID, response)
    // })

    telBot.start();

    return true;

}

exports.sendMessage = function (msg) {
    telBot.sendMessage(env.TELEGRAM_CHAT_ID, msg)
}

exports.signal = function (type, signal) {

    let msg

    if (type === 'buy_long_signal') {
        msg = `🟢 ${signal.stratname.toUpperCase()} \n`
        msg += `#${signal.pair} \n`
        msg += 'ENTER LONG TRADE \n'
        msg += `Buy At: ${signal.price} \n`
        msg += (signal.score ? "ML: " + signal.score : 'ML: NA') + "\n"

    } else if (type === 'buy_short_signal') {
        msg = `🟢 ${signal.stratname.toUpperCase()} \n`
        msg += `#${signal.pair} \n`
        msg += 'COVER SHORT TRADE \n'
        msg += `Buy At: ${signal.price} \n`
        msg += (signal.score ? "ML: " + signal.score : 'ML: NA') + "\n"

    } else if (type === 'sell_enter_short') {
        msg = `🔴 ${signal.stratname.toUpperCase()} \n`
        msg += `#${signal.pair} \n`
        msg += 'COVER SHORT TRADE \n'
        msg += `Sell At: ${signal.price} \n`
        msg += (signal.score ? "ML: " + signal.score : 'ML: NA') + "\n"

    } else if (type = 'sell_exit_long') {
        msg = `🔴 ${signal.stratname.toUpperCase()} \n`
        msg += `#${signal.pair} \n`
        msg += 'EXIT LONG TRADE \n'
        msg += `Sell At: ${signal.price} \n`
        msg += (signal.score ? "ML: " + signal.score : 'ML: NA') + "\n"

    }

    return telBot.sendMessage(env.TELEGRAM_CHAT_ID, msg)

}

exports.info = function (msg) {
    msg = `ℹ️ ${msg}`
    return telBot.sendMessage(env.TELEGRAM_CHAT_ID, msg)
}

exports.error = function (error) {
    if (error.code) {
        msg = '⚠⚠ ERROR ⚠⚠ \n'
        msg += error.code + '\n'
        msg += error.message + '\n'
        msg += '\n For more detail view application logs. \n'
    } else {
        msg = '⚠⚠ ERROR ⚠⚠ \n'
        msg += "Something didn't go right"
    }
    return telBot.sendMessage(env.TELEGRAM_CHAT_ID, msg)
}



