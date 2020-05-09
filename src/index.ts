import { ConsoleChat, SimpleFileStorage } from "./external";
import {
    CommunicationController,
    TriggerGateway,
    ITriggerConfigure,
    CommunicationPresenter,
    CalendarGateway,
    ICalendarConnector,
} from "./gateways";
import { UpdateConfig, Reminder, InitializeChat } from "./useCases";
import { PeristenceGateway } from "./gateways/persistence";

let triggerGW: TriggerGateway | null = null;
// Create External
const mockTriggerConfigure: ITriggerConfigure = {
    setTrigger: (id, cron) => {
        setInterval(() => {
            console.log("Trigger:", id, cron);
            if (triggerGW) {
                triggerGW.trigger(id);
            }
        }, 1000);
    },
};

const mockEventProvider: ICalendarConnector = {
    getEvents: () => {
        return [
            {
                start: new Date(2020, 4, 3, 15, 0, 0, 0),
                end: new Date(2020, 4, 3, 16, 0, 0, 0),
                title: "Stuff",
            },
        ];
    },
};

const chat = new ConsoleChat();
const storage = new SimpleFileStorage("data/chats.json");

// Create Outgoing Gateways
triggerGW = new TriggerGateway(mockTriggerConfigure);
const persitenceGW = new PeristenceGateway(storage);
const communicationPresenter = new CommunicationPresenter(chat);
const calendarGW = new CalendarGateway(mockEventProvider);

// Create Use Cases
const updateConfig = new UpdateConfig(communicationPresenter, triggerGW, persitenceGW);
const reminder = new Reminder(calendarGW, communicationPresenter);
const initChat = new InitializeChat(communicationPresenter, persitenceGW);

// Create Incoming Gateways
const communicationController = new CommunicationController(
    { update: updateConfig, init: initChat },
    communicationPresenter,
);

// Initialize Gateways
triggerGW.init(reminder);

// Initialize External
chat.init(communicationController);

chat.start();
