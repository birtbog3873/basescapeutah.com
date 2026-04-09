import * as migration_20260326_161312 from './20260326_161312';
import * as migration_20260404_120000 from './20260404_120000';

export const migrations = [
  {
    up: migration_20260326_161312.up,
    down: migration_20260326_161312.down,
    name: '20260326_161312'
  },
  {
    up: migration_20260404_120000.up,
    down: migration_20260404_120000.down,
    name: '20260404_120000'
  },
];
