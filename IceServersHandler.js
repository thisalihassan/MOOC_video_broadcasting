// IceServersHandler.js

var IceServersHandler = (function () {
  function getIceServers(connection) {
    // resiprocate: 3344+4433
    // pions: 7575
    var iceServers = [
      {
        urls: [
          "stun:stun4.l.google.com:19302",
          "stun:stun4.l.google.com:19302?transport=udp",
        ],
      },
      {
        url: "turn:numb.viagenie.ca",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
      {
        url: "turn:numb.viagenie.ca?transport=udp",
        credential: "muazkh",
        username: "webrtc@live.com",
      },
    ];

    return iceServers;
  }

  return {
    getIceServers: getIceServers,
  };
})();
