export const MockTimeFrame = {
    getStart: jest.fn(),
    getEnd: jest.fn(),
};

export const MockChatEntity = {
    getTimeFrame: jest.fn().mockReturnValue({ frame: MockTimeFrame }),
    setTimeFrame: jest.fn(),
    removeTimeFrame: jest.fn(),
    getConfig: jest.fn().mockReturnValue({ administrators: ["mockAdmin"], settings: [] }),
};

export const MockChats = {
    instance: {
        createChat: jest.fn().mockReturnValue(MockChatEntity),
        getChat: jest.fn().mockReturnValue(MockChatEntity),
    },
};
