// /////////////////////////////////////////////////////////////////////////////
// IMPORTANT:
// THE CODE BELOW IS READ ONLY CODE AND YOU SHOULD INSPECT IT TO SEE WHAT IT
// DOES IN ORDER TO COMPLETE THE TASK, BUT DO NOT MODIFY IT IN ANY WAY AS THAT
// WILL RESULT IN A TEST FAILURE
// /////////////////////////////////////////////////////////////////////////////

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  }
);

export default sequelize;
