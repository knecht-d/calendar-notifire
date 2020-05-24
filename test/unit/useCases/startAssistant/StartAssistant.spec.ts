import { EntityError, EntityErrorCode } from "../../../../src/entities/EntityError";
import { StartAssistant, StartAssistantImpl } from "../../../../src/useCases";
import { MockChatEntity, MockChats, MockPersistence, MockTriggerGateway } from "../../../mocks";
import { MockLogger } from "../../../mocks/external/MockLogger";

jest.mock("../../../../src/entities/Chats", () => {
    const MockChats = require("../../../mocks/Entities").MockChats;
    return {
        Chats: MockChats,
    };
});
jest.mock("../../../../src/useCases/utils", () => {
    return {
        createRecurrence: jest.fn().mockImplementation(({ type }) => ({ type })),
    };
});
describe("StartAssistamt", () => {
    let mockTrigger: MockTriggerGateway;
    let mockPersistence: MockPersistence;
    let mockLogger: MockLogger;
    let useCase: StartAssistant;
    beforeAll(() => {
        mockTrigger = new MockTriggerGateway(mockLogger);
        mockPersistence = new MockPersistence(mockLogger);
        mockLogger = new MockLogger();
        useCase = new StartAssistantImpl(mockLogger, mockTrigger, mockPersistence);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("execute", () => {
        beforeAll(() => {
            mockPersistence.readAllChats.mockReturnValue({
                chat: {
                    timeFrames: {
                        any: {
                            begin: {
                                type: "MockedBegin1",
                            },
                            end: {
                                type: "MockedEnd1",
                            },
                            recurrence: {
                                type: "MockedRecurrence1",
                            },
                        },
                        frame: {
                            begin: {
                                type: "MockedBegin2",
                            },
                            end: {
                                type: "MockedEnd2",
                            },
                            recurrence: {
                                type: "MockedRecurrence2",
                            },
                        },
                    },
                    administrators: ["admin0", "admin8"],
                },
                chat2: {
                    timeFrames: {
                        some: {
                            begin: {
                                type: "MockedBegin3",
                            },
                            end: {
                                type: "MockedEnd3",
                            },
                            recurrence: {
                                type: "MockedRecurrence3",
                            },
                        },
                        other: {
                            begin: {
                                type: "MockedBegin4",
                            },
                            end: {
                                type: "MockedEnd4",
                            },
                            recurrence: {
                                type: "MockedRecurrence4",
                            },
                        },
                    },
                    administrators: ["admin1", "admin5"],
                },
            });
        });
        it("should create all the stored chats", async () => {
            await useCase.execute();
            expect(MockChats.instance.createChat).toHaveBeenCalledWith("chat", ["admin0", "admin8"]);
            expect(MockChats.instance.createChat).toHaveBeenCalledWith("chat2", ["admin1", "admin5"]);
        });
        it("should create the timeFrames", async () => {
            await useCase.execute();
            expect(MockChatEntity.setTimeFrame).toHaveBeenCalledWith(
                "any",
                {
                    frame: {
                        begin: {
                            type: "MockedBegin1",
                        },
                        end: {
                            type: "MockedEnd1",
                        },
                    },
                    recurrence: {
                        type: "MockedRecurrence1",
                    },
                },
                "admin0",
            );
            expect(MockChatEntity.setTimeFrame).toHaveBeenCalledWith(
                "frame",
                {
                    frame: {
                        begin: {
                            type: "MockedBegin2",
                        },
                        end: {
                            type: "MockedEnd2",
                        },
                    },
                    recurrence: {
                        type: "MockedRecurrence2",
                    },
                },
                "admin0",
            );
            expect(MockChatEntity.setTimeFrame).toHaveBeenCalledWith(
                "some",
                {
                    frame: {
                        begin: {
                            type: "MockedBegin3",
                        },
                        end: {
                            type: "MockedEnd3",
                        },
                    },
                    recurrence: {
                        type: "MockedRecurrence3",
                    },
                },
                "admin1",
            );
            expect(MockChatEntity.setTimeFrame).toHaveBeenCalledWith(
                "other",
                {
                    frame: {
                        begin: {
                            type: "MockedBegin4",
                        },
                        end: {
                            type: "MockedEnd4",
                        },
                    },
                    recurrence: {
                        type: "MockedRecurrence4",
                    },
                },
                "admin1",
            );
        });
        it("should det the timeFrames in the triger", async () => {
            await useCase.execute();
            expect(mockTrigger.set).toHaveBeenCalledWith("chat", "any", { type: "MockedRecurrence1" });
            expect(mockTrigger.set).toHaveBeenCalledWith("chat", "frame", { type: "MockedRecurrence2" });
            expect(mockTrigger.set).toHaveBeenCalledWith("chat2", "some", { type: "MockedRecurrence3" });
            expect(mockTrigger.set).toHaveBeenCalledWith("chat2", "other", { type: "MockedRecurrence4" });
        });
        it("should log an error if trigger was not defined", async () => {
            MockChats.instance.createChat.mockImplementation(() => {
                throw new EntityError(EntityErrorCode.CHAT_ALREADY_EXISTING);
            });
            await useCase.execute();
            expect(MockChatEntity.addAdmin).not.toHaveBeenCalled();
            expect(mockTrigger.set).not.toHaveBeenCalled();
            expect(mockLogger.error).toHaveBeenCalledWith(
                "StartAssistant",
                new EntityError(EntityErrorCode.CHAT_ALREADY_EXISTING),
            );
        });
    });
});
