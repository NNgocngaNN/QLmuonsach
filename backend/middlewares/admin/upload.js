const { error } = require('console');
const multer = require('multer')
const path = require('path')

//Dinh nghia noi luu tru va ten tep
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../uploads/'))
  },
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname}`
    callback(null, filename)
  }
});

//Kieu tra loai tep co the tai len
const filerFilter = (req, file, callback) => {
    const allowedMimes = ['image/jpg', 'image/png']
    if (allowedMimes.includes(file.mimetype)) {
        callback(null, true)
    }else {
        callback(new Error('Loai tep khong hop le, chi JPG va PNG la duoc cho phep tai len'), false)
    }
}

//Gioi han kich thuoc file tai len
const limits = {
    fileSize: 1024 * 1024 * 5
}

//Khoi tao multer voi cau hinh storage
const upload = multer ({
    storage: storage,
    fileFilter: filerFilter,
    limits: limits
})

module.exports = upload