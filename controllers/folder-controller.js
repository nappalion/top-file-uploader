const prisma = require("../db/prismadb");
const path = require("node:path");
const { isAuth } = require("../routes/auth-middleware");

const ROOT_PATH_NAME = "Files / ";

const homeGet = [
  isAuth,
  async (req, res) => {
    const folder = await prisma.folder.findFirst({
      where: {
        parentFolderId: null,
        userId: req.user.id,
      },
    });

    const folders = await prisma.folder.findMany({
      where: {
        parentFolderId: folder.id,
      },
    });

    const files = await prisma.file.findMany({
      where: {
        folderId: folder.id,
      },
    });

    res.render("home", {
      title: "Home",
      folderId: folder.id,
      filePath: ROOT_PATH_NAME,
      folders: folders,
      files: files,
      req: req,
    });
  },
];

const foldersGet = [
  isAuth,
  async (req, res) => {
    const fullPath = req.params[0];
    const segments = fullPath.split("/").filter((segment) => segment);
    const currentFolderName = segments[segments.length - 1];

    const { parent_folder_id } = req.query;
    const parentFolderId = parseInt(parent_folder_id, 10);

    const currentFolder = await prisma.folder.findFirst({
      where: {
        parentFolderId,
        name: currentFolderName,
      },
    });

    const folders = await prisma.folder.findMany({
      where: {
        parentFolderId: currentFolder.id,
      },
    });

    const files = await prisma.file.findMany({
      where: {
        folderId: currentFolder.id,
      },
    });

    res.render("home", {
      title: "Files",
      folderId: currentFolder.id,
      filePath: ROOT_PATH_NAME + segments.join(" / "),
      folders: folders,
      files: files,
      req: req,
    });
  },
];

const deletePost = [];

const createPost = [
  isAuth,
  async (req, res) => {
    const { name, parent_folder_id } = req.body;
    const parentFolderIdInt = parseInt(parent_folder_id, 10);
    const { id } = req.user;

    await prisma.folder.create({
      data: { name, parentFolderId: parentFolderIdInt, userId: id },
    });
    res.redirect(path.join("/folders"));
  },
];

const updatePost = [
  isAuth,
  async (req, res) => {
    const { id, name } = req.body;

    await prisma.folder.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: name,
      },
    });

    res.redirect(path.join("/folders"));
  },
];

module.exports = { homeGet, foldersGet, createPost, deletePost, updatePost };
