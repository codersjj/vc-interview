export default {
    testEnvironment: 'node',
    transform: {}, // Disable transformation for native ESM support
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};
