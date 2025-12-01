"use client"

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config' // Adjust path to root sanity.config.ts

export const dynamic = 'force-static'

export default function StudioPage() {
    return <NextStudio config={config} />
}