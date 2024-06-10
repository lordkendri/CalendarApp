module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['./jest.setup.js'],

  //En caso de que de error un EMS
  transformIgnorePatterns: [
    "node_modules/(?!(decode-uri-component|filter-obj|split-on-first|query-string)/)"
  ],

  // ModuleNameMapper sólo si ocupamos importar CSS en nuestros componentes para el testing
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/mocks/styleMock.js',
  },

}

