export abstract class GateWay<Dependencies> {
    protected dependencies?: Dependencies;
    private isInit = false;
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
