const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { protect, admin } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const path = require('path');

const router = express.Router();

// ── S3 Client ──
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET || 'shaanoshaukat-uploads';

// ── Multer — memory storage (stream to S3) ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, webp, gif) are allowed'));
    }
  },
});

/**
 * @desc    Upload one or more images to S3
 * @route   POST /api/upload
 * @access  Private/Admin
 */
router.post(
  '/',
  protect,
  admin,
  upload.array('images', 5), // max 5 images per request
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'No files uploaded' });
      }

      const uploaded = [];

      for (const file of req.files) {
        const uniqueName = `products/${crypto.randomUUID()}${path.extname(
          file.originalname
        )}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: uniqueName,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );

        const url = `https://${BUCKET}.s3.${
          process.env.AWS_REGION || 'ap-south-1'
        }.amazonaws.com/${uniqueName}`;

        uploaded.push({ url, key: uniqueName });
      }

      res.status(200).json({ success: true, data: uploaded });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @desc    Delete an image from S3
 * @route   DELETE /api/upload
 * @access  Private/Admin
 * @body    { key: "products/xxx.jpg" }
 */
router.delete('/', protect, admin, async (req, res, next) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res
        .status(400)
        .json({ success: false, message: 'Image key is required' });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
