// /////////////////////////////////////////////////////////////////////////////
// TESTING AREA
// THIS IS AN AREA WHERE YOU CAN TEST YOUR WORK AND WRITE YOUR OWN TESTS
// /////////////////////////////////////////////////////////////////////////////

import request from 'supertest';
import '@babel/polyfill';
import api from '../src/api';
import db from '../src/db'
import models from '../src/db/model'

describe('delete player api', () => {
  beforeEach(async () => {
    await db.sync();
  });

  afterEach(async () => {
    await models.Player.destroy({
      where: {},
      truncate: true,
      restartIdentity: true
    });

    await models.PlayerSkill.destroy({
      where: {},
      truncate: true,
      restartIdentity: true
    });

    await db.query('DELETE FROM `sqlite_sequence` WHERE `name` = "players"');
    await db.query('DELETE FROM `sqlite_sequence` WHERE `name` = "playerSkills"');
  });

  it('test sample', async () => {
    const response = await request(api)
      .delete('/api/player/1')
      .send();

    expect(response).not.toBeNull();
  });
});