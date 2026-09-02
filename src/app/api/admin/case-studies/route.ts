import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client";
import { requireAuth } from "@/lib/sanity/auth";
import { slugify } from "@/lib/sanity/validate";
import { readCaseStudyInput, validateCaseStudyForPublish } from "./shared";

export const GET = requireAuth(async () => {
  const client = sanityWriteClient();
  const caseStudies = await client.fetch(
    `*[_type == "caseStudy"] | order(sortOrder asc, _createdAt asc)`
  );
  return NextResponse.json({ caseStudies });
});

export const POST = requireAuth(async (req: NextRequest) => {
  const client = sanityWriteClient();
  const body = await req.json().catch(() => ({}));

  const fields = readCaseStudyInput(body);
  const name = typeof fields.name === "string" ? fields.name : "";
  let slug =
    (fields.slug as { current?: string } | undefined)?.current || slugify(name);
  if (slug) {
    let candidate = slug;
    let n = 2;
    while (await client.fetch(`*[_type == "caseStudy" && slug.current == $s][0]{_id}`, { s: candidate })) {
      candidate = `${slug}-${n}`;
      n += 1;
    }
    slug = candidate;
  }

  const doc: Record<string, unknown> = {
    _type: "caseStudy",
    ...fields,
    slug: slug ? { _type: "slug", current: slug } : undefined,
    published: false,
  };
  if (doc.sortOrder === undefined) {
    const max = await client.fetch(`math::max(*[_type == "caseStudy"].sortOrder)`);
    doc.sortOrder = (typeof max === "number" ? max : 0) + 1;
  }

  if (body.published === true) {
    const errors = validateCaseStudyForPublish(doc);
    if (errors.length) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }
    doc.published = true;
  }

  const created = await client.create(doc as { _type: string });
  return NextResponse.json({ caseStudy: created }, { status: 201 });
});
