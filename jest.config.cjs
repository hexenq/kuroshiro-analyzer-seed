const shared = {
    testMatch: ["<rootDir>/test/**/*.spec.js"],
    transform: { "^.+\\.jsx?$": "babel-jest" }
};

module.exports = {
    projects: [
        { ...shared, displayName: "node", testEnvironment: "node" },
        { ...shared, displayName: "browser", testEnvironment: "jsdom" }
    ]
};
