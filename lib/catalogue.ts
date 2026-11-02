export interface CataloguePage<T> {
  items: T[];
  total: number;
  nextOffset: number | null;
}

export function priceSortValue(price: { value: number } | null | undefined) {
  return price && Number.isFinite(price.value) ? price.value : Infinity;
}

export function pageRequest(limit: number, offset: number, country: string | null) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100 ||
      !Number.isSafeInteger(offset) || offset < 0) {
    throw new Error('Invalid catalogue pagination');
  }
  const code = country?.trim().toLowerCase() || null;
  if (code && !/^[a-z]{2}$/.test(code)) throw new Error('Invalid country code');
  return { limit, offset, country: code };
}

/** Advance by the upstream row count, even when some rows are hidden. */
export async function readVisiblePage<T>(
  read: (limit: number, offset: number) => Promise<{ items: T[]; total: number }>,
  limit: number,
  offset: number,
  visible: (item: T) => boolean,
): Promise<CataloguePage<T>> {
  const items: T[] = [];
  let cursor = offset;
  let total = 0;
  do {
    const page = await read(limit - items.length, cursor);
    if (page.items.length > limit - items.length) throw new Error('Catalogue API ignored the requested page size');
    total = page.total;
    if (page.items.length === 0) {
      if (cursor < total) throw new Error('Catalogue pagination stopped before its reported total');
      break;
    }
    cursor += page.items.length;
    items.push(...page.items.filter(visible));
  } while (items.length < limit && cursor < total);
  return { items, total, nextOffset: cursor < total ? cursor : null };
}

/** Complete small catalogues, including APIs that clamp the requested page size. */
export async function readCompleteCatalogue<T extends { id?: string }>(
  read: (offset: number) => Promise<{ items: T[]; total: number }>,
): Promise<T[]> {
  const items = new Map<string, T>();
  let offset = 0;
  let total: number;
  do {
    const page = await read(offset);
    total = page.total;
    let added = 0;
    for (const item of page.items) {
      if (!item.id) throw new Error('Catalogue item has no ID');
      if (!items.has(item.id)) added++;
      items.set(item.id, item);
    }
    if ((page.items.length === 0 && offset < total) || (page.items.length > 0 && added === 0)) {
      throw new Error('Catalogue pagination made no progress');
    }
    offset += page.items.length;
  } while (offset < total);
  if (items.size !== total) throw new Error('Catalogue changed while its index was being read');
  return [...items.values()];
}

export function sliceCatalogue<T>(items: T[], limit: number, offset: number): CataloguePage<T> {
  const end = Math.min(offset + limit, items.length);
  return { items: items.slice(offset, end), total: items.length, nextOffset: end < items.length ? end : null };
}
