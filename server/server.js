import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import http from 'http';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';
import {
  fileTypeFromBlob,
  fileTypeFromBuffer,
  fileTypeFromStream,
} from 'file-type';

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
  console.log(`Socket connected to ${socket.id}`);
  const youtubeUrl = socket.handshake.query.youtubeUrl;

  console.log('sending stream to : ', youtubeUrl);

  const passThroughStream = new PassThrough();

  const ffmpegCommand = ffmpeg(passThroughStream)
    .inputFormat('webm') // Specify the input format if known
    .videoCodec('libx264')
    .addOption('-preset', 'ultrafast')
    .addOption('-tune', 'zerolatency')
    .fps(25)
    .addOption('-g', (25 * 2).toString())
    .addOption('-keyint_min', '25')
    .addOption('-crf', '25')
    .addOption('-pix_fmt', 'yuv420p')
    .addOption('-sc_threshold', '0')
    .addOption('-profile:v', 'main')
    .addOption('-level', '3.1')
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

  socket.on('binarystream', async (data) => {
    const { stream ,overlay} = data;

    console.log("Overlay : ", overlay);
    
    try {
      const type_ = await fileTypeFromBuffer(stream);
      // console.log({type_});

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
    ffmpegCommand.kill('SIGINT'); // Terminate the FFmpeg process
  });
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT} for REST API requests`);
});
