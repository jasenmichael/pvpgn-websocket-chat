<template>
  <v-app
    fluid
    dark
    :style="`
      background-image: url(/themes/images/${theme}-bnet-background.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;`"
  >
    <!-- top bar -->
    <v-app-bar
      flat
      :short="isMobile"
      class="top-bar"
      color="transparent"
      :clipped-right="clipped"
      :clipped-left="clipped"
      app
      :height="isMobile ? 80 : 180"
      prominent
    >
      <v-app-bar-nav-icon v-show="isMobile && loggedIn" @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-toolbar-title
        :class="isMobile ? 'nav-title-moblie' : 'nav-title'"
        style="cursor: pointer;"
        @click="$router.push('/')"
      >
        <span style="font-style: italic" class="pvpgn-font">PvPGN</span>
        <span style="font-style: normal" class="wc2-font">Chat</span>
        <!-- <span v-html="loggedIn"></span> -->
      </v-toolbar-title>

      <v-spacer />
      <v-btn v-show="isMobile && loggedIn" icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-account-outline</v-icon>
      </v-btn>
      <!-- <v-btn href="?login=true" icon>
        <v-icon>mdi-account-off-outline</v-icon>
      </v-btn>-->
    </v-app-bar>
    <!-- top bar -->
    <!-- <div class="main-frame"> -->

    <!-- left panel -->
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      fixed
      flat
      :clipped="clipped"
      :permanent="!isMobile"
      :mini-variant="miniVariant"
      color="transparent"
      :width="isMobile ? (loggedIn ? 240 : 14) : (loggedIn ? 220 : 30)"
      :class="isMobile ? 'left-panel-mobile' : 'left-panel'"
    >
      <v-list></v-list>

      <template v-slot:append>
        <v-row
          v-show="loggedIn"
          v-for="item in panelItems.filter(t=>t.section === 'left-bottom')"
          :key="item.name"
          align-content="space-between"
          justify="start"
          class="pl-0 mb-0"
        >
          <v-avatar tile height="120" width="220" :class="isMobile ? 'ml-2' : 'ml-4'">
            <v-btn
              tile
              text
              large
              depressed
              outlined
              :block="false"
              class="wc2-btn headline"
              :class="isMobile ? '' : ''"
              height="90"
              :width="180"
              @click="loggOut() && (drawer = !drawer)"
            >
              <span>{{item.name}}</span>
            </v-btn>
          </v-avatar>
        </v-row>
      </template>
    </v-navigation-drawer>
    <!-- left panel -->

    <!-- right navigation drawer-->
    <v-navigation-drawer
      v-model="rightDrawer"
      app
      floating
      fixed
      flat
      right
      color="transparent"
      :clipped="true"
      :permanent="!isMobile"
      :width="isMobile ? 300 : (loggedIn ? 440 : 30)"
      :class="isMobile ? 'right-panel-mobile' : 'right-panel'"
      class="right-panel"
      style="margin-right:2px;"
    >
      <!-- right navigation drawer top -->
      <!-- <v-content fluid> -->

      <v-row v-show="loggedIn">
        <v-col>
          <!-- // CHANNEL -->
          <v-row
            dense
            justify="center"
            no-gutters
            class="channel-frame mt-1"
            :class="isMobile ? 'mr-3' : 'ml-6 mr-7'"
          >
            <div class="my-3">
              <span pt-4>FIGHTCLUB (2)</span>
            </div>
          </v-row>

          <!-- // USERS LIST -->
          <!-- <v-flex d-flex child-flex class="fill-height"> -->
            <v-row
              class="wc2-blackbox user-list align-stretch"
              :class="isMobile ? 'mt-5 ml-2 mr-4' : 'mt-5 ml-1 mr-5'"
              :style="`height:calc(100vh - ${isMobile ? 240 : 398}px);`"
              dense
              align="stretch"
              justify="start"
            >
              <!-- style="height:500px;" -->
              <v-list color="black">
                <v-list-item v-for="(user, i) in usersInChannel" :key="i">{{user}}</v-list-item>
              </v-list>
            </v-row>

            <!-- // SEND WHISPER BUTTON -->
            <v-row></v-row>
          <!-- </v-flex> -->
        </v-col>
      </v-row>
      <!-- </v-content> -->

      <!-- right navigation drawer top -->

      <!-- right navigation drawer pushed to bottom-->
      <template v-slot:append>
        <v-row align="center" justify="center">
          <!-- <v-btn block>Logout</v-btn> -->
        </v-row>
      </template>
      <!-- right navigation drawer pushed to bottom-->
    </v-navigation-drawer>
    <!-- right navigation drawer-->

    <!-- main content -->
    <v-content>
      <nuxt />
    </v-content>
    <!-- main content -->
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      theme: 'wc2',
      // loggedIn: true,
      connected: true,
      panelItems: [
        {
          name: 'Channel',
          section: 'left-bottom'
        },
        {
          name: 'Quit',
          section: 'left-bottom'
        },
        {
          name: 'Send',
          section: 'right-bottom'
        },
        {
          name: 'Whisper',
          section: 'right-bottom'
        }
      ],
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        // {
        //   class: 'fighter',
        //   img: '/icon.png',
        //   // icon: 'mdi-home',
        //   title: 'HOME',
        //   to: '/'
        // },
        {
          // icon: 'mdi-chart-bubble',
          class: 'wc2',
          img: '/wc2icon.png',
          title: 'Warcraft 2 BNE',
          // to: '/warcraft2'
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'FIGHTCLUB'
    }
  },
  mounted() {
    // console.log('BREAKPOINT isMobile===>>', this.isMobile)
    // console.log(this.$vuetify)
    // this.mobile
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.width < 1264
    },
    ...mapState({
      loggedIn: state => state.loggedIn,
      getUsersInChannel: state => state.usersInChannel
    }),
    usersInChannel() {
      return this.getUsersInChannel.split(',')
    }
  },
  methods: {
    ...mapActions(['loggOut'])
  }
}
</script>


<style>
@import '~/static/themes/wc2.css';
.user-list {
    position: relative;
  overflow-y: auto;
}
</style>
