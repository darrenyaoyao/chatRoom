module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "node": true,
        "mocha": true,
        "es6": true
    },
    "eslint": "recommended",
    globals: {
        "$": false,
        "document": false,
        "_": false,
        "angular": false,
        "window": false
    },
    "rules": {
        "complexity": [2, 10],
        "comma-dangle": [2, "never"],
        "no-cond-assign": 2,
        "array-bracket-spacing": 2,
        "block-spacing": [2, "always"],
        "brace-style": [2, "1tbs", { "allowSingleLine": true }],
        "camelcase": [2, {"properties": "always"}],
        "curly": 2,
        "default-case": 2,
        "dot-notation": 2,
        "eqeqeq": 2,
        "indent": [
            "error",
            4, { "SwitchCase": 1 }
        ],
        "key-spacing": [2, {"beforeColon": false, "afterColon": true}],
        "max-len": [2, 100, 2, {"ignoreUrls": true}],
        "no-console": 0,
        "no-else-return": 2,
        "no-eval": 2,
        "no-multi-spaces": 2,
        "no-multiple-empty-lines": [2, {"max": 2}],
        "no-shadow": 0,
        "no-trailing-spaces": 2,
        "no-unused-expressions": 2,
        "no-unused-vars": [2, {"args": "none"}],
        "object-curly-spacing": [2, "never"],
        "padded-blocks": [2, "never"],
        "quotes": [
            2,
            "single"
        ],
        "semi": [
            2,
            "always"
        ],
        "keyword-spacing": 2,
        "space-before-blocks": 2,
        "spaced-comment": 2,
        "valid-typeof": 2,
        "react/jsx-uses-react": 1,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-sort-props": 0,
        "react/jsx-closing-bracket-location": [2, "after-props"],
        "react/prefer-es6-class": [1, "always"]
    },
    "plugins": [
        "react"
    ],
    "extends": ["eslint:recommended", "plugin:react/recommended"]
};
