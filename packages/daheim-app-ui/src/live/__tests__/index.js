jest.unmock('../index.js')
jest.unmock('../../actions/live')

jest.mock('../Live', () => {
  class MockLive {
    relay (...args) {
      return ['lerelay', ...args]
    }
  }
  return MockLive
})

import * as unit from '../index.js'
import {
  SET_STATE,
  CALL_METHOD
} from '../../actions/live'

describe('live', function () {
  it('reduces', function () {
    const state = unit.liveReducer({a: 0, b: 1}, {type: SET_STATE, payload: {a: 1}})
    expect(state).toEqual({a: 1, b: 1})
  })

  it('executes middleware method calls', function () {
    const store = {}
    const next = jest.fn(() => 'kercerece')
    const mw = unit.liveMiddleware(store)

    const callResult = mw(next)({type: CALL_METHOD, payload: {method: 'relay', args: ['one', 'two']}})
    expect(callResult).toEqual(['lerelay', 'one', 'two'])
    expect(next.mock.calls.length, 0)
  })

  it('ignored other middleware functions', function () {
    const store = {}
    const next = jest.fn(() => 'kercerece')
    const mw = unit.liveMiddleware(store)

    const bogusResult = mw(next)({type: 'bogus'})
    expect(bogusResult).toBe('kercerece')
  })
})
