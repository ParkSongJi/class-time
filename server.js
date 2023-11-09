const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);



// 정적 파일 서빙
app.use(express.static(__dirname));

const channels = new Set();


io.on('connection', (socket) => {
    console.log('사용자가 연결되었습니다');

    let nickname = '';
    let channel = '';

    // 클라이언트로부터 수신된 이벤트 처리

    // 닉네임 설정
    socket.on('setNickname', (name) => {
        nickname = name;
        console.log(`닉네임 설정: ${nickname}`);
        io.emit('setNickname', `알림: 닉네임 설정됨 ${nickname}`);
    });

    // 채널 설정
    socket.on('setChannel', (ch) => {
        channel = ch;
        socket.join(channel);
        channels.add(channel);
        console.log(`클라이언트: ${nickname} 님이 채널  ${channel}에 입장!`);
        io.emit('updateChannelList', Array.from(channels));
    });

    // 메세지 설정
    socket.on('message', (message) => {
        console.log(`클라이언트: ${channel}에서 ${message} 보냄!`);
        io.to(channel).emit('message', { sender: nickname, message});
    });


    // 소켓 종료
    socket.on('disconnect', () => {
        console.log(`클라이언트: ${nickname} 접속 종료!`);
    })
});


server.listen(8080, () => {
    console.log('서버가 8080에서 실행중입니다!');
});