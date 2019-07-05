let liveServer = require("live-server");
let params = { port : 80,
               host : "0.0.0.0", //地址回环
               root : "./",
               open : false
             };
liveServer.start(params);
