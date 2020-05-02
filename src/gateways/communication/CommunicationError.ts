export class CommunicationError extends Error {
    constructor(public key: string, public given: string, public expected: string, public example?: string) {
        super(`${key}
        Given: ${given}
        Expected: ${expected}
        ${example ? `Example: ${example}` : ""}
        `);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, CommunicationError.prototype);
    }
}
