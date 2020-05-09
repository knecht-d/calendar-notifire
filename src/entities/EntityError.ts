export class EntityError extends Error {
    constructor(public key: EntityErrorCode, public data: { [key: string]: string } = {}) {
        super(`${key}: ${JSON.stringify(data)}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EntityError.prototype);
    }
}

export enum EntityErrorCode {
    CHAT_NOT_EXISTING = "CHAT_NOT_EXISTING",
    CHAT_ALREADY_EXISTING = "CHAT_ALREADY_EXISTING",
    MISSING_PRIVILEGES = "MISSING_PRIVILEGES",
}
