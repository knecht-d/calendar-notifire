import { get, post } from "./interfaces/http";
const token = "<TOKEN>"; // TODO: Enter Telegram Bot Token

// @ts-ignore
function getUpdate() {
    const method = "getUpdates";
    get(`https://api.telegram.org/bot${token}/${method}`)
        .then(console.info)
        .catch(console.error);
}

// @ts-ignore
function sendMessage() {
    const method = "sendMessage";
    const data = {
        chat_id: 42, // TODO: Enter proper chat id (see response of getUpdate())
        text: "Test",
    };
    post(`https://api.telegram.org/bot${token}/${method}`, data)
        .then(console.info)
        .catch(console.error);
}

getUpdate();
sendMessage();
