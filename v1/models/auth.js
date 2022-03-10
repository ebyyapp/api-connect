module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "auth",
    {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "api",
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      macAdress: {
        type: Sequelize.STRING,
      },
      ipAdress: {
        type: Sequelize.STRING,
      },
      authToken: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      refrechToken: {
        type: Sequelize.TEXT,
      },
      authStatus: {
        type: Sequelize.STRING,
        defaultValue: "inProgress",
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsTo(models.user);
    Index.belongsTo(models.app);
  };

  return Index;
};
