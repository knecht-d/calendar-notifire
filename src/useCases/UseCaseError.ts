export class UseCaseError extends Error {
    constructor(public key: UseCaseErrorCode, public data?: { [key: string]: string }) {
        super(`${key}: ${JSON.stringify(data)}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UseCaseError.prototype);
    }
}

export enum UseCaseErrorCode {
    TRIGGER_NOT_DEFINED = "TRIGGER_NOT_DEFINED",
}
