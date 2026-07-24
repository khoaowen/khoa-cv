import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Single source of truth for the CV. One YAML file per language lives in
 * src/content/cv/ (en.yaml, fr.yaml). This Zod schema validates them at build
 * time, so a malformed edit fails CI instead of shipping broken content.
 *
 * Privacy: there is intentionally NO phone field anywhere. Public contact is the
 * LinkedIn link. The optional `private` block (email/address) is rendered ONLY
 * in the print/PDF layout, never on the public web page.
 */

const dateString = z
  .string()
  .describe('Free-form date, e.g. "2023-06", "Jun 2023", or "2021".');

const cv = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/cv' }),
  schema: z.object({
    lang: z.enum(['en', 'fr']),
    basics: z.object({
      name: z.string(),
      role: z.string(),
      location: z.string().optional(),
      summary: z.string(),
      links: z.object({
        linkedin: z.string().url(),
        website: z.string().url().optional(),
        github: z.string().url().optional(),
      }),
      // Rendered only in the PDF/print layout — never on the public page.
      private: z
        .object({
          email: z.string().email().optional(),
          address: z.string().optional(),
        })
        .optional(),
    }),
    work: z
      .array(
        z.object({
          company: z.string(),
          position: z.string(),
          location: z.string().optional(),
          start: dateString,
          end: dateString.optional(), // omit or leave empty => "Present"
          // Web-only employer/product context, deliberately separate from the
          // candidate's contribution to mirror the LinkedIn profile structure.
          introduction: z.string().optional(),
          summary: z.string().optional(),
          team: z.string().optional(),
          highlights: z.array(z.string()).default([]),
          impacts: z.array(z.string()).default([]),
          tech: z.array(z.string()).default([]),
          // When true, the PDF renders this role as a compact one-line entry
          // under "Earlier experience" (keeps the PDF to ~2 pages). The web
          // page always shows the full entry regardless of this flag.
          condensed: z.boolean().default(false),
          // Excludes a role from the generated PDF while keeping it available
          // on the web CV.
          excludeFromPrint: z.boolean().default(false),
        }),
      )
      .default([]),
    education: z
      .array(
        z.object({
          institution: z.string(),
          area: z.string().optional(),
          studyType: z.string().optional(),
          start: dateString.optional(),
          end: dateString.optional(),
          note: z.string().optional(),
        }),
      )
      .default([]),
    skills: z
      .array(
        z.object({
          category: z.string(),
          items: z.array(z.string()),
        }),
      )
      .default([]),
    softSkills: z.array(z.string()).default([]),
    projects: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          url: z.string().url().optional(),
          tech: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    languages: z
      .array(
        z.object({
          language: z.string(),
          fluency: z.string().optional(),
        }),
      )
      .default([]),
    certifications: z
      .array(
        z.object({
          name: z.string(),
          issuer: z.string().optional(),
          date: dateString.optional(),
        }),
      )
      .default([]),
    sideProjects: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          tech: z.array(z.string()).default([]),
        }),
      )
      .default([]),
  }),
});

export const collections = { cv };
