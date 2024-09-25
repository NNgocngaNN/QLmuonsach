const Employee = require("../../models/employee.model");
const Reader = require("../../models/reader.model");

const getInfor = async (req, res) => {
  try {
    const token = req.cookies.token;
    const employee = await Employee.findOne({token: token});

    if (!employee) {
      return res.status(404).json({ message: "Khong tim thay nhan vien" });
    }
    
    res
      .status(200)
      .json({ message: "Lay thong tin nhan vien thanh cong", employee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReaders = async (req, res) => {
  try {
    const readers  = await Reader.find({});
    res.status(200).json(readers)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const statusBook = async (req, res) => {
  try {
    const {readerId, bookId} = req.params
    const {status} = req.body

    const reader = await Reader.findById(readerId)
    if (!reader) {
      res.status(404).json({ message: "Nguoi doc khong ton tai." })
      return
    }

    const bookIndex = reader.borrow.findIndex(book => book.id_book === bookId)

    if (bookIndex === -1) {
      res.status(404).json({ message: "Sach khong ton tai." });
      return;
    }
    console.log("bookIndex", bookIndex);
    reader.borrow[bookIndex].status = status;
    await reader.save();
    res.status(200).json({ message: "Trang thai duoc cap nhat thanh cong." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getInfor,
  getReaders,
  statusBook
};
