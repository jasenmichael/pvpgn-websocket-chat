<template>
  <div class="main-section-frame-top" style="width:100%;height:100%;position: relative;">
    <!-- <div v-show="!loggedIn" class="center-text bnet-frame pa-0 ma-0">Battle.net Login</div> -->
    <div
      fill
      class="ma-0 pa-0 pt-3"
      v-show="scriptsLoaded"
      :class="isMobile && 'main-mobile-section-frame'"
      style="height:100%;"
    >
      <!-- login -->

      <div
        class="login pt-4"
        v-show="!loggedIn"
        style="font-family: 'Times New Roman', Times, serif;"
      >
      <!-- <pre>{{selectedServer}}</pre> -->
      <h3>Select Server</h3>
        <v-select
          :items="servers.map(server=>server.name)"
          v-model="selectedServer"
          filled
          label="Select Server"
          dense
          solo
          class="message-box pb-2"
          style=""
          background-color="black"
          hide-details
          >
          <!-- :value="servers.map(server=>server.name)[0]" -->
        </v-select>
        <h3 class="pl-1" style="font-stretch: expanded">
          <span class="pr-0" style="text-decoration: underline">N</span>ame:
        </h3>
        <div class="message-box-wrapper ma-0 pa-0">
          <v-text-field
            class="message-box"
            solo
            :menu-props="{ top: true, offsetY: true }"
            full-width
            flat
            dense
            background-color="black"
            v-model="username"
          ></v-text-field>
        </div>

        <h3 class="pl-1" style="font-stretch: expanded">
          <span class="pr-0" style="text-decoration: underline">P</span>assword:
        </h3>
        <div class="message-box-wrapper ma-0 pa-0">
          <v-text-field
            class="message-box"
            solo
            full-width
            flat
            dense
            background-color="black"
            v-model="password"
            type="password"
          ></v-text-field>
        </div>

        <br />
        <div id="connectButtonWrap" class="text-center">
          <v-avatar tile height="80" width="180">
            <v-btn
              tile
              text
              x-large
              depressed
              outlined
              block
              :class="'wc2-btn display-1'"
              height="80"
              @click.native="connect(username, password)"
              :disabled="(username.length >= 4 && password.length >= 4) ? false : true"
            >
              <span>Login</span>
            </v-btn>
          </v-avatar>
            <!-- <pre>{{servers.filter(server=>server.name===selectedServer)[0]}}</pre> -->
        </div>
      </div>
      <!-- login -->

      <!-- chat section -->
      <div v-show="loggedIn">
        <v-col cols="12" class="pt-4">
          <!-- chat box -->
          <v-row dense align="stretch" justify="start">
            <div
              id="pvpgn-chat-wrapper"
              class="chat-wrapper wc2-blackbox"
              :style="`height:calc(100vh - ${isMobile ? 240 : 330}px);`"
            >
              <div id="pvpgn" class="chat-box pb-2"></div>
            </div>
          </v-row>
          <!-- chat box -->

          <!-- chat input box -->
          <v-row class="message-box-wrapper" dense>
            <v-col align="center" color="black">
              <v-text-field
                class="pa-0 ma-0 message-box"
                v-model="message"
                color="black"
                background-color="black"
                full-width
                solo
                height="8"
                hide-details
                autofocus
                dense
                single-line
                filled
                @click="sendMsg()"
                @keydown.enter="sendMsg()"
              />
            </v-col>
          </v-row>
          <!-- chat input box -->
        </v-col>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      selectedServer: 0,
      username: '',
      password: '',
      chatroom: 'War2BNE',
      usersInChatroom: [],
      message: '',
      pvpgn: undefined,
      jqueryIsLoaded: false,
      materializeIsLoaded: false,
      materializeMinIsLoaded: false,
      utilIsLoaded: false,
      webutilIsLoaded: false,
      websockIsLoaded: false,
      wspvpgnIsLoaded: false,
      initIsLoaded: false,
      webSocketLoaded: false
    }
  },
  head() {
    return {
      title: 'BNET-CHAT',
      script: [
        {
          hid: 'jquery',
          src: 'js/jquery-2.1.1.min.js',
          callback: () => {
            this.jqueryIsLoaded = true
          }
        },
        {
          hid: 'materialize',
          src: 'js/materialize.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.materializeIsLoaded = true
          }
        },
        {
          hid: 'materializeMin',
          src: 'js/materialize.min.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.materializeMinIsLoaded = true
          }
        },
        {
          hid: 'util',
          src: 'js/websockify/util.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.utilIsLoaded = true
          }
        },
        {
          hid: 'webutil',
          src: 'js/websockify/webutil.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.webutilIsLoaded = true
          }
        },
        {
          hid: 'wesock',
          src: 'js/websockify/websock.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.websockIsLoaded = true
          }
        },
        {
          hid: 'wspvpgn',
          src: 'js/websockify/wspvpgn.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.wspvpgnIsLoaded = true
          },
          body: true
        },
        {
          hid: 'init',
          src: 'js/init.js',
          defer: true,
          // Changed after script load
          callback: () => {
            this.initIsLoaded = true
          },
          body: true
        }
      ]
    }
  },
  async beforemount() {
    console.log(this, isMobile)
    this.isMobile
  },
  async mounted() {
    if (process.client) {
      let loadScriptsInterval = setInterval(async () => {
        await this.loadPvpgnWebsocket()
        if (this.pvpgn !== undefined) {
          clearInterval(loadScriptsInterval)
          setTimeout(() => {
            this.webSocketLoaded = true
          }, 200)
        }
      }, 3000)
    }
  },
  computed: {
    ...mapState({
      loggedIn: state => state.loggedIn,
      servers: state => state.servers
    }),
    isMobile() {
      return this.$vuetify.breakpoint.width < 1264
    },
    scriptsLoaded() {
      return (
        this.jqueryIsLoaded &&
        this.materializeIsLoaded &&
        this.utilIsLoaded &&
        this.webutilIsLoaded &&
        this.websockIsLoaded &&
        this.wspvpgnIsLoaded &&
        this.initIsLoaded &&
        this.webSocketLoaded
      )
    }
  },
  methods: {
    ...mapMutations({
      SET_LOGGED_IN: 'SET_LOGGED_IN',
      SET_USERS_IN_CHANNEL: 'SET_USERS_IN_CHANNEL',
      SET_CURRENT_CHANNEL: 'SET_CURRENT_CHANNEL'
    }),
    ...mapActions(['loggIn', 'loggOut']),
    // LOAD PVPGN SOCKET
    async loadPvpgnWebsocket() {
      if (this.pvpgn === undefined) {
        this.pvpgn = await window.PVPGN(
          this.connected,
          this.disconnected,
          this.SET_USERS_IN_CHANNEL,
          this.username
        )
      }
    },
    sendMsg() {
      if (event.keyCode === 13) {
        var msg = this.message
        this.message = ''
        Util.Debug("calling sendMsg('" + msg + "')")
        this.pvpgn.sendMsg(msg, this.username)
        // if (msg === '/exit') {
        //   // this.connectedToPvpgn = false
        //   this.loggOut()
        //   // this.SET_LOGGED_IN(false)
        // }
      }
    },

    connect() {
      let channel = this.servers.filter(server=>server.name===this.selectedServer)[0].settings.last_channel
      console.log('channel===>>>', channel)
      this.SET_CURRENT_CHANNEL(channel)
      let server = this.servers.filter(server=>server.name===this.selectedServer)[0]
      let ret = this.pvpgn.connect(this.username, this.password, server)
      // window.PVPGN.connect(this.name, this.password, 'FIGHTCLUB')
      if (!ret) {
        this.errorMessage = 'Connection failed'
        console.log('Connection failed')
      } else {
        console.log('websocket connected')
      }
    },
    disconnect() {
      console.log('disconnecting.....')
      if (this.pvpgn !== undefined) {
        this.pvpgn.disconnect()
        // window.PVPGN.disconnect()
      }
    },
    connected() {
      console.log('connecting.....')
      this.loggIn()
    },
    disconnected() {
      console.log('disconneted event...')
      this.loggOut()
    }
  },
  watch: {
    loggedIn: function(val) {
      // console.log('loggedIn watch', val)
      if (val === false) {
        this.pvpgn.sendMsg('/exit')
      }
    }
  }
}
</script>
