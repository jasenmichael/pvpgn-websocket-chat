const fs = require('fs')
const execa = require('execa')
const loadIniFile = require('read-ini-file')
const app = require('express')()
const pvpgnHash = require('../utils/pvpgn_hash')
const jwt = require('jsonwebtoken')
const secret = 'q1x9isv*2dag+okv-yf2lq6qjp(3l1v8v5*+wkfy4w43nmk6b'
const datFile = '/usr/local/pvpgn/var/pvpgn/status/server.dat'
const userDir = '/usr/local/pvpgn/var/pvpgn/users'

// ROUTES
app.get('/', async (req, res) => {
  const serverData = await getServerData()
  res.json(serverData)
})
// ?start, ?stop, ?restart
app.post('/', async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '') || false
  if (!token) {
    res.json({
      error: 'token not provided'
    })
  }
  const isTokenValid = await tokenValid(token)
  if (!isTokenValid) {
    res.json({
      error: 'invalid token'
    })
  } else {
    const command = Object.keys(req.query)[0]
    let response = {}
    if (command === 'start' || command === 'stop' || command === 'restart') {
      // console.log(command)
      await pvpgn(command)
    }
    response = await getServerData()
    res.json(response)
  }
})
app.get('/status', async (req, res) => {
  const status = await getStatus('pvpgn')
  res.json(status)
})
app.post('/login', async (req, res) => {
  const user = req.body.user
  const password = req.body.password
  // console.log(user, password)

  if (user && password) {
    if (fs.existsSync(`${userDir}/${user}`)) {
      const userData = await login(user, password)
      if (userData.error) {
        res.json(userData)
      } else {
        const token = await getToken(user, password)
        res.json({
          token,
          ...userData
        })
      }
    } else {
      res.json({
        error: 'user not found'
      })
    }
  } else {
    res.json({
      error: 'missing credentials'
    })
  }
})
app.get('/logout', async (req, res) => {
  res.json('logout')
})
app.get('/users', async (req, res) => {
  const users = await getUsers()
  res.json(users)
})
app.get('/users/:nameOrId', async (req, res) => {
  const nameOrId = req.params.nameOrId
  const user = await getUser(nameOrId)
  res.json(user)
})
app.post('/users/me', async (req, res) => {
  const token = req.headers.authorization.replace('Bearer ', '') || false
  if (!token) {
    res.json({
      error: 'token not provided'
    })
  }
  const isTokenValid = await tokenValid(token)
  if (!isTokenValid) {
    res.json({
      error: 'invalid token'
    })
  } else {
    // get user by token
    let name = (await tokenValid(token)).user
    // get user
    let user = await getUser(name)
    res.json(user)
  }
})

// FUNCTIONS
const getStatus = async (name) => {
  // const name = 'pvpgn'
  const pm2list = await execa('pm2', ['jlist'])
  let status = JSON.parse(pm2list.stdout)
    .filter(app => {
      return app.name === name
    })[0].pm2_env.status || 'error'
  return status.includes('stopped') ? 'stopped' : (status.includes('online') ? 'online' : 'error')
}
const getServerData = async () => {
  let data = await loadIniFile(datFile)
  let status = await getStatus('pvpgn')
  let users = await getUsers()
  let users_online = await Promise.all(Object.values(data.USERS).map(async user => user.split(',')[1]))
  return {
    status,
    version: data.STATUS.Version,
    uptime: status === 'online' ? data.STATUS.Uptime : undefined,
    games: Object.values(data.GAMES).map(game => game.split(',')[2]),
    channels: Object.values(data.CHANNELS),
    user_accounts: data.STATUS.UserAccounts,
    users_online,
    users: users.map(user => {
      user.userData = undefined
      return user
    })
  }
}
const login = async (user, password) => {
  const hashPass = (await loadIniFile(`${userDir}/${user}`))['BNET\\acct\\passhash1']
  const compareHashPass = await pvpgnHash.get_hash(password)
  if (hashPass === compareHashPass) {
    return await getUser(user)
  } else {
    return {
      error: 'invalid password'
    }
  }
}
const getToken = async (user) => {
  return jwt.sign({
    user
  }, secret, {
    expiresIn: '24h'
  })
}
const tokenValid = async (token) => {
  if (token) {
    return jwt.verify(token, secret, (err, decoded) => {
      console.log(decoded)
      if (err) {
        console.log('invalid token')
        return false
      }
      if (decoded) {
        console.log(`valid token for ${decoded.user}`)
        return decoded
      }
    })
  }
}
const getUsers = async () => {
  let userList = fs.readdirSync(userDir)
  // console.log(users)
  const users = await Promise.all(userList.map(async name => await getUserData(name)))
  return users
}
const getUser = async (nameOrId) => {
  const user = (await getUsers()).filter(user => {
    return user.id === nameOrId || user.name === nameOrId
  })[0] || {
    error: 'name or id not found'
  }
  return user
}
const getUserData = async (name) => {
  const data = await loadIniFile(`${userDir}/${name}`)
  const userData = {
    name,
    // game: data.split(',')[0] || 'none',
    id: data["BNET\\acct\\userid"] || undefined,
    lastlogin_time: data["BNET\\acct\\lastlogin_time"] || undefined,
    lastlogin_ip: data["BNET\\acct\\lastlogin_ip"] || undefined,
    lastgame_result: data["Record\\W2BN\\0\\last game result"] || undefined,
    last_game: data["Record\\W2BN\\0\\last game"] || undefined,
    draws: data["Record\\W2BN\\0\\draws"] || 0,
    wins: data["Record\\W2BN\\0\\wins"] || 0,
    losses: data["Record\\W2BN\\0\\losses"] || 0,
    // admin: data["BNET\\auth\\command_groups"] === "255" ? true : undefined
    admin: data["BNET\\auth\\admin"] || undefined
  }
  return userData
}
const pvpgn = async (command) => {
  let pm2Command = `pm2 ${command} pvpgn`
  console.log('running ' + pm2Command)
  const status = await getStatus('pvpgn')
  if (
    status === 'online' && command === 'start' ||
    status === 'stopped' && command === 'stop'
  ) {
    console.log(`server already ${status}, not running ${command}`)
  } else {
    await execa('pm2', [command, 'pvpgn'])
  }
  return
}

module.exports = app
