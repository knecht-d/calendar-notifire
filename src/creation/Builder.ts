import { Logger, LogLevels } from "../external";
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

    public async build(setupData: {
        calendar: CalendarSetup;
        storage: StorageSetup;
        chatData: ChatSetup;
        loggger: { level: LogLevels };
    }) {
        // Create External
        const logger = new Logger(setupData.loggger.level);
        logger.verbose("Builder", "Create external modules");
        const calendar = this.factory.createCalendar(logger, setupData.calendar);
        const chat = this.factory.createChat(logger, setupData.chatData);
        const storage = this.factory.createStorage(logger, setupData.storage);
        const timer = this.factory.createTimer(logger);

        // Create Gateways
        logger.verbose("Builder", "Create gateways");
        const calendarGW = new CalendarGateway(logger);
        const communicationController = new CommunicationController(logger);
        const communicationPresenter = new CommunicationPresenter(logger);
        const persitenceGW = new PeristenceGateway(logger);
        const triggerGW = new TriggerGateway(logger);

        // Create Use Cases
        logger.verbose("Builder", "Create use cases");
        const deleteConfig = new DeleteConfigImpl(logger, communicationPresenter, triggerGW, persitenceGW);
        const initChat = new InitializeChatImpl(logger, communicationPresenter, persitenceGW);
        const read = new ReadConfigImpl(logger, communicationPresenter, triggerGW);
        const reminder = new ReminderImpl(logger, calendarGW, communicationPresenter);
        const start = new StartAssistantImpl(logger, triggerGW, persitenceGW);
        const setConfig = new SetConfigImpl(logger, communicationPresenter, triggerGW, persitenceGW);
        const addAdmin = new AddAdminImpl(logger, communicationPresenter, persitenceGW);
        const removeAdmin = new RemoveAdminImpl(logger, communicationPresenter, persitenceGW);

        // Initialize Gateways
        logger.verbose("Builder", "Initialize gateways");
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
        logger.verbose("Builder", "Initialize external");
        chat.init(communicationController);
        timer.init(triggerGW);

        // Load persisted chats.
        logger.verbose("Builder", "Load persisted chats");
        await start.execute();

        return {
            calendar,
            chat,
            storage,
            timer,
            start,
        };
    }
}
