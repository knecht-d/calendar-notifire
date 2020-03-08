/* istanbul ignore file */
import { get, post } from "./interfaces/http";
const token = "<token>"; // TODO: Enter Telegram Bot Token

async function getUpdate() {
    const method = "getUpdates";
    try {
        const result = await get(`https://api.telegram.org/bot${token}/${method}`);
        console.info(result);
    } catch (error) {
        console.error(error);
    }
}

async function sendMessage() {
    const method = "sendMessage";
    const data = {
        chat_id: 42, // TODO: Enter proper chat id (see response of getUpdate())
        text: "Test",
    };
    try {
        const result = await post(`https://api.telegram.org/bot${token}/${method}`, data);
        console.info(result);
    } catch (error) {
        console.error(error);
    }
}

// tslint:disable-next-line: no-floating-promises
getUpdate();
// tslint:disable-next-line: no-floating-promises
sendMessage();
