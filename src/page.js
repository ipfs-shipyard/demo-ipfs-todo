'use strict'

const html = require('choo/html')

function page (state, emit) {
  return html`
    <div>
      <p>Error: ${state.error}</p>
      <ul>
        ${state.todos.map((todo, i) => html`
          <li>${todo} <button data-index=${i} onclick=${remove}>x</button></li>
        `)}
      </ul>

      <input type="text" onkeyup=${keyup} />
    </div>
  `

  function keyup (event) {
    if (event.keyCode === 13) {
      emit('addTodo', event.currentTarget.value)
    }
  }

  function remove (event) {
    emit('removeTodo', event.target.dataset.index)
  }
}

module.exports = page
