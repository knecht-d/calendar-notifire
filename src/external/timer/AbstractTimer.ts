import { ITriggerConfigure, ITriggerReceiver } from "../../gateways";
import { External } from "../External";

export abstract class AbstractTimer extends External implements ITriggerConfigure {
    protected triggerReceiver?: ITriggerReceiver;
    public init(triggerReceiver: ITriggerReceiver) {
        this.triggerReceiver = triggerReceiver;
    }
    abstract setTrigger(id: string, cron: string): void;
    abstract stopTrigger(id: string): void;
}
