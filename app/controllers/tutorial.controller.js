const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: tutorials } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, totalPages, currentPage, tutorials };
};

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nama || !req.body.alamat || !req.body.umur) {
    res.status(400).send({
      message: "Data tidak boleh ada yang kosong",
    });
    return;
  }

  // Create a Tutorial
  const tutorial = {
    nama: req.body.nama,
    umur: req.body.umur,
    alamat: req.body.alamat,
    status: req.body.status ? req.body.status : false,
  };

  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Beberapa kesalahan terjadi saat membuat data",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const { page, size, nama } = req.query;
  var condition = nama ? { nama: { [Op.like]: `%${nama}%` } } : null;

  const { limit, offset } = getPagination(page, size);

  Tutorial.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Beberapa kesalahan terjadi saat mengambil data",
      });
    });
};

// mencari single data berdasarkan id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Tutorial.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Tidak dapat menemukan data dengan id = ${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Kesalahan mengambil data dengan id = " + id,
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate request
  if (!req.body.nama || !req.body.alamat || !req.body.umur) {
    res.status(400).send({
      message: "Data tidak boleh ada yang kosong",
    });
    return;
  }

  Tutorial.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "data berhasil diperbarui.",
        });
      } else {
        res.send({
          message: `Tidak dapat memperbarui data dengan id=${id}. Mungkin data tidak ditemukan atau req.body kosong!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Kesalahan memperbarui data dengan id =" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "data berhasil dihapus",
        });
      } else {
        res.send({
          message: `Tidak dapat menghapus data dengan id=${id}. Mungkin data tidak ditemukan!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Tidak dapat menghapus data dengan id = " + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Data berhasil dihapus !` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Beberapa kesalahan terjadi saat menghapus semua data",
      });
    });
};

// Find all status Tutorials
exports.findAllStatus = (req, res) => {
  Tutorial.findAll({ where: { status: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Beberapa kesalahan terjadi saat mengambil data",
      });
    });
};
