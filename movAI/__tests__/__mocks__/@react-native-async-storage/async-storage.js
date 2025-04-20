const mockAsyncStorage = {
    setItem: jest.fn((key, value) => Promise.resolve(value)),
    getItem: jest.fn((key) => Promise.resolve(null)),
    removeItem: jest.fn((key) => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve()),
    multiRemove: jest.fn(() => Promise.resolve()),
};

export default mockAsyncStorage;