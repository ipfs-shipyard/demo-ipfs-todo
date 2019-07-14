'use strict'

const ipfsRequired = require('window.ipfs-is-required')

const FILE = '/todos.json'

function store (state, emitter) {
  let ipfs = null
  state.todos = []
  state.error = null

  const writeTodos = async () => {
    const todos = JSON.stringify(state.todos)
    const buf = Buffer.from(todos)

    try {
      await ipfs.files.write(FILE, buf, { create: true, truncate: true })
    } catch (e) {
      state.error = e
    }
  }

  emitter.on('DOMContentLoaded', async () => {
    // Checks if window.ipfs is available through window.ipfs-is-required
    // which shows an information bar to download IPFS Companion if window.ipfs
    // is undefined.
    if (!ipfsRequired()) {
      state.error = new Error('You do not have IPFS Companion installed.')
      emitter.emit('render')
      return
    }

    try {
      ipfs = await window.ipfs.enable({ commands: ['files'] })
    } catch (e) {
      state.error = e
    }

    try {
      // Reads the file with the ToDos and if it doesn't exist
      // just creates a new empty one.
      const buf = await ipfs.files.read(FILE)
      const str = buf.toString()
      state.todos = JSON.parse(str)
      emitter.emit('render')
    } catch (e) {
      writeTodos()
    }
  })

  // Adds the ToDo to the list and saves it.
  emitter.on('addTodo', (todo) => {
    state.todos.push(todo)
    emitter.emit('render')
    writeTodos()
  })

  // Removes the ToDo from the list and saves it.
  emitter.on('removeTodo', (index) => {
    state.todos.splice(index, 1)
    emitter.emit('render')
    writeTodos()
  })
}

module.exports = store
