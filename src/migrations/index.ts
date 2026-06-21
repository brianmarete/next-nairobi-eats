import * as migration_20260621_200921 from './20260621_200921';

export const migrations = [
  {
    up: migration_20260621_200921.up,
    down: migration_20260621_200921.down,
    name: '20260621_200921'
  },
];
