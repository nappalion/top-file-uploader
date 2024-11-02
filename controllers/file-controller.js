const cloudinary = require("../db/cloudinary");
const { isAuth } = require("../routes/auth-middleware");

const filesGet = [];

const deletePost = [];

const createPost = [
  isAuth,
  async (req, res) => {
    const { file_upload } = req.body;

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
  },
];

module.exports = { filesGet, createPost, deletePost };
