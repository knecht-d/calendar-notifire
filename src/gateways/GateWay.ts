import { IGateWayLogger, logCall } from "./logging";

export abstract class GateWay<Dependencies> {
    protected dependencies?: Dependencies;
    private isInit = false;
    constructor(protected logger: IGateWayLogger) {}

    init(dependencies: Dependencies) {
        this.isInit = true;
        this.dependencies = dependencies;
    }

    @logCall({ level: "debug" })
    protected checkInitialized() {
        if (!this.isInit) {
            this.logger.error(`${this.constructor.name}`, "not initialized");
            throw new Error("Not Initialized");
        }
    }
}
