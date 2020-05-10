import {
    CalendarGateway,
    CommunicationController,
    CommunicationPresenter,
    PeristenceGateway,
    TriggerGateway,
} from "../gateways";
import { InitializeChatImpl, ReminderImpl, UpdateConfigImpl, StartAssistantImpl } from "../useCases";
import { GenericFactory } from "./GenericFactory";

export class Builder<CalendarSetup, StorageSetup, ChatSetup> {
    constructor(private factory: GenericFactory<CalendarSetup, StorageSetup, ChatSetup>) {}

    build(setupData: { calendar: CalendarSetup; storage: StorageSetup; chatData: ChatSetup }) {
        // Create External
        const calendar = this.factory.createCalendar(setupData.calendar);
        const chat = this.factory.createChat(setupData.chatData);
        const storage = this.factory.createStorage(setupData.storage);
        const timer = this.factory.createTimer();

        // Create Gateways
        const calendarGW = new CalendarGateway();
        const communicationController = new CommunicationController();
        const communicationPresenter = new CommunicationPresenter();
        const persitenceGW = new PeristenceGateway();
        const triggerGW = new TriggerGateway();

        // Create Use Cases
        const initChat = new InitializeChatImpl(communicationPresenter, persitenceGW);
        const reminder = new ReminderImpl(calendarGW, communicationPresenter);
        const start = new StartAssistantImpl(triggerGW, persitenceGW);
        const updateConfig = new UpdateConfigImpl(communicationPresenter, triggerGW, persitenceGW);

        // Initialize Gateways
        calendarGW.init({ calendarConnector: calendar });
        communicationController.init({
            useCases: { update: updateConfig, init: initChat },
            presenter: communicationPresenter,
        });
        communicationPresenter.init({ communication: chat });
        persitenceGW.init({ persistence: storage });
        triggerGW.init({ triggerConfig: timer, reminder: reminder });

        // Initialize External
        chat.init(communicationController);
        timer.init(triggerGW);

        // Load persisted chats.
        start.execute();

        return {
            calendar,
            chat,
            storage,
            timer,
            start,
        };
    }
}
