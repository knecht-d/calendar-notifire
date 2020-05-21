import { IGateWayLogger } from "./logging";

export abstract class GateWay<Dependencies> {
    protected dependencies?: Dependencies;
    private isInit = false;
    constructor(protected logger: IGateWayLogger) {}

    init(dependencies: Dependencies) {
        this.isInit = true;
        this.dependencies = dependencies;
    }

    protected checkInitialized() {
        if (!this.isInit) {
            throw new Error("Not Initialized");
        }
    }
}
