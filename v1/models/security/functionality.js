module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "functionality",
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
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "activated",
      },
    },
    {
      underscored: false,
    }
  );
  Index.associate = (models) => {
    Index.belongsToMany(models.groupRole, {
      through: "groupFunctionalities",
    });
  };

  return Index;
};
