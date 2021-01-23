const envalid = require('envalid')
var pjson = require('./package.json');

module.exports = envalid.cleanEnv(process.env, {
    HOST: envalid.host({ default: 'localhost' }),
    PORT: envalid.port({ default: 4000, desc: 'The port to start the server on' }),
    VERSION: envalid.str({ default: pjson.version }),
    BINANCE_API_KEY: envalid.str({ default: '' }),
    BINANCE_SECRET_KEY: envalid.str({ default: '' }),
    DATABASE_URL: envalid.str({ default: '' }),
    BVA_API_KEY: envalid.str(),
    USE_TELEGRAM: envalid.bool({ default: "true" }),
    TELEGRAM_TOKEN: envalid.str(),
    TELEGRAM_CHAT_ID: envalid.num()
})