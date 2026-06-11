const express = require('express')
const path = require('path')

const app = express()
const buildPath = path.join(__dirname, 'build')

app.use(express.static(buildPath))

app.use((req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.listen(process.env.PORT || 9000, () => {
  console.log('Frontend server running')
})