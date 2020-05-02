import { ConsoleChat, SimpleFileStorage } from "./external";
import { CommunicationController, TriggerGateway, ITriggerConfigure, CommunicationPresenter } from "./gateways";
import { UpdateConfig } from "./useCases";
import { PeristenceGateway } from "./gateways/persistence";

// Create External
const mockTriggerConfigure: ITriggerConfigure = {
    setTrigger: (id, cron) => {
        console.log("updateTrigger", id, cron);
    },
};

const chat = new ConsoleChat();
const storage = new SimpleFileStorage("data/chats.json");

// Create Outgoing Gateways
const triggerGW = new TriggerGateway(mockTriggerConfigure);
const persitenceGW = new PeristenceGateway(storage);
const communicationPresenter = new CommunicationPresenter(chat);

// Create Use Cases
const updateConfig = new UpdateConfig(communicationPresenter, triggerGW, persitenceGW);

// Create Incoming Gateways
const communicationController = new CommunicationController({ update: updateConfig }, communicationPresenter);

// Initialize External
chat.init(communicationController);

chat.start();
