import { PeristenceGateway } from "./PersistenceGateway";

describe("PersistenceGateway", () => {
    const mockPersistence = {
        save: jest.fn(),
    };
    beforeEach(() => {
        mockPersistence.save.mockClear();
    });
    describe("saveUpdatedConfig", () => {
        it("should save the updated config as a string", () => {
            const gateway = new PeristenceGateway(mockPersistence);
            gateway.saveUpdatedConfig("chat", {
                timeFrames: {
                    some: {
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
                        recurrence: {
                            type: "Mocked",
                        },
                    },
                },
            } as any);
            expect(mockPersistence.save).toHaveBeenCalledWith(
                "chat",
                '{"timeFrames":{"some":{"begin":{"day":{"value":-1},"hour":{"value":0,"fixed":true}},"end":{"year":{"value":1,"fixed":false}},"recurrence":{"type":"Mocked"}}}}',
            );
        });
    });
});
