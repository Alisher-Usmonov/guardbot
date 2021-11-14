const TelegramBot = require("node-telegram-bot-api");
const {
    TOKEN
} = require("./config");
const bot = new TelegramBot(TOKEN, {
    webHook: true
});

const main = async (msg) => {
    let text = msg?.text;
    let msgID = msg.message_id;
    console.log(msg);
    if (msg.chat.type === "supergroup") {
        if (!msg.sender_chat) {
            if (msg.forward_from_chat || msg.forward_from) {
                if (msg.photo) {
                    let caption = msg.caption;
                    caption = caption.split(" ");
                    caption.forEach(async cap => {
                        if (cap.startsWith("https://t.me") || cap.search("t.me") > -1) {
                            await bot.deleteMessage(msg.chat.id, msgID)
                        } else {
                            msg.entities.forEach(async entity => {
                                if (entity.type.startsWith("https://t.me")) {
                                    await bot.deleteMessage(msg.chat.id, msgID)
                                }
                            })
                        }
                    })
                } else {
                    text.split(" ").forEach(async txt => {
                        if (txt.startsWith("https://t.me") || txt.search("t.me") > -1) {
                            await bot.deleteMessage(msg.chat.id, msgID)
                        }
                    })
                    msg.entities.forEach(async entity => {
                        if (entity.type.startsWith("https://t.me")) {
                            await bot.deleteMessage(msg.chat.id, msgID)
                        }
                    })
                }
            }
            if (msg.entities) {
                for (let i = 0; i < msg.entities.length; i++) {
                    if (msg.entities[i].type === "mention" || msg.entities[i].type === "url") {
                        await bot.deleteMessage(msg.chat.id, msgID);
                    }
                }
            }
        }
    } else {
        if (text === "/start") {
            await bot.sendMessage(msg.from.id, `Assalomu alaykum <b>${msg.from.first_name}</b> botga xush kelibsiz.\nMeni guruhingizga admin qiling va men guruhdan reklamalarni o'chirib turaman.\nBoshqalar singari o'zim reklama tashlamayman`, {
                parse_mode: "HTML",
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                            text: "Guruhga admin qilish",
                            url: "https://t.me/theguard_robot?startgroup=admin"
                        }]
                    ]
                }
            })
        }
    }
}

bot.on("message", main);
bot.on("edited_message", main);