export class EntityError extends Error {
    constructor(public key: EntityErrorCode) {
        super(`${key}`);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, EntityError.prototype);
    }
}

export enum EntityErrorCode {
    CHAT_NOT_EXISTING = "CHAT_NOT_EXISTING",
    CHAT_ALREADY_EXISTING = "CHAT_ALREADY_EXISTING",
    MISSING_PRIVILEGES = "MISSING_PRIVILEGES",
    LAST_ADMIN = "LAST_ADMIN",
    NO_ADMIN = "NO_ADMIN",
    TRIGGER_NOT_DEFINED = "TRIGGER_NOT_DEFINED",
}
