import {BooleanFilter, DateFilter, NumberFilter, StringFilter} from "./types.ts";

// @ts-ignore-next-line
export const unreachable = (arg: never): any => {};


export function matchStringFilter(value: unknown, filter: StringFilter): boolean {
    if (typeof value !== 'string') return false;

    switch (filter.operation) {
        case 'eq':
            return value === filter.value;
        case 'startsWith':
            return value.startsWith(filter.value);
        case 'endsWith':
            return value.endsWith(filter.value);
        case 'contains':
            return value.includes(filter.value);
        default:
            return unreachable(filter.operation);
    }
}

export function matchNumberFilter(value: unknown, filter: NumberFilter): boolean {
    if (typeof value !== 'number') return false;

    switch (filter.operation) {
        case 'eq':
            return value === filter.value;
        case 'gt':
            return value > filter.value;
        case 'lt':
            return value < filter.value;
        case 'gte':
            return value >= filter.value;
        case 'lte':
            return value <= filter.value;
        default:
            return unreachable(filter.operation);
    }
}

export function matchBooleanFilter(value: unknown, filter: BooleanFilter): boolean {
    return typeof value === 'boolean' && value === filter.value;
}

export function isValidDate(date: Date) {
    return !isNaN(date.getTime());
}

export function matchDateFilter(value: unknown, filter: DateFilter): boolean {
    if (!(value instanceof Date) && typeof value !== 'string') {
        return false;
    }

    const date = new Date(value);
    const filterValue = new Date(filter.value);

    if (!isValidDate(date)) {
        return false;
    }

    if (!isValidDate(filterValue)) {
        console.error('Invalid filter');
        return false;
    }

    switch (filter.operation) {
        case 'eq':
            return date.getTime() === filterValue.getTime();
        case 'after':
            return date.getTime() > filterValue.getTime();
        case 'before':
            return date.getTime() < filterValue.getTime();
        default:
            return unreachable(filter.operation);
    }
}


export const isObjectOrArray = (item: unknown) => {
    if(item instanceof Date) {
        return false;
    }

    if (item && (Array.isArray(item) || typeof item === 'object' )) {
        return true
    }

    return false
}
