// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import {
  fetchPlayersWithSkills,
  formatPlayer,
  normalizeLower,
  normalizeString
} from '../player/utils';

const validateRequestBody = (payload) => {
  if (!Array.isArray(payload) || payload.length === 0) {
    return { errors: ['Request body must be a non-empty array'] };
  }

  const errors = [];
  const sanitized = [];

  payload.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push(`Invalid entry at index ${index}`);
      return;
    }

    const position = normalizeString(item.position);
    const mainSkill = normalizeString(item.mainSkill);
    const numberOfPlayers = Number(item.numberOfPlayers);

    if (!position) {
      errors.push(`Position is required for entry at index ${index}`);
    }

    if (!mainSkill) {
      errors.push(`Main skill is required for entry at index ${index}`);
    }

    if (!Number.isInteger(numberOfPlayers) || numberOfPlayers <= 0) {
      errors.push(`Number of players must be a positive integer for entry at index ${index}`);
    }

    sanitized.push({
      index,
      position,
      mainSkill,
      normalizedPosition: normalizeLower(position),
      normalizedMainSkill: normalizeLower(mainSkill),
      numberOfPlayers
    });
  });

  if (errors.length) {
    return { errors };
  }

  return { data: sanitized };
};

const enhancePlayers = (players) => {
  return players.map((player) => {
    const formatted = formatPlayer(player);
    const skillsMap = new Map();
    let total = 0;

    if (formatted.playerSkills) {
      formatted.playerSkills.forEach((skill) => {
        skillsMap.set(normalizeLower(skill.skill), skill.value);
        total += Number(skill.value) || 0;
      });
    }

    const skillsCount = formatted.playerSkills ? formatted.playerSkills.length : 0;
    const averageSkill = skillsCount > 0 ? total / skillsCount : 0;

    return {
      ...formatted,
      skillsMap,
      averageSkill
    };
  });
};

const sortCandidates = (candidates, mainSkillKey) => {
  return candidates.sort((a, b) => {
    const aMain = a.skillsMap.get(mainSkillKey) ?? 0;
    const bMain = b.skillsMap.get(mainSkillKey) ?? 0;

    if (bMain !== aMain) {
      return bMain - aMain;
    }

    if (b.averageSkill !== a.averageSkill) {
      return b.averageSkill - a.averageSkill;
    }

    return a.name.localeCompare(b.name);
  });
};

export default async (req, res) => {
  const { data, errors } = validateRequestBody(req.body);

  if (errors) {
    return res.status(400).json({ errors });
  }

  try {
    const players = await fetchPlayersWithSkills();
    const availablePlayers = enhancePlayers(players);
    const selectedPlayerIds = new Set();

    const result = [];

    for (const requirement of data) {
      const candidates = availablePlayers.filter((player) =>
        normalizeLower(player.position) === requirement.normalizedPosition
        && !selectedPlayerIds.has(player.id)
      );

      if (candidates.length === 0) {
        return res.status(400).json({
          error: `No players available for position ${requirement.position}`
        });
      }

      const sortedCandidates = sortCandidates(candidates, requirement.normalizedMainSkill);
      const chosenPlayers = sortedCandidates.slice(0, requirement.numberOfPlayers);

      if (chosenPlayers.length < requirement.numberOfPlayers) {
        return res.status(400).json({
          error: `Not enough players for position ${requirement.position}`
        });
      }

      chosenPlayers.forEach((player) => selectedPlayerIds.add(player.id));

      result.push({
        position: requirement.position,
        mainSkill: requirement.mainSkill,
        numberOfPlayers: requirement.numberOfPlayers,
        players: chosenPlayers.map((player) => ({
          id: player.id,
          name: player.name,
          position: player.position,
          playerSkills: player.playerSkills.map((skill) => ({
            id: skill.id,
            skill: skill.skill,
            value: skill.value
          }))
        }))
      });
    }

    return res.json(result);
  } catch (error) {
    console.error('Failed to process team', error);
    return res.status(500).json({ error: 'Failed to process team' });
  }
};
