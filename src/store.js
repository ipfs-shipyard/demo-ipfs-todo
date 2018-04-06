'use strict'

const ipfsRequired = require('window.ipfs-is-required')

const FILE = '/todos.txt'

function store (state, emitter) {
  state.todos = []
  state.error = null

  const writeTodos = async () => {
    const todos = JSON.stringify(state.todos)
    const buf = Buffer.from(todos)

    try {
      await window.ipfs.files.write(FILE, buf, {create: true, truncate: true})
      emitter.emit('render')
    } catch (e) {
      state.error = e
    }
  }

  emitter.on('DOMContentLoaded', async () => {
    if (!ipfsRequired()) return

    try {
      const buf = await window.ipfs.files.read(FILE)
      const str = buf.toString()
      state.todos = JSON.parse(str)
      emitter.emit('render')
    } catch (e) {
      writeTodos()
    }
  })

  emitter.on('addTodo', (todo) => {
    state.todos.push(todo)
    writeTodos()
  })

  emitter.on('removeTodo', (index) => {
    state.todos.splice(index, 1)
    writeTodos()
  })
}

module.exports = store
