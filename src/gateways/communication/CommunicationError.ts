export class CommunicationError extends Error {
    constructor(
        public key: CommunicationErrorCode,
        public given: string = "",
        public expected: string = "",
        public example?: string,
    ) {
        super(`${key}
        Given: ${given}
        Expected: ${expected}
        ${example ? `Example: ${example}` : ""}
        `);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CommunicationError.prototype);
    }
}

export enum CommunicationErrorCode {
    MISSING_TRIGGER_ID = "MISSING_TRIGGER_ID",
    INVALID_RECURRENCE_TYPE = "INVALID_RECURRENCE_TYPE",
    INVALID_NUMBER_OF_ARGUMENTS = "INVALID_NUMBER_OF_ARGUMENTS",
    INVALID_DAYS = "INVALID_DAYS",
    INVALID_DAY_OF_MONTH = "INVALID_DAY_OF_MONTH",
    INVALID_TIME = "INVALID_TIME",
    INVALID_FRAME_CONFIG = "INVALID_FRAME_CONFIG",
    INVALID_CRON_SETTING = "INVALID_CRON_SETTING",
}
