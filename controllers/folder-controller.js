const prisma = require("../db/prismadb");
const path = require("node:path");
const { isAuth } = require("../routes/auth-middleware");
const { randomUUID } = require("crypto");

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

const deletePost = [
  isAuth,
  async (req, res) => {
    const { id } = req.body;

    await prisma.folder.delete({
      where: { id: parseInt(id, 10) },
    });

    res.redirect(path.join("/folders"));
  },
];

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

const calculateShareExpiration = (duration) => {
  const currentDate = new Date();
  const durationInDays = parseInt(duration, 10);

  const millisecondsInADay = 24 * 60 * 60 * 1000;

  const expirationDate = new Date(
    currentDate.getTime() + durationInDays * millisecondsInADay
  );

  return expirationDate;
};

const sharePost = [
  async (req, res, next) => {
    try {
      const { selected_folder_id, duration } = req.body;
      console.log(selected_folder_id, duration);

      await prisma.folder.update({
        where: {
          id: parseInt(selected_folder_id, 10),
        },
        data: {
          shareId: randomUUID(),
          shareExpiration: calculateShareExpiration(duration),
        },
      });

      res.status(200).json({ message: "Folder shared successfully" });
    } catch (error) {
      console.log("Error sharing folder:", error);
      res
        .status(500)
        .json({ error: "An error occurred while sharing the folder." });
    }
  },
];

const shareGet = [
  async (req, res) => {
    const { shareId } = req.params;

    const folder = await prisma.folder.findUnique({
      where: { shareId: shareId },
    });

    const isShareable =
      folder.shareId !== null &&
      folder.shareExpiration !== null &&
      folder.shareExpiration > new Date();

    console.log(isShareable);

    if (isShareable) {
      const files = await prisma.file.findMany({
        where: {
          folderId: folder.id,
        },
      });

      res.render("shared", {
        title: `Shared Folder: ${folder.name}`,
        filePath: `Shared Folder: ${folder.name}`,
        files: files,
      });
    } else {
      // TODO: Redirect to error page...
      res.redirect("/");
    }
  },
];

const shareUrlGet = [
  async (req, res) => {
    const { folderId } = req.params;

    const { shareId, shareExpiration } = await prisma.folder.findUnique({
      where: { id: parseInt(folderId, 10) },
    });

    const isShareable =
      shareId !== null &&
      shareExpiration !== null &&
      shareExpiration > new Date();

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (isShareable) {
      return res.json({ shareUrl: `${baseUrl}/folders/share/${shareId}` });
    } else {
      return res.json({ shareUrl: null });
    }
  },
];

module.exports = {
  homeGet,
  foldersGet,
  createPost,
  deletePost,
  updatePost,
  shareGet,
  sharePost,
  shareUrlGet,
};
