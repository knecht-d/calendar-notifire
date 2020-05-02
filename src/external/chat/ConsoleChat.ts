import { ICommunicationIn } from "../../gateways";

/* istanbul ignore file */
export class ConsoleChat {
    constructor(private communication: ICommunicationIn) {}

    public start() {
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
                        this.communication.update("consoleChat", "consoleUser", payload);
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
