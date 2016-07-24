import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'

// Setup jQuery
var $ = require('jquery')
$.browser = {
  mobile: false
}
window.$ = $

// Require all images so they get built
function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../images/', true, /\.(jpg|png)$/));


setTimeout(function () {
  render(
    <section>
      <h1>Initial commit!</h1>
    </section>,
    (document.getElementById('main') || document.getElementById('widget-wrapper'))
  )

}, 0)
