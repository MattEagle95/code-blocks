const consts = require('../core/config/consts.js')
const Env = require('../core/services/env');

test('get node env', () => {
  process.env.NODE_ENV = 'get_env'

  expect(Env.getNodeEnv()).toBe('get_env')
});

test('set node env', () => {
  Env.setNodeEnv('set_env')

  expect(process.env.NODE_ENV).toBe('set_env')
});

test('check if node_env is development, true', () => {
  process.env.NODE_ENV = consts.NODE_ENV_DEVELOPMENT

  expect(Env.checkNodeEnvDevelopment()).toBe(true)
});

test('check if node_env is development, false', () => {
  process.env.NODE_ENV = 'test'

  expect(Env.checkNodeEnvDevelopment()).toBe(false)
});