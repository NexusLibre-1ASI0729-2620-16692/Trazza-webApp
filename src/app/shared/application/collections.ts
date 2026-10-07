import {BaseEntity} from '../domain/model/base-entity';

export const upsertById = <T extends BaseEntity>(collection: T[], entity: T): T[] =>
  collection.some(item => item.id === entity.id)
    ? collection.map(item => item.id === entity.id ? entity : item)
    : [...collection, entity];

export const replaceManyById = <T extends BaseEntity>(collection: T[], entities: T[]): T[] =>
  entities.reduce((result, entity) => upsertById(result, entity), collection);

export const byNewest = <T>(selector: (item: T) => string | null | undefined) =>
  (a: T, b: T): number => (selector(b) ?? '').localeCompare(selector(a) ?? '');
