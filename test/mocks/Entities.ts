export const MockTimeFrame = {
    getStart: jest.fn(),
    getEnd: jest.fn(),
};

export const MockChatEntity = {
    getTrigger: jest.fn().mockReturnValue({ frame: MockTimeFrame }),
    setTrigger: jest.fn(),
    removeTrigger: jest.fn(),
    addAdmin: jest.fn(),
    removeAdmin: jest.fn(),
    getConfig: jest.fn().mockReturnValue({ administrators: ["mockAdmin"], settings: [] }),
};

export const MockChats = {
    instance: {
        createChat: jest.fn().mockReturnValue(MockChatEntity),
        getChat: jest.fn().mockReturnValue(MockChatEntity),
    },
};
