// /////////////////////////////////////////////////////////////////////////////
// IMPORTANT:
// THE CODE BELOW IS READ ONLY CODE AND YOU SHOULD INSPECT IT TO SEE WHAT IT
// DOES IN ORDER TO COMPLETE THE TASK, BUT DO NOT MODIFY IT IN ANY WAY AS THAT
// WILL RESULT IN A TEST FAILURE
// /////////////////////////////////////////////////////////////////////////////


import Player from './player';
import PlayerSkill from './playerSkill';

const database = {
  Player,
  PlayerSkill
};

Object.keys(database).forEach(function (modelName) {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
});

export default database;