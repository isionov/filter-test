import {BaseFilters, Filter, Message } from "./types.ts";
import {matchBooleanFilter, matchDateFilter, matchNumberFilter, matchStringFilter, unreachable} from "./utills.ts";

export function filterMessages(messages: Message[], filter: Filter): Message[] {
    switch (filter.type) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'date':
            return messages.filter((message) => matchFilter(message, filter));
        case 'or':
            return messages.filter((message) =>
                filter.filters.some((subFilter) => filterMessages([message], subFilter).length > 0),
            );
        case 'and':
            return messages.filter((message) =>
                filter.filters.every((subFilter) => filterMessages([message], subFilter).length > 0),
            );
        default:
            return unreachable(filter);
    }
}

function matchFilter(message: Message, filter: BaseFilters): boolean {
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
