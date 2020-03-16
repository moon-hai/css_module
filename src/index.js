import React from 'react'
import ReactDom from 'react-dom'
import App from '@/App'

import './css/index.css'
require.context('./img/', true)

ReactDom.render(<App/>, document.getElementById('root'))
