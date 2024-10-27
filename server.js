const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ytDlp = require('yt-dlp-exec');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;

  // Obtener la ruta a la carpeta Descargas del usuario
  const downloadsFolder = path.join(os.homedir(), 'Downloads');
  const uniqueId = uuidv4(); // Generar un identificador único para cada archivo
  const outputPath = path.resolve(downloadsFolder, `audio_${uniqueId}.mp3`); // Guardar en Descargas

  const ffmpegPath = 'C:\\Visual Studio Code\\React\\ffmpeg\\ffmpeg-7.1-essentials_build\\bin';

  const ydlOpts = [
    url,
    '--format', 'bestaudio/best',
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '192K',
    '-o', outputPath,
    '--ffmpeg-location', ffmpegPath
  ];

  try {
    await ytDlp(ydlOpts);
    res.download(outputPath, `audio_${uniqueId}.mp3`);
  } catch (error) {
    console.error('Error al descargar el audio:', error);
    res.status(500).send('Error al descargar el audio');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
