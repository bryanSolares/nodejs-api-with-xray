import globals from 'globals'

export default [
    {
        files: ['**/*.js'],
        ignores: ['node_modules/**', 'test/*'],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-await-in-loop': 'error',
            quotes: ['error', 'single'],
            'no-extra-semi': ['warn']
        }
    }
]
