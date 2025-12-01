import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'flight',
    title: 'Flight Offer',
    type: 'document',
    fields: [
        defineField({
            name: 'toCity',
            title: 'To City',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: (doc) => {
                    const from = doc.fromCity ? `${doc.fromCity}-` : '';
                    const to = doc.toCity ? `to-${doc.toCity}` : '';
                    return `${from}${to}`;
                },
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'toCountry',
            title: 'To Country',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'fromCity',
            title: 'From City (Optional)',
            type: 'string',
        }),
        defineField({
            name: 'fromCountry',
            title: 'From Country (Optional)',
            type: 'string',
        }),
        defineField({
            name: 'price',
            title: 'Price (EUR)',
            type: 'number',
        }),
        defineField({
            name: 'thumbnail',
            title: 'Thumbnail Image',
            type: 'image',
            options: { hotspot: true },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'airlines',
            title: 'Airlines',
            type: 'array',
            of: [{ type: 'reference', to: { type: 'airline' } }],
            description: 'Select one or more airlines for this flight',
        }),
    ],
})