export const state = () => ({
  loggedIn: false,
  connect: false,
  channels: [],
  usersInChannel: '',
  servers: [{
    name: 'Ru: War2 Server',
    zone: '-3',
    host: 'server.war2.ru',
    port: '6112',
    websockify_ip: 'pvpgn-websockify.herokuapp.com',
    websockify_port: '80',
    enabled: true,
    client_tags: ['W2BN'],
    settings: {
      remember_me: true,
      stay_loggedin: true,
      username: '',
      password: '',
      last_channel: 'war2bne',
      last_client: 'W2BN',
      stats: ''
    },
  }]
})


// dispatch
export const actions = {
  async loggIn({
    commit
  }) {
    await commit('SET_LOGGED_IN', true)
  },
  async loggOut({
    commit
  }) {
    await commit('SET_LOGGED_IN', false)
    await commit('SET_USERS_IN_CHANNEL', '')
  }
}

// commit
export const mutations = {
  SET_LOGGED_IN(state, value) {
    state.loggedIn = value
  },
  SET_USERS_IN_CHANNEL(state, users) {
    if (state.usersInChannel !== users) {
      state.usersInChannel = users
    }
  }
}
