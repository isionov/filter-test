import { BaseFilters, Filter,  RecursiveMessage } from "./types.ts";
import {
    isObjectOrArray,
    matchBooleanFilter,
    matchDateFilter,
    matchNumberFilter,
    matchStringFilter,
    unreachable
} from "./utills.ts";


export function recursiveFilterMessages(messages: RecursiveMessage[], filter: Filter): RecursiveMessage[] {
    switch (filter.type) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'date':
            return messages.filter((message) => matchFilter(message, filter));
        case 'or':
            return messages.filter((message) =>
                filter.filters.some((subFilter) => recursiveFilterMessages([message], subFilter).length > 0),
            );
        case 'and':
            return messages.filter((message) =>
                filter.filters.every((subFilter) => recursiveFilterMessages([message], subFilter).length > 0),
            );
        default:
            return unreachable(filter);
    }
}

function matchFilter(message: RecursiveMessage, filter: BaseFilters): boolean {
    if (!(filter.field in message) || isObjectOrArray(message[filter.field])) {

        return Object.keys(message).some(key => {
            const currentValue = message[key];

            if( typeof currentValue !== 'object' || currentValue instanceof Date) {
                return false
            }

            if(Array.isArray(currentValue)) {
                return currentValue.some(value => matchFilter(value, filter))
            }

            matchFilter(currentValue, filter)
        })
    }

    const value = message[filter.field];

    switch (filter.type) {
        case 'string':
            return matchStringFilter(value, filter);
        case 'number':
            return matchNumberFilter(value, filter);
        case 'boolean':
            return matchBooleanFilter(value, filter);
        case 'date':
            return matchDateFilter(value, filter);
        default:
            return unreachable(filter);
    }
}

