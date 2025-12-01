import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'airline',
    title: 'Airline Company',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Company Name',
            type: 'string', // e.g. "Wizz Air"
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'color',
            title: 'Brand Color (Hex)',
            type: 'string',
            description: 'e.g. #1346e7',
            initialValue: '#000000',
            validation: (rule) => rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
                name: 'hex', // Validates it is a real hex color
                invert: false,
            }),
        }),
    ],
})