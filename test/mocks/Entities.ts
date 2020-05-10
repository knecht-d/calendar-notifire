export const MockTimeFrame = {
    getStart: jest.fn(),
    getEnd: jest.fn(),
};

export const MockChatEntity = {
    getTimeFrame: jest.fn().mockReturnValue(MockTimeFrame),
    setTimeFrame: jest.fn(),
    removeTimeFrame: jest.fn(),
    toJSON: jest.fn().mockReturnValue({ mock: "newChat" }),
};

export const MockChats = {
    instance: {
        createChat: jest.fn().mockReturnValue(MockChatEntity),
        getChat: jest.fn().mockReturnValue(MockChatEntity),
    },
};
