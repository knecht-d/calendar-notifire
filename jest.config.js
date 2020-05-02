module.exports = {
    roots: ["src"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    collectCoverageFrom: ["src/**/*.{ts,js}", "!src/**/index.{ts,js}"],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ["json", "lcov", "text", "clover"],
};
