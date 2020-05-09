import { Builder, LocalFactory } from "./creation";

const factory = new LocalFactory();
const builder = new Builder(factory);
const { chat } = builder.build({
    calendar: {
        events: [
            {
                start: new Date(2020, 4, 3, 15, 0, 0, 0),
                end: new Date(2020, 4, 3, 16, 0, 0, 0),
                title: "Stuff",
            },
        ],
    },
    storage: {
        file: "data/chats.json",
    },
    chatData: {
        chatId: "consoleChat",
        userId: "consoleUser",
    },
});

chat.start();
