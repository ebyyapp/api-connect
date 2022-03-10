module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "app",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      redirectUrl: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secretKey: {
        type: Sequelize.STRING,
        allowNull: false,
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
    Index.hasMany(models.auth);
  };

  return Index;
};
