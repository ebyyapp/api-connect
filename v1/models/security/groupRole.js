module.exports = (sequelize, Sequelize) => {
  const Index = sequelize.define(
    "groupRole",
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
    Index.belongsToMany(models.functionality, {
      through: "groupFunctionalities",
    });
    Index.belongsToMany(models.user, {
      through: "groupUsers",
    });
  };

  return Index;
};
