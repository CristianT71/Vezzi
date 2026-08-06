export type MockRepository = {
  find: jest.Mock;
  findOne: jest.Mock;
  findOneBy: jest.Mock;
  findAndCount: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  update: jest.Mock;
  preload: jest.Mock;
  softDelete: jest.Mock;
  restore: jest.Mock;
  count: jest.Mock;
  createQueryBuilder: jest.Mock;
};

export function createMockRepository(): MockRepository {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn((entity) => entity),
    save: jest.fn(async (entity) => entity),
    update: jest.fn(),
    preload: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
}
