const fs = require('fs')
const app = require('express')()

module.exports = {
  path: '/api',
  handler: app
}

app.get('/', async (req, res) => {
  const data = await getServerData()
  const endpoints = routes.map(route => '/api/' + route.slice(0, -3))
  res.send({
    endpoints,
    data
  })
})


////// '/api' ROUTES 
// require and use each .js in routes dir(except this file)
const routes = fs.readdirSync(__dirname)
  .filter((js) => js !== 'index.js' && (/.js$/).test(js))
routes.forEach(route => {
  app.use(`/${route.slice(0, -3)}`, require(`${__dirname}/${route}`))
})
////// '/api' ROUTES


// FUNCTIONS
// GET SERVER DATA
async function getServerData() {
  return {
    games: ['Warcraft 2 BNE']
  }
}
