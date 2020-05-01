export interface UseCase<In, Out> {
    execute: (input: In) => Out;
}
