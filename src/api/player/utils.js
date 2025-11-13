import db from '../../db';
import models from '../../db/model';

const { Player, PlayerSkill } = models;

export const getDatabase = () => ({ db, models, Player, PlayerSkill });

export const normalizeString = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

export const normalizeLower = (value) => normalizeString(value).toLowerCase();

export const validatePlayerPayload = (payload) => {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { errors: ['Invalid payload'] };
  }

  const name = normalizeString(payload.name);
  if (!name) {
    errors.push('Player name is required');
  }

  const position = normalizeString(payload.position);
  if (!position) {
    errors.push('Player position is required');
  }

  if (!Array.isArray(payload.playerSkills) || payload.playerSkills.length === 0) {
    errors.push('At least one player skill is required');
  }

  const usedSkills = new Set();
  const sanitizedSkills = [];

  if (Array.isArray(payload.playerSkills)) {
    payload.playerSkills.forEach((skill, index) => {
      const skillName = normalizeString(skill && skill.skill);
      const normalizedSkillKey = normalizeLower(skill && skill.skill);

      if (!skill || typeof skill !== 'object') {
        errors.push(`Skill at index ${index} is invalid`);
        return;
      }

      if (!skillName) {
        errors.push(`Skill name at index ${index} is required`);
        return;
      }

      if (usedSkills.has(normalizedSkillKey)) {
        errors.push(`Duplicated skill "${skillName}"`);
        return;
      }

      usedSkills.add(normalizedSkillKey);

      const value = Number(skill.value);
      if (!Number.isInteger(value)) {
        errors.push(`Skill value for "${skillName}" must be an integer`);
        return;
      }

      if (value < 0 || value > 100) {
        errors.push(`Skill value for "${skillName}" must be between 0 and 100`);
        return;
      }

      sanitizedSkills.push({
        skill: skillName,
        value
      });
    });
  }

  if (errors.length) {
    return { errors };
  }

  return {
    data: {
      name,
      position,
      playerSkills: sanitizedSkills
    }
  };
};

export const formatPlayer = (playerInstance) => {
  if (!playerInstance) {
    return null;
  }

  const plain = typeof playerInstance.toJSON === 'function'
    ? playerInstance.toJSON()
    : playerInstance;

  const skills = Array.isArray(plain.playerSkills)
    ? plain.playerSkills
        .map((skill) => ({
          id: skill.id,
          skill: skill.skill,
          value: skill.value
        }))
        .sort((a, b) => a.skill.localeCompare(b.skill))
    : [];

  return {
    id: plain.id,
    name: plain.name,
    position: plain.position,
    playerSkills: skills
  };
};

export const fetchPlayersWithSkills = async () => {
  return Player.findAll({
    include: [
      {
        model: PlayerSkill,
        as: 'playerSkills'
      }
    ],
    order: [
      ['id', 'ASC'],
      [{ model: PlayerSkill, as: 'playerSkills' }, 'id', 'ASC']
    ]
  });
};

export default {
  getDatabase,
  normalizeLower,
  normalizeString,
  validatePlayerPayload,
  formatPlayer,
  fetchPlayersWithSkills
};
