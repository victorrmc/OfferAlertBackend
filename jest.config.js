// jest.config.js
export default {
    transform: {},
    testEnvironment: 'node',
    transformIgnorePatterns: [
        'node_modules/(?!(puppeteer-extra|puppeteer-extra-plugin.*)/)'
    ],
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/test/**/*.test.js'],
    verbose: true,
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
};