const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

/* Processo de upload */
const multerOptions = {
  storage: multer.memoryStorage(),
  FileFilter: (req, file, next) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
      next(null, true);
    } else {
      next({ message: 'Arquivo não suportado' }, false);
    }
  }

};
exports.upload = multer(multerOptions).single('photo');


/* Processo de Resize */

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  const ext = req.file.mimetype.split('/')[1];
  let filename = `${uuid.v4()}.${ext}`;
  req.body.photo = filename;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/media/${filename}`);
  next(); // manda para o controller
};
