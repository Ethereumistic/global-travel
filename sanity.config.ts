import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import airline from './sanity/schemas/airline'
import flight from './sanity/schemas/flights'
export default defineConfig({
    name: 'default',
    title: 'Global Travel Admin Panel',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    basePath: '/studio', // This is important!
    plugins: [structureTool()],
    schema: {
        types: [airline, flight],
    },
})