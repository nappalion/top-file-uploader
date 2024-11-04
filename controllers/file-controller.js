const cloudinary = require("../db/cloudinary");
const { isAuth } = require("../routes/auth-middleware");
const prisma = require("../db/prismadb");
const path = require("node:path");

const downloadGet = [
  isAuth,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });

    res.download(file.url, (err) => {
      if (err) {
        res.status(404).send(err);
      }
    });
  },
];

const deletePost = [];

const createPost = [
  isAuth,
  async (req, res) => {
    const { name } = req.body;
    const { filename, size } = req.file;
    const filePath = path.join(__dirname, "uploads", filename);

    const folderId = parseInt(req.body.folderId, 10);

    await prisma.file.create({
      data: {
        name,
        folderId,
        url: filePath,
        size,
      },
    });

    // const uploadResult = await cloudinary.uploader
    //   .upload(
    //     "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
    //     {
    //       public_id: "shoes",
    //     }
    //   )
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // console.log(uploadResult);
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
