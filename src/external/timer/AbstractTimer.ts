import { ITriggerConfigure, ITriggerReceiver } from "../../gateways";

export abstract class AbstractTimer implements ITriggerConfigure {
    protected triggerReceiver?: ITriggerReceiver;
    public init(triggerReceiver: ITriggerReceiver) {
        this.triggerReceiver = triggerReceiver;
    }
    abstract setTrigger(id: string, cron: string): void;
}
