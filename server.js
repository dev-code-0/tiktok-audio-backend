const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ytDlp = require('yt-dlp-exec');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Función para resolver la URL de TikTok si es un enlace acortado
async function resolveTikTokUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return response.url;
  } catch (error) {
    console.error('Error al resolver la URL de TikTok:', error);
    throw new Error('No se pudo resolver la URL de TikTok');
  }
}



app.post('/download', async (req, res) => {
  let { url } = req.body; // Cambiado a 'let' para permitir reasignación


  
  try {
    // Resolver la URL si es un enlace acortado de TikTok
    if (url.includes('vm.tiktok.com')) {
      const response = await axios.get(url);
      url = response.request.res.responseUrl; // Obtener la URL final tras la redirección
    }

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
