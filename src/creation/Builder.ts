import { GenericFactory } from "./GenericFactory";
import { UpdateConfigImpl, ReminderImpl, InitializeChatImlp } from "../useCases";
import {
    CommunicationController,
    TriggerGateway,
    PeristenceGateway,
    CommunicationPresenter,
    CalendarGateway,
} from "../gateways";

export class Builder<CalendarSetup, StorageSetup, ChatSetup> {
    constructor(private factory: GenericFactory<CalendarSetup, StorageSetup, ChatSetup>) {}

    build(setupData: { calendar: CalendarSetup; storage: StorageSetup; chatData: ChatSetup }) {
        // Create External
        const calendar = this.factory.createCalendar(setupData.calendar);
        const chat = this.factory.createChat(setupData.chatData);
        const storage = this.factory.createStorage(setupData.storage);
        const timer = this.factory.createTimer();

        // Create Gateways
        const communicationPresenter = new CommunicationPresenter();
        const communicationController = new CommunicationController();
        const persitenceGW = new PeristenceGateway();
        const calendarGW = new CalendarGateway();
        const triggerGW = new TriggerGateway();

        // Create Use Cases
        const updateConfig = new UpdateConfigImpl(communicationPresenter, triggerGW, persitenceGW);
        const reminder = new ReminderImpl(calendarGW, communicationPresenter);
        const initChat = new InitializeChatImlp(communicationPresenter, persitenceGW);

        // Initialize Gateways
        communicationPresenter.init({ communication: chat });
        communicationController.init({
            useCases: { update: updateConfig, init: initChat },
            presenter: communicationPresenter,
        });
        persitenceGW.init({ persistence: storage });
        calendarGW.init({ calendarConnector: calendar });
        triggerGW.init({ triggerConfig: timer, reminder: reminder });

        // Initialize External
        chat.init(communicationController);
        timer.init(triggerGW);

        return {
            chat,
            storage,
        };
    }
}
