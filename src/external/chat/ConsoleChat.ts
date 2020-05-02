import { ICommunicationIn, ICommunicationOut } from "../../gateways";

/* istanbul ignore file */
export class ConsoleChat implements ICommunicationOut {
    private communication?: ICommunicationIn;

    public init(communication: ICommunicationIn) {
        this.communication = communication;
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
                        this.communication!.update("consoleChat", "consoleUser", payload);
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
