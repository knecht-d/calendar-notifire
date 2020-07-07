import { PeristenceGateway } from "../../../../src/gateways";
import { MockLogger } from "../../../mocks/external/MockLogger";

describe("PersistenceGateway", () => {
    const mockPersistence = {
        save: jest.fn(),
        readAll: jest.fn(),
    };
    const mockLogger = new MockLogger();
    beforeEach(() => {
        mockPersistence.save.mockClear();
    });
    describe("saveChatConfig", () => {
        it("should save the updated config as a string", () => {
            const gateway = new PeristenceGateway(mockLogger);
            gateway.init({ persistence: mockPersistence });
            gateway.saveChatConfig("chat", {
                administrators: [],
                triggerSettings: {
                    some: {
                        frame: {
                            begin: {
                                day: {
                                    value: -1,
                                },
                                hour: {
                                    value: 0,
                                    fixed: true,
                                },
                            },
                            end: {
                                year: {
                                    value: 1,
                                    fixed: false,
                                },
                            },
                        },
                        recurrence: { type: "Mocked" } as any,
                    },
                },
            });
            expect(mockPersistence.save).toHaveBeenCalledWith(
                "chat",
                '{"administrators":[],"triggerSettings":{"some":{"frame":{"begin":{"day":{"value":-1},"hour":{"value":0,"fixed":true}},"end":{"year":{"value":1,"fixed":false}}},"recurrence":{"type":"Mocked"}}}}',
            );
        });
    });
    describe("readAllChats", () => {
        it("should read and parse the saved config", () => {
            const gateway = new PeristenceGateway(mockLogger);

            mockPersistence.readAll.mockReturnValue({
                chat:
                    '{"administrators":[],"triggerSettings":{"some":{"frame":{"begin":{"day":{"value":-1},"hour":{"value":0,"fixed":true}},"end":{"year":{"value":1,"fixed":false}}},"recurrence":{"type":"Mocked"}}}}',
                chat2:
                    '{"administrators":[],"triggerSettings":{"some":{"frame":{"begin":{"day":{"value":-2},"hour":{"value":0,"fixed":true}},"end":{"year":{"value":1,"fixed":false}}},"recurrence":{"type":"Mocked2"}}}}',
            });

            gateway.init({ persistence: mockPersistence });
            const data = gateway.readAllChats();
            expect(data).toEqual({
                chat: {
                    administrators: [],
                    triggerSettings: {
                        some: {
                            frame: {
                                begin: {
                                    day: {
                                        value: -1,
                                    },
                                    hour: {
                                        value: 0,
                                        fixed: true,
                                    },
                                },
                                end: {
                                    year: {
                                        value: 1,
                                        fixed: false,
                                    },
                                },
                            },
                            recurrence: {
                                type: "Mocked",
                            },
                        },
                    },
                },
                chat2: {
                    administrators: [],
                    triggerSettings: {
                        some: {
                            frame: {
                                begin: {
                                    day: {
                                        value: -2,
                                    },
                                    hour: {
                                        value: 0,
                                        fixed: true,
                                    },
                                },
                                end: {
                                    year: {
                                        value: 1,
                                        fixed: false,
                                    },
                                },
                            },
                            recurrence: {
                                type: "Mocked2",
                            },
                        },
                    },
                },
            });
        });
    });
});
