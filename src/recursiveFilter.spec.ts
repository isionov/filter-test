import { expect, describe, it } from 'vitest'
import { recursiveFilterMessages } from './recursivefilter.ts'
import { RecursiveMessage } from "./types.ts";


const boolTrue = {
    boolean: true,
};

const boolFalse = {
    boolean: false,
};

const stringEqual = {
    string: 'string',
};

const stringStartsWith = {
    string: '$StartsWith',
};

const stringEndsWith = {
    string: 'EndsWith$',
};

const stringContains = {
    string: 'string contains $$ double dollar symbol',
};

const numberEqual = {
    number: 12
};

const dateMessage = {date: new Date().toISOString()}

const complexMessage = {
    field1: 122,
    field2: new Date('2024-01-01T12:00:00.000Z').toISOString(),
}

const complexMessage2 = {
    field1: 123,
    field2: new Date('2024-01-01T12:00:00.000Z').toISOString(),
}

const complexMessage3 = {
    field1: 124,
    field2: new Date('2024-01-01T12:00:00.000Z').toISOString(),
}

const complexMessage4 = {
    field1: [complexMessage3],
}

const messages: RecursiveMessage[] = [
    boolTrue,
    boolFalse,
    stringEqual,
    stringStartsWith,
    stringEndsWith,
    stringContains,
    numberEqual,
    dateMessage,
    complexMessage,
    complexMessage2,
    complexMessage3,
    complexMessage4
];

describe('recursiveFilterMessages', () => {
    it('works on Boolean filter', () => {
        expect(
            recursiveFilterMessages(messages, {field: 'boolean', type: 'boolean', operation: 'eq', value: true}),
        ).toEqual([boolTrue]);

        expect(
            recursiveFilterMessages(messages, {field: 'boolean', type: 'boolean', operation: 'eq', value: false}),
        ).toEqual([boolFalse]);
    });

    it('String filter', () => {
        expect(
            recursiveFilterMessages(messages, {field: 'string', type: 'string', operation: 'eq', value: 'string'}),
        ).toEqual([stringEqual]);

        expect(
            recursiveFilterMessages(messages, {field: 'string', type: 'string', operation: 'startsWith', value: '$Star'}),
        ).toEqual([stringStartsWith]);

        expect(
            recursiveFilterMessages(messages, {field: 'string', type: 'string', operation: 'endsWith', value: 'th$'}),
        ).toEqual([stringEndsWith]);

        expect(
            recursiveFilterMessages(messages, {field: 'string', type: 'string', operation: 'contains', value: '$$'}),
        ).toEqual([stringContains]);
    });

    it('Number filter', () => {
        expect(
            recursiveFilterMessages(messages, {field: 'number', type: 'number', operation: 'eq', value: 12}),
        ).toEqual([numberEqual]);
    });

    it('Date filter', () => {
        expect(
            recursiveFilterMessages(messages, {field: 'date', type: 'date', operation: 'eq', value: dateMessage.date}),
        ).toEqual([dateMessage]);
    });

    it('works on OR filter', () => {
        expect(
            recursiveFilterMessages(messages, {
                type: 'or',
                filters: [
                    {field: 'string', type: 'string', operation: 'startsWith', value: '$'},
                    {field: 'string', type: 'string', operation: 'endsWith', value: '$'},
                ],
            }),
        ).toEqual([stringStartsWith, stringEndsWith]);
    });

    it('works on AND filter', () => {
        expect(
            recursiveFilterMessages(messages, {
                type: 'and',
                filters: [
                    {field: 'string', type: 'string', operation: 'startsWith', value: '$'},
                    {field: 'string', type: 'string', operation: 'contains', value: 'With'},
                ],
            }),
        ).toEqual([stringStartsWith]);
    });

    it('works on complex filter', () => {
        expect(
            recursiveFilterMessages(messages, {
                type: 'and',
                filters: [
                    {
                        type: 'or',
                        filters: [
                            {field: 'field1', type: 'number', operation: 'lt', value: 123},
                            {field: 'field1', type: 'number', operation: 'gt', value: 123},
                        ],
                    },
                    {field: 'field2', type: 'date', operation: 'after', value: new Date('2023')},
                ],
            }),
        ).toEqual([complexMessage, complexMessage3, complexMessage4]);
    });

    it('works on complex filter and message', () => {
        expect(
            recursiveFilterMessages(messages,
                    {
                        type: 'or',
                        filters: [
                            {field: 'field1', type: 'number', operation: 'gt', value: 123},
                        ],
                    },
            ),
        ).toEqual([complexMessage3, complexMessage4]);
    });
});
