import {
    CalendarGateway,
    CommunicationController,
    CommunicationPresenter,
    PeristenceGateway,
    TriggerGateway,
} from "../gateways";
import {
    AddAdminImpl,
    DeleteConfigImpl,
    InitializeChatImpl,
    ReadConfigImpl,
    ReminderImpl,
    RemoveAdminImpl,
    SetConfigImpl,
    StartAssistantImpl,
} from "../useCases";
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
        const deleteConfig = new DeleteConfigImpl(communicationPresenter, triggerGW, persitenceGW);
        const initChat = new InitializeChatImpl(communicationPresenter, persitenceGW);
        const read = new ReadConfigImpl(communicationPresenter);
        const reminder = new ReminderImpl(calendarGW, communicationPresenter);
        const start = new StartAssistantImpl(triggerGW, persitenceGW);
        const setConfig = new SetConfigImpl(communicationPresenter, triggerGW, persitenceGW);
        const addAdmin = new AddAdminImpl(communicationPresenter, persitenceGW);
        const removeAdmin = new RemoveAdminImpl(communicationPresenter, persitenceGW);

        // Initialize Gateways
        calendarGW.init({ calendarConnector: calendar });
        communicationController.init({
            useCases: {
                config: {
                    delete: deleteConfig,
                    read: read,
                    set: setConfig,
                },
                admin: {
                    init: initChat,
                    add: addAdmin,
                    remove: removeAdmin,
                },
            },
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
