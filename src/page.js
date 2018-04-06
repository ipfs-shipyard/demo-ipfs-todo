'use strict'

const html = require('choo/html')

function page (state, emit) {
  return html`
    <div class='center mw6'>
      <header>
        <h1 class='f1 mb4 mt5'>Your ToDos</h1>
      </header>

      ${ state.error ?
        html`
          <div class='bg-red white pa2 mv3'>
            <p class='ma0'>${state.error.message}</p>
          </div>
        `
      : null}

      <input type="text"
        onkeyup=${keyup}
        placeholder='What do you need to do?'
        class='input-reset ba b--black-20 pa2 mb2 db w-100' />

      <ul class='list pa0 mv3'>
        ${state.todos.map((todo, i) => html`
          <li class='mv2 lh-copy'>
            <button data-index=${i}
              onclick=${remove}
              style='cursor: pointer'
              class='dim v-mid f7 w1 pa0 h1 link mr2 br-100 outline-0 bg-gray white bn'>✔</button>
            <span>${todo}</span>
          </li>
        `)}
      </ul>
    </div>
  `

  function keyup (event) {
    if (event.keyCode === 13) {
      const val = event.currentTarget.value
      if (val !== '')
        emit('addTodo', event.currentTarget.value)
    }
  }

  function remove (event) {
    emit('removeTodo', event.target.dataset.index)
  }
}

module.exports = page
