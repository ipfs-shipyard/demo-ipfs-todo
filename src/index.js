'use strict'

const choo = require('choo')
const store = require('./store')
const page = require('./page')

const app = choo()

app.use(store)
app.route('*', page)
app.mount('#root')
