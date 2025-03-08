import express from 'express';
import { searchMovies, getMovieDetails } from '../utils/omdb.js';
import { searchTelegramFiles, downloadTelegramFile } from '../utils/telegram.js';

const router = express.Router();

const validateFileId = (req, res, next) => {
  if (!/^\d+_\d+$/.test(req.params.fileId)) {
    return res.status(400).json({ error: 'Invalid file ID' });
  }
  next();
};

router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    const movies = await searchMovies(query);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/movie/:id', async (req, res) => {
  try {
    const details = await getMovieDetails(req.params.id);
    const files = await searchTelegramFiles(details.Title);
    res.json({ ...details, files });
  } catch (error) {
    res.status(500).json({ error: 'Movie load failed' });
  }
});

router.get('/download/:fileId', validateFileId, async (req, res) => {
  try {
    const file = await downloadTelegramFile(req.params.fileId);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    file.stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Download failed' });
  }
});

export default router;
