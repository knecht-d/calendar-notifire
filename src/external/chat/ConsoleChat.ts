import { ILogger, logCall, LogLevels, logTime } from "../logging";
import { AbstractChat } from "./AbstractChat";

/* istanbul ignore file */
export class ConsoleChat extends AbstractChat<{ chatId: string; userId: string }> {
    private chatId: string;
    private userId: string;

    constructor(logger: ILogger, setupData: { chatId: string; userId: string }) {
        super(logger, setupData);
        this.chatId = setupData.chatId;
        this.userId = setupData.userId;
    }

    public send(chatId: string, message: string) {
        console.log(chatId, message);
        return Promise.resolve();
    }

    @logCall({ level: LogLevels.info })
    @logTime({ async: true })
    public start() {
        if (!this.communication) {
            throw Error("Chat must be initialized!");
        }
        const standardInput = process.stdin;
        standardInput.setEncoding("utf-8");

        console.log("Please input text in command line.");
        standardInput.on("data", async (data: string) => {
            try {
                const parts = data.trim().split(" ");
                const command = parts.shift();
                const payload = parts.join(" ");
                switch (command) {
                    case "/exit":
                        console.log("User input complete, program exit.");
                        process.exit();
                        break;
                    case "/set":
                        // @ts-ignore
                        await this.communication!.set(this.chatId, this.userId, payload);
                        break;
                    case "/delete":
                        await this.communication!.delete(this.chatId, this.userId, payload);
                        break;
                    case "/read":
                        await this.communication!.read(this.chatId);
                        break;
                    case "/start":
                        await this.communication!.initChat(this.chatId, this.userId);
                        break;
                    case "/addAdmin":
                        await this.communication!.addAdmin(this.chatId, this.userId, payload);
                        break;
                    case "/removeAdmin":
                        await this.communication!.removeAdmin(this.chatId, this.userId, payload);
                        break;
                    default:
                        console.log("User Input Data : " + data);
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        });
        return Promise.resolve();
    }
}
