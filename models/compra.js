'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Compra.belongsTo(models.Cliente, {foreignKey: 'ClienteId', as: 'clientes'});
      Compra.belongsToMany(models.Produto,{
        foreignKey: 'ProdutoId',
        through: 'ItemCompra', as: 'produtos_comp'
      });
      Compra.hasMany(models.ItemCompra, {foreignKey: 'CompraId', as: 'itemcompra'});
    }
  };
  Compra.init({
    data: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Compra',
  });
  return Compra;
};