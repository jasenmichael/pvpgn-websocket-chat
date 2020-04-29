/*
 * WebSockets PvPGN client
 * by rchase
 * https://github.com/reillychase/pvpgn_html5_chat_client
 */

function PVPGN(connect_callback, disconnect_callback, updateusers_callback, username, password, chatroom) {

  var that = {}, // Public API interface
    ws, sQ = [],
    in_channel = [],
    // chatroom = 'FIGHTCLUB',
    state = "unconnected",
    // username = username
    in_channel = [];
  let last_in_channel_update = []
  // that.username = username

  Array.prototype.pushStr = function (str) {
    var n = str.length;
    for (var i = 0; i < n; i++) {
      this.push(str.charCodeAt(i));
    }
  }

  function do_send() {
    if (sQ.length > 0) {
      Util.Debug("Sending " + sQ);
      ws.send(sQ);
      sQ = [];
    }
  }

  function do_recv() {
    console.log(">> do_recv");
    var rQ, rQi, i;

    while (ws.rQlen() > 1) {
      rQ = ws.get_rQ();
      rQi = ws.get_rQi();
      for (i = rQi; i < rQ.length; i++) {
        if (rQ[i] === 10) {
          break;
        }
      }
      if (i >= rQ.length) {
        // No line break found
        break;
      }
      recvMsg(ws.rQshiftStr((i - rQi) + 1));
      // console.log('rQ', rQ)
      // console.log('rQi', rQi)
    }

  }

  // Handle a PVPGN message
  function recvMsg(msg) {

    var empty = 0;
    var flag = 1;
    var not_whisper = 1;
    Util.Debug(">> recvMsg");

    // All the regex we want to catch coming from the server to the client

    unicode_catch_regex = /\\([0-9][0-9][0-9])/g;
    unicode_catch = unicode_catch_regex.exec(msg)


    if (unicode_catch != null) {

      result = msg.match(unicode_catch_regex);
      for (var i = 0; i < result.length; ++i) {
        charToReplace = result[i].toString();
        charCode = parseInt(result[i].toString().replace(/\\(.)/mg, "$1"));
        console.log(charCode)
        msg = msg.replace(charToReplace, String.fromCharCode(parseInt(charCode, 8)))
      }

    }

    // console.log(msg)

    whisper_to_regex = /^\<to (.*)\> (.*)/g;
    whisper_to = whisper_to_regex.exec(msg)

    whisper_from_regex = /^\<from (.*)\> (.*)/g;
    whisper_from = whisper_from_regex.exec(msg)

    broadcast_regex = /^Broadcast: (.*)/g;
    broadcast = broadcast_regex.exec(msg)

    no_bot_regex = /^Account has no bot access/g;
    no_bot = no_bot_regex.exec(msg)

    failed_regex = /^Login failed/g;
    failed = failed_regex.exec(msg);

    empty_regex = /^\r\n$/g;
    empty2 = empty_regex.exec(msg);

    success_regex = /^Your unique name/g;
    success = success_regex.exec(msg);

    password_regex = /^Password/g;
    password2 = password_regex.exec(msg);

    username_regex = /^Username/g;
    username2 = username_regex.exec(msg);

    sorry_regex = /^Sorry, there is no guest account/g;
    sorry = sorry_regex.exec(msg);

    enter_regex = /^Enter your account name/g;
    enter = enter_regex.exec(msg);

    bot_regex = /^BOT or Telnet Connection from/g;
    bot = bot_regex.exec(msg);

    is_here_regex = /^\[(.*) is here\]/g;
    is_here = is_here_regex.exec(msg);

    enters_regex = /^\[(.*) enters\]/g;
    enters = enters_regex.exec(msg);

    leaves_regex = /^\[(.*) leaves\]/g;
    leaves = leaves_regex.exec(msg);

    joining_channel_regex = /^Joining channel: (.*)/g;
    joining_channel = joining_channel_regex.exec(msg);

    quit_regex = /^\[(.*) quit\]/g;
    quit = quit_regex.exec(msg);

    kicked_regex = /^\[(.*) has been kicked\]/g;
    kicked = kicked_regex.exec(msg);

    banned_regex = /^\[(.*) has been banned\]/g;
    banned = banned_regex.exec(msg);

    chat_regex = /^<(.*)> (.*)/g;
    chat = chat_regex.exec(msg);

    error_regex = /^ERROR: (.*)/g;
    error = error_regex.exec(msg);

    // Catch all to turn anything that didn't match a regex into a yellow msg from server
    if (whisper_to == null && whisper_from == null && success == null && failed == null && joining_channel == null && empty2 == null && username2 == null && password2 == null && bot == null && sorry == null && enter == null && chat == null && is_here == null && banned == null && enters == null && error == null && leaves == null && quit == null && kicked == null) {
      new_msg = '<span style="color: #ffff00;">' + escapeHtml(msg) + '</span>'
      writeToChannel(new_msg);
      flag = 0;
    }

    // Catch all for messages that should be ignored and not sent to chatroom
    if (username2 != null || password2 != null || sorry != null || bot != null || enter != null || empty2 != null) {
      flag = 0;
    }

    if (whisper_to != null) {
      new_msg = '<span style="color: #00ffff;">&ltTo: ' + unescape(escapeHtml(whisper_to[1])) + '&gt</span><span style="color: gray"> ' + unescape(escapeHtml(whisper_to[2])) + '</span>'
      writeToChannel(new_msg);
      whisper_to = whisper_to_regex.exec(msg);
      flag = 0;
      not_whisper = 0;
    }

    if (whisper_from != null) {
      new_msg = '<span style="color: #ffff00;">&ltFrom: ' + unescape(escapeHtml(whisper_from[1])) + '&gt</span><span style="color: gray"> ' + unescape(escapeHtml(whisper_from[2])) + '</span>'
      writeToChannel(new_msg);
      whisper_from = whisper_from_regex.exec(msg);
      flag = 0;
      not_whisper = 0;
    }

    // What to do when all other regexes are seen
    while (success != null) {
      // $D('login').style.display = 'none';
      // $D('pvpgn').style.display = 'block';
      // $D('msg').style.display = 'block';
      // $D('connectButtonWrap').style.display = 'none';
      // $D('html').classList.add("black");
      // Materialize.toast('Connected!', 1000, "green") // 4000 is the duration of the toast
      success = success_regex.exec(msg);
      flag = 0;
    };

    while (failed != null) {
      // $D('login').style.display = 'block';
      // $D('connectButton').disabled = false;
      // $D('pvpgn').style.display = 'none';
      // $D('msg').style.display = 'none';
      // $D('html').classList.remove("black");
      // Materialize.toast('Login failed', 4000, "red") // 4000 is the duration of the toast
      // failed = failed_regex.exec(msg);
      that.disconnect();
      flag = 0;
    };

    while (no_bot != null) {

      // $D('login').style.display = 'block';
      // $D('connectButton').disabled = false;
      // $D('pvpgn').style.display = 'none';
      // $D('msg').style.display = 'none';
      // $D('html').classList.remove("black");
      // Materialize.toast("PvPGN server blocked telnet", 4000, "red") // 4000 is the duration of the toast
      // no_bot = no_bot_regex.exec(msg);
      that.disconnect();
      flag = 0;
    };

    // regular chat to channel
    while (chat != null) {
      if (not_whisper == 1) {
        new_msg = '<span style="color: #ffff00;">&lt;' + escapeHtml(chat[1]) + '&gt;</span><span style="color: #fff;"> ' + unescape(escapeHtml(chat[2])) + '</span>'
        writeToChannel(new_msg);
      }
      chat = chat_regex.exec(msg);
      flag = 0;
    };

    // is here ran after join channel for each user
    while (is_here != null) {
      chatroom = chatroom + '<li><a href="#"">' + escapeHtml(is_here[1]) + '</a></li>'
      in_channel.push(is_here[1]);
      // updateusers_callback('add', is_here[1])

      is_here = is_here_regex.exec(msg);

      flag = 0;
    };

    // when user enters channel
    while (enters != null) {
      chatroom = chatroom + '<li><a href="#"">' + escapeHtml(enters[1]) + '</a></li>'
      in_channel.push(enters[1]);
      enters = enters_regex.exec(msg);
      flag = 0;
    };


    while (kicked != null) {
      var index = in_channel.indexOf(kicked[1]);
      if (index > -1) {
        in_channel.splice(index, 1);
      }
      chatroom = '';
      for (var i = 0; i < in_channel.length; i++) {
        chatroom = chatroom + '<li><a href="#"">' + escapeHtml(in_channel[i]) + '</a></li>'
      }
      kicked = kicked_regex.exec(msg);
      flag = 0;
    };


    while (banned != null) {
      var index = in_channel.indexOf(banned[1]);
      if (index > -1) {
        in_channel.splice(index, 1);
      }
      chatroom = '';
      for (var i = 0; i < in_channel.length; i++) {
        chatroom = chatroom + '<li><a href="#"">' + escapeHtml(in_channel[i]) + '</a></li>'
      }
      banned = banned_regex.exec(msg);
      flag = 0;
    };

    while (leaves != null) {
      var index = in_channel.indexOf(leaves[1]);
      if (index > -1) {
        in_channel.splice(index, 1);
      }
      chatroom = '';
      for (var i = 0; i < in_channel.length; i++) {
        chatroom = chatroom + '<li><a href="#"">' + escapeHtml(in_channel[i]) + '</a></li>'
      }
      leaves = leaves_regex.exec(msg);
      flag = 0;
    };

    while (quit != null) {
      var index = in_channel.indexOf(quit[1]);
      if (index > -1) {
        in_channel.splice(index, 1);
      }
      chatroom = '';
      for (var i = 0; i < in_channel.length; i++) {
        chatroom = chatroom + '<li><a href="#"">' + escapeHtml(in_channel[i]) + '</a></li>'
      }
      quit = quit_regex.exec(msg);
      flag = 0;
    };

    while (joining_channel != null) {
      chatroom = ''
      in_channel = [];
      new_msg = '<span style="color: #00ef00;">Joining channel: ' + escapeHtml(joining_channel[1]) + '</span>'
      writeToChannel(new_msg);
      joining_channel = joining_channel_regex.exec(msg);
      flag = 0;
    };

    while (error != null) {
      new_msg = '<span style="color: #ff0000;">' + escapeHtml(error[1]) + '</span>'
      writeToChannel(new_msg);
      error = error_regex.exec(msg);
      flag = 0;
    };

    while (broadcast != null) {
      new_msg = '<span style="color: #ff0000;">' + escapeHtml(broadcast[1]) + '</span>'
      writeToChannel(new_msg);
      broadcast = broadcast_regex.exec(msg);
      flag = 0;
    };

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // add users to in channel ist
    // $D("chatroom-ul").innerHTML = chatroom;
    if (in_channel.length) {
      // updateusers_callback(chatroom)
      updateusers_callback(in_channel.join())
    }
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&




    // console.log('in_channel', in_channel)
    // Show raw received
    if (flag == 1) {
      writeToChannel(escapeHtml(msg));
    }






    // console.log('recvMsg', msg)
    // return msg


  }

  function writeToChannel(msg) {

    msgLog.push(msg);
    var full_list = ""
    for (var i = 0; i < msgLog.length; ++i) {
      full_list = full_list + msgLog[i] + "<br>"
    }

    // add messages !!!!!
    //  *******************************************************
    //  *******************************************************
    //  *******************************************************
    //  *******************************************************
    document.getElementById("pvpgn").innerHTML = full_list;
    $D("pvpgn").innerHTML = full_list;
    window.scrollTo(0, $D("pvpgn-chat-wrapper").scrollHeight);
    //  *******************************************************
    //  *******************************************************
    //  *******************************************************
    //  *******************************************************


  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function sendCmd(msg) {
    Util.Info("Sending: " + msg);
    sQ.pushStr(msg + "\r\n");
    do_send();
  }

  that.sendMsg = function (msg, username) {
    var write = 1;
    is_command_regex = /^\//g;
    is_command = is_command_regex.exec(msg);

    while (is_command != null) {
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      is_command = is_command_regex.exec(msg);
      write = 0;
    };

    if (write == 1) {
      let htmlMsg = `<span style="color: #00ffff;">&lt;${username}&gt;</span><span style="color: white;" >${escapeHtml(msg)}</span>`
      writeToChannel(htmlMsg)
    }
    sendCmd(msg);
  }

  that.connect = function (username, password, server) {
    // var host = '10.14.72.153',
    //   port = 6110,
    //   username = username,
    //   password = password,
    //   channel = 'war2bne',
    //   clientTag = 'W2BN',
    //   scheme = "ws://",
    //   // uri;

    // host = 'pvpgn-websockify.herokuapp.com',
    //   port = 80
    
    console.log(server)
    var host = server.websockify_ip,
      port = server.websockify_port,
      username = username,
      password = password,
      channel = server.settings.last_channel || 'war2bne',
      clientTag = server.settings.last_client || 'W2BN',
      scheme = "ws://",
      uri

    Util.Debug(">> connect");
    if (ws) {
      ws.close();
    }

    uri = scheme + host + ":" + port;

    console.log("connecting to " + uri);

    ws.open(uri);
    sendCmd("\r\n");
    sendCmd(username);
    sendCmd("\r\n");
    sendCmd(password);
    sendCmd("\r\n");
    sendCmd("/join " + channel);
    sendCmd("\r\n");
    Util.Debug("<< connect");
    return true;
  }

  that.disconnect = function () {
    Util.Debug(">> disconnect");
    if (ws) {
      ws.close();
    }
    // $D('login').style.display = 'block';
    // $D('connectButton').disabled = false;
    // $D('pvpgn').style.display = 'none';
    // $D('msg').style.display = 'none';
    // $D('html').classList.remove("black");
    // $D("pvpgn").innerHTML = '';
    disconnect_callback();
    Util.Debug("<< disconnect");
  }

  // function sleep(milliseconds) {
  //   var start = new Date().getTime();
  //   for (var i = 0; i < 1e7; i++) {
  //     if ((new Date().getTime() - start) > milliseconds) {
  //       break;
  //     }
  //   }
  // }

  function constructor() {
    /* Initialize Websock object */
    ws = new Websock();

    ws.on('message', do_recv);
    ws.on('open', function (e) {
      console.log('ws.on open')
      Util.Info(">> WebSockets.onopen");
      state = "connected";
      msgLog = [];
      // username = $D('username').value;
      // username = username
      sendCmd("\r\n");
      connect_callback();
      Util.Info("<< WebSockets.onopen");
    });
    ws.on('close', function (e) {
      Util.Info(">> WebSockets.onclose");
      that.disconnect();
      Util.Info("<< WebSockets.onclose");
    });
    ws.on('error', function (e) {
      Util.Info(">> WebSockets.onerror");
      that.disconnect();
      Util.Info("<< WebSockets.onerror");
    });

    return that;
  }

  return constructor(); // Return the public API interface

} // End of Telnet()
