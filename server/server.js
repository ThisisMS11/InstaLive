import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import http from 'http';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(json({ limit: '200mb', extended: true }));
app.use(urlencoded({ limit: '200mb', extended: true, parameterLimit: 50000 }));

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  let ffmpegCommand = null;
  let passThroughStream = new PassThrough();

  console.log(`Socket connected to ${socket.id}`);
  const youtubeUrl = socket.handshake.query.youtubeUrl;

  console.log({ youtubeUrl });

  socket.on('without-overlay', () => {
    console.log('WithoutOverlay Event was hit');

    if (ffmpegCommand) {
      ffmpegCommand.kill('SIGINT');
      passThroughStream.end();
      passThroughStream = new PassThrough();
    }

    ffmpegCommand = ffmpeg(passThroughStream)
      .inputFormat('webm')
      .videoCodec('libx264')
      .addOption('-preset', 'veryfast')
      .addOption('-tune', 'zerolatency')
      .fps(30)
      .addOption('-g', '60')
      .addOption('-keyint_min', '30')
      .addOption('-b:v', '4500k')
      .addOption('-maxrate', '5000k')
      .addOption('-bufsize', '9000k')
      .addOption('-crf', '23')
      .addOption('-pix_fmt', 'yuv420p')
      .addOption('-sc_threshold', '0')
      .addOption('-profile:v', 'main')
      .addOption('-level', '4.0')
      .audioCodec('aac')
      .audioBitrate('128k')
      .audioFrequency(44100)
      .format('flv')
      .output(youtubeUrl);

    ffmpegCommand.on('start', (commandLine) => {
      console.log(`Spawned FFmpeg with command: ${commandLine}`);
    });

    ffmpegCommand.on('stderr', (stderrLine) => {
      console.error(`FFmpeg stderr: ${stderrLine}`);
    });

    ffmpegCommand.on('end', () => {
      console.log('FFmpeg process finished successfully');
    });

    ffmpegCommand.on('error', (err, stdout, stderr) => {
      console.error(`FFmpeg process error: ${err.message}`);
      console.error(`FFmpeg stderr: ${stderr}`);
    });

    ffmpegCommand.run();
  });

  socket.on('with-overlay', (overlayImage) => {
    console.log('withOverlay Event was hit');

    console.log({ overlayImage });

    if (ffmpegCommand) {
      ffmpegCommand.kill('SIGINT');
      passThroughStream.end();
      passThroughStream = new PassThrough();
    }

    ffmpegCommand = ffmpeg()
      .input(passThroughStream)
      .inputFormat('webm') // Ensure the input format for the stream is set
      .input(overlayImage)
      .complexFilter([
        '[1][0]scale2ref=w=iw:h=ih[overlay][video]',
        '[video][overlay]overlay=x=0:y=0',
      ])
      .videoCodec('libx264')
      .addOption('-preset', 'veryfast')
      .addOption('-tune', 'zerolatency')
      .fps(30)
      .addOption('-g', '60')
      .addOption('-keyint_min', '30')
      .addOption('-b:v', '4500k')
      .addOption('-maxrate', '5000k')
      .addOption('-bufsize', '9000k')
      .addOption('-crf', '23')
      .addOption('-pix_fmt', 'yuv420p')
      .addOption('-sc_threshold', '0')
      .addOption('-profile:v', 'main')
      .addOption('-level', '4.0')
      .audioCodec('aac')
      .audioBitrate('128k')
      .audioFrequency(44100)
      .format('flv')
      .output(youtubeUrl);

    ffmpegCommand.on('start', (commandLine) => {
      console.log(`Spawned FFmpeg with command: ${commandLine}`);
    });

    ffmpegCommand.on('stderr', (stderrLine) => {
      console.error(`FFmpeg stderr: ${stderrLine}`);
    });

    ffmpegCommand.on('end', () => {
      console.log('FFmpeg process finished successfully');
    });

    ffmpegCommand.on('error', (err, stdout, stderr) => {
      console.error(`FFmpeg process error: ${err.message}`);
      console.error(`FFmpeg stderr: ${stderr}`);
    });

    ffmpegCommand.run();
  });

  // if (ffmpegCommand) {
  //   ffmpegCommand.on('start', (commandLine) => {
  //     console.log(`Spawned FFmpeg with command: ${commandLine}`);
  //   });

  //   ffmpegCommand.on('stderr', (stderrLine) => {
  //     console.error(`FFmpeg stderr: ${stderrLine}`);
  //   });

  //   ffmpegCommand.on('end', () => {
  //     console.log('FFmpeg process finished successfully');
  //   });

  //   ffmpegCommand.on('error', (err, stdout, stderr) => {
  //     console.error(`FFmpeg process error: ${err.message}`);
  //     console.error(`FFmpeg stderr: ${stderr}`);
  //   });

  //   ffmpegCommand.run();
  // }

  socket.on('binarystream', async (data) => {
    const { stream } = data;
    try {
      passThroughStream.write(stream);
    } catch (err) {
      if (err.code === 'EPIPE') {
        console.log(
          'EPIPE error: FFmpeg process is not writable. Client might have disconnected.'
        );
      } else {
        console.error('Error writing to PassThrough stream:', err);
      }
    }
  });

  socket.conn.on('close', () => {
    console.log(
      'Client disconnected, ending PassThrough stream and FFmpeg process.'
    );
    passThroughStream.end(); // Properly close the PassThrough stream
    if (ffmpegCommand) ffmpegCommand.kill('SIGINT'); // Terminate the FFmpeg process
  });
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT} for REST API requests`);
});
