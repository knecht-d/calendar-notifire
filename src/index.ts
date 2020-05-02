import { ConsoleChat } from "./external";
import { CommunicationController, TriggerGateway, ITriggerConfigure } from "./gateways";
import { UpdateConfig } from "./useCases";

/* istanbul ignore file */
const mockTriggerConfigure: ITriggerConfigure = {
    setTrigger: (id, cron) => {
        console.log(id, cron);
    },
};

const triggerGW = new TriggerGateway(mockTriggerConfigure);
const updateConfig = new UpdateConfig(triggerGW);

const communicationController = new CommunicationController({ update: updateConfig });
const chat = new ConsoleChat(communicationController);
chat.start();
