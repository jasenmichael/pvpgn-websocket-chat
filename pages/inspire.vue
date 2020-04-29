<template>
  <div>
    <v-app v-if="!socketIsConnected" id="inspire">
      <v-content>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-toolbar color="dark" dark flat>
                  <v-toolbar-title>PvPGN Login</v-toolbar-title>
                  <v-spacer />
                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn :href="source" icon large target="_blank" v-on="on">
                        <v-icon>mdi-code-tags</v-icon>
                      </v-btn>
                    </template>
                    <span>Source</span>
                  </v-tooltip>
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        large
                        href="https://codepen.io/johnjleider/pen/pMvGQO"
                        target="_blank"
                        v-on="on"
                      >
                        <v-icon>mdi-codepen</v-icon>
                      </v-btn>
                    </template>
                    <span>Codepen</span>
                  </v-tooltip>-->
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      label="Login"
                      name="login"
                      prepend-icon="mdi-account"
                      type="text"
                      :value="name"
                    />

                    <v-text-field
                      id="password"
                      label="Password"
                      name="password"
                      prepend-icon="mdi-lock"
                      type="password"
                      :value="password"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" @click="connectChat()">Login</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
    <div v-else>
      <div id="pvpgn" class="chat-box"></div>
    </div>
    <!-- <br /> -->
    <!-- <pre>{{loading}}</pre> -->
  </div>
</template>


<script>
export default {
  data() {
    return {
      socketIsConnected: false,
      name: 'chizzy',
      password: 'chizzy'
      // server: ''
    }
  },
  // head() {
  //   return {
  //     title: 'BNET-CHAT',
  //     script: [
  //       {
  //         hid: 'jquery',
  //         src: 'https://code.jquery.com/jquery-2.1.1.min.js',
  //         callback: () => {
  //           this.jqueryIsLoaded = true
  //         }
  //       },
  //       {
  //         hid: 'materialize',
  //         src: 'js/materialize.min.js',
  //         defer: true,
  //         // Changed after script load
  //         callback: () => {
  //           this.materializeIsLoaded = true
  //         }
  //       },
  //       {
  //         hid: 'util',
  //         src: 'js/websockify/util.js',
  //         defer: true,
  //         // Changed after script load
  //         callback: () => {
  //           this.utilIsLoaded = true
  //         }
  //       },
  //       {
  //         hid: 'webutil',
  //         src: 'js/websockify/webutil.js',
  //         defer: true,
  //         // Changed after script load
  //         callback: () => {
  //           this.webutilIsLoaded = true
  //         }
  //       },
  //       {
  //         hid: 'wesock',
  //         src: 'js/websockify/websock.js',
  //         defer: true,
  //         // Changed after script load
  //         callback: () => {
  //           this.websockIsLoaded = true
  //         }
  //       },
  //       {
  //         hid: 'wspvpgn',
  //         src: 'js/websockify/wspvpgn.js',
  //         defer: true,
  //         // Changed after script load
  //         callback: () => {
  //           this.wspvpgnIsLoaded = true
  //         }
  //       },
  //       {
  //         hid: 'init',
  //         src: 'js/init.js',
  //         defer: true,
  //         // Changed after script load
  //         callback: () => {
  //           this.initIsLoaded = true
  //         }
  //       }
  //     ]
  //   }
  // },
  async mounted() {
    // Websock
    if (process.client) {
      require('~/utils/websock.js')
      let PVPGN = require('~/utils/wspvpgn.js')
      require('~/utils/webutil.js')
    }
  },
  computed: {},
  methods: {
    async connectChat() {
      console.log('connect', this.name, this.password)
      // this.socket.send('chizzy')
    }
  }
}
</script>

