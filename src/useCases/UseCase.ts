export abstract class UseCase<In> {
    abstract execute(input: In): Promise<void>;
}
