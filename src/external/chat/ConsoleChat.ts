import { AbstractChat } from "./AbstractChat";

/* istanbul ignore file */
export class ConsoleChat extends AbstractChat<{ chatId: string; userId: string }> {
    private chatId: string;
    private userId: string;

    constructor(setupData: { chatId: string; userId: string }) {
        super(setupData);
        this.chatId = setupData.chatId;
        this.userId = setupData.userId;
    }

    public send(chatId: string, message: string) {
        console.log(chatId, message);
    }

    public start() {
        if (!this.communication) {
            throw Error("Chat must be initialized!");
        }
        const standardInput = process.stdin;
        standardInput.setEncoding("utf-8");

        console.log("Please input text in command line.");
        standardInput.on("data", (data: string) => {
            try {
                const parts = data.trim().split(" ");
                const command = parts.shift();
                const payload = parts.join(" ");
                switch (command) {
                    case "/exit":
                        console.log("User input complete, program exit.");
                        process.exit();
                    case "/update":
                        this.communication!.update(this.chatId, this.userId, payload);
                        break;
                    case "/delete":
                        this.communication!.delete(this.chatId, this.userId, payload);
                        break;
                    case "/start":
                        this.communication!.initChat(this.chatId, this.userId);
                        break;
                    default:
                        console.log("User Input Data : " + data);
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
}
