module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    nama: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Nama tidak boleh kosong",
        },
      },
    },
    umur: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Umur tidak boleh kosong",
        },
        isInt: {
          msg: "Umur harus berupa angka",
        },
        customValidator(value) {
          if (value <= 17) {
            throw new Error("Umur anda tidak mencukupi untuk mengakses halaman ini");
          }
        },
      },
    },
    alamat: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Alamat tidak boleh kosong",
        },
      },
    },
    status: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Tutorial;
};
