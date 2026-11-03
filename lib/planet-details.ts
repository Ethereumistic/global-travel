import 'server-only';
import { cache } from 'react';
import { readPlanetDetail } from './planet-detail-request';
import type { Hotel } from './types-hotel';
import type { Holiday } from './types-holiday';
import type { Yacht } from './types-yacht';

export const getHotelById = cache((id: string) => readPlanetDetail<Hotel>('hotels', id));
export const getHolidayById = cache((id: string) => readPlanetDetail<Holiday>('holidays', id));
export const getYachtById = cache((id: string) => readPlanetDetail<Yacht>('yachts', id));
