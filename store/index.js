export const state = () => ({
  loggedIn: false,
  connect: false,
  channels: [],
  usersInChannel: ''
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
