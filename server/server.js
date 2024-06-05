const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const ffmpeg = require('fluent-ffmpeg');
const dotenv = require('dotenv')


dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '200mb', extended: true }));
app.use(express.urlencoded({ limit: '200mb', extended: true, parameterLimit: 50000 }));

app.get('/', (req, res) => {
    res.send("Server is up and running");
})

const server = require('http').createServer(app);

const io = new Server(server, {
    cors: {
        /*  this is the origin from where requests will be made to our socket io server from client. */
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`Socket connected to ${socket.id}`);

    const socketQueryParams = socket.handshake.query;
    const youtubeUrl = socketQueryParams.youtubeUrl;

    const ffmpegCommand = ffmpeg()
        .input('/dev/video0') // your video source, e.g., webcam
        .inputFormat('v4l2') // format for the video source
        .input('default') // your audio source
        .inputFormat('alsa') // format for the audio source
        .videoCodec('libx264')
        .audioCodec('aac')
        .videoBitrate(3000)
        .audioBitrate('128k')
        .audioFrequency(44100)
        .size('1280x720')
        .fps(30)
        .outputOptions([
            '-preset veryfast',
            '-tune zerolatency',
            '-g 60',
            '-strict -2',
            '-ar 44100',
            '-use_wallclock_as_timestamps 1',
            '-async 1',
        ])
        .output(youtubeUrl)
        .format('flv');

    // Run the command
    ffmpegCommand.on('start', commandLine => {
        console.log('FFmpeg command: ' + commandLine);
    })
        .on('error', (err, stdout, stderr) => {
            console.log('Error: ' + err.message);
            console.log('FFmpeg stderr: ' + stderr);
        })
        .on('end', () => {
            console.log('Streaming ended.');
        })
        .run();

    // When data comes in from the WebSocket, write it to FFmpeg's STDIN.
    socket.on('message', (msg) => {
        console.log('DATA', msg);
        ffmpegCommand.stdin.write(msg);
    });
    

    // If the client disconnects, stop FFmpeg.
    socket.conn.on('close', (e) => {
        console.log('kill: SIGINT');
        ffmpegCommand.kill('SIGINT');
    });
});

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT} for REST API requests`);
});
