module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "user",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
      },
      civility: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      team: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      cgv: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      newsletters: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "waiting",
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.hasMany(models.shop);
    Index.hasMany(models.auth);
    Index.hasMany(models.oAuth);
    Index.belongsToMany(models.groupRole, {
      through: "groupUsers",
    });
  };

  return Index;
};
