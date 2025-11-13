// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import { getDatabase, validatePlayerPayload, formatPlayer } from './utils';

const { db, Player, PlayerSkill } = getDatabase();

export default async (req, res) => {
  res.sendStatus(500);
}
  const { data, errors } = validatePlayerPayload(req.body);

  if (errors) {
    return res.status(400).json({ errors });
  }

  const transaction = await db.transaction();

  try {
    const player = await Player.create(
      {
        name: data.name,
        position: data.position,
        playerSkills: data.playerSkills
      },
      {
        include: [
          {
            model: PlayerSkill,
            as: 'playerSkills'
          }
        ],
        transaction
      }
    );

    await transaction.commit();

    const createdPlayer = await Player.findByPk(player.id, {
      include: [
        {
          model: PlayerSkill,
          as: 'playerSkills'
        }
      ]
    });

    return res.status(201).json(formatPlayer(createdPlayer));
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to create player', error);
    return res.status(500).json({ error: 'Failed to create player' });
  }
};
