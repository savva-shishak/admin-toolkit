export default {

  app: {
    peerStaleTime: 15000,
  },
  worker: {
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
    logLevel: 'debug',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      // 'rtx',
      // 'bwe',
      // 'score',
      // 'simulcast',
      // 'svc'
    ],
  },
  router: {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          //                'x-google-start-bitrate': 1000
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '4d0032',
          'level-asymmetry-allowed': 1,
          //						  'x-google-start-bitrate'  : 1000
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
          'level-asymmetry-allowed': 1,
          //						  'x-google-start-bitrate'  : 1000
        },
      },
    ],
  },

  // rtp listenIps are the most important thing, below. you'll need
  // to set these appropriately for your network for the demo to
  // run anywhere but on localhost
  webRtcTransport: {
    listenIps: [
      { ip: process.env.LOCALIP || '0.0.0.0', announcedIp: process.env.ANNOUNCEDIP || 'localhost' },
      // { ip: "5.35.26.220", announcedIp: null },
      // { ip: '10.10.23.101', announcedIp: null },
    ],
    initialAvailableOutgoingBitrate: 800000,
  },
  plainRtpTransport: {
    listenIp: { ip: '0.0.0.0', announcedIp: 'localhost' }, // TODO: Change announcedIp to your external IP or domain name
    rtcpMux: true,
        comedia: false
  }
};
