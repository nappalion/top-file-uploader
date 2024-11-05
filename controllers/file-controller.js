const cloudinary = require("../db/cloudinary");
const { isAuth } = require("../routes/auth-middleware");
const prisma = require("../db/prismadb");
const path = require("node:path");
const axios = require("axios");
const os = require("os");

async function downloadImage(url, name, format) {
  const downloadsPath = path.resolve(
    os.homedir(),
    "Downloads",
    `${name}.${format}`
  );

  const response = await axios({
    url: url,
    method: "GET",
    responseType: "stream",
  });

  return response.data;
}

const downloadGet = [
  async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.name}.${file.format}"`
    );
    res.setHeader("Content-Type", file.format);

    const fileStream = await downloadImage(file.url, file.name, file.format);

    fileStream.pipe(res);
  },
];

const deletePost = [
  isAuth,
  async (req, res) => {
    const { id } = req.body;

    await prisma.file.delete({
      where: { id: parseInt(id, 10) },
    });

    res.redirect(path.join("/folders"));
  },
];

const createPost = [
  isAuth,
  async (req, res) => {
    const { name } = req.body;
    const { buffer } = req.file;

    const folderId = parseInt(req.body.folderId, 10);

    console.log(req.file);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream((error, result) => {
          if (error) {
            return reject(error);
          }

          return resolve(result);
        })
        .end(buffer);
    });

    await prisma.file.create({
      data: {
        name,
        folderId,
        url: uploadResult.secure_url,
        size: uploadResult.bytes,
        format: uploadResult.format,
      },
    });

    res.redirect("/folders");
  },
];

const updatePost = [
  isAuth,
  async (req, res) => {
    const { name, id } = req.body;

    await prisma.file.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: name,
      },
    });

    res.redirect(path.join("/folders"));
  },
];

module.exports = { createPost, deletePost, downloadGet, updatePost };
