import { ConsoleChat, SimpleFileStorage } from "./external";
import { CommunicationController, TriggerGateway, ITriggerConfigure } from "./gateways";
import { UpdateConfig } from "./useCases";
import { PeristenceGateway } from "./gateways/persistence";

const mockTriggerConfigure: ITriggerConfigure = {
    setTrigger: (id, cron) => {
        console.log("updateTrigger", id, cron);
    },
};

const storage = new SimpleFileStorage("data/chats.json");
const triggerGW = new TriggerGateway(mockTriggerConfigure);
const persitenceGW = new PeristenceGateway(storage);

const updateConfig = new UpdateConfig(triggerGW, persitenceGW);

const communicationController = new CommunicationController({ update: updateConfig });
const chat = new ConsoleChat(communicationController);
chat.start();
