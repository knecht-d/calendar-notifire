module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/typescript",
        // "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "jest", "import", "prettier"],
    rules: {
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        quotes: [2, "double", "avoid-escape"],
        "spaced-comment": ["error", "always"],
        "@typescript-eslint/naming-convention": [
            "warn",
            {
                selector: "property",
                modifiers: ["static"],
                format: ["UPPER_CASE"],
            },
            {
                selector: "typeLike",
                format: ["PascalCase"],
            },
            {
                selector: "interface",
                format: ["PascalCase"],
                prefix: ["I"],
            },
        ],
        "@typescript-eslint/member-ordering": [
            "warn",
            {
                default: [
                    "public-static-field",
                    "protected-static-field",
                    "private-static-field",
                    "public-instance-field",
                    "protected-instance-field",
                    "private-instance-field",
                    "constructor",
                    "public-static-method",
                    "protected-static-method",
                    "private-static-method",
                    "public-instance-method",
                    "protected-instance-method",
                    "private-instance-method",
                ],
            },
        ],

        "import/no-default-export": "error",
        "import/order": "error",
        "import/newline-after-import": "error",
        "import/no-absolute-path": "error",
        "import/no-cycle": "error",
    },
    overrides: [
        {
            files: ["*.spec.ts"],
            rules: {
                "@typescript-eslint/unbound-method": "off",
            },
        },
    ],
};
