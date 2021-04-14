const consts = require('../src/config/consts.js')
const Env = require('../src/util/env')

test('get node env', () => {
  process.env.NODE_ENV = 'get_env'

  expect(Env.getNodeEnv()).toBe('get_env')
})

test('set node env', () => {
  Env.setNodeEnv('set_env')

  expect(process.env.NODE_ENV).toBe('set_env')
})

test('check if node_env is development, true', () => {
  process.env.NODE_ENV = consts.NODE_ENV_DEVELOPMENT

  expect(Env.checkNodeEnvDevelopment()).toBe(true)
})

test('check if node_env is development, false', () => {
  process.env.NODE_ENV = 'test'

  expect(Env.checkNodeEnvDevelopment()).toBe(false)
})

test('get port, port set in env', () => {
  process.env.PORT = 1

  expect(Env.getPort()).toBe(1)
})

test('get port, port not set in env', () => {
  delete process.env.PORT

  expect(Env.getPort()).toBe(consts.ENV_PORT)
})
