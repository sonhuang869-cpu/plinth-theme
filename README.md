# Plinth

A Shopify Online Store 2.0 section architecture, built to make one promise
testable.

Every theme proposal says the same sentence: *flexible sections and blocks so
your team can edit content without a developer.* It is easy to write and hard to
check, and most themes that say it ship a handful of text fields and a hardcoded
layout.

So here the schema is the source of truth. **The editor is generated from it.**
A section that forgets to declare a setting cannot be edited, which means the
promise either holds for every section or the build fails.

Open the page and change it yourself: reorder sections, hide them, add and
remove them, edit settings, add blocks, and point a section at a different
metaobject. No code, no deploy.

## What is actually demonstrated

**Sections and blocks.** Nine section types, each with a declared schema. Add,
remove, reorder, hide. Blocks within a section with their own settings and a
declared maximum, so a trust bar cannot quietly become eleven items.

**Metaobjects, used properly.** The specification table, the FAQ and the size
guide are not page content. They are metaobject entries that sections point at.
Switch the specification source from `spec.chef-210` to `spec.chef-180` in the
editor and the whole table changes, because one entry feeds many products. That
is the difference between structured content and a rich text field.

**Guardrails.** The buy panel is marked required and cannot be removed, because
a product page without one is not something a merchant should be able to ship by
accident. Optional sections can go.

**No empty states.** Every setting declares a default, so an added section
arrives fully configured rather than as a blank box somebody has to fill before
the page looks right. This is asserted for all seven addable types.

**A design system, not a palette.** Tokens for colour, type, spacing and radius
in one place, every pairing checked against WCAG AA.

## Checks

The schema is asserted before any renderer exists: every setting has a default
and a label, every select offers at least two options, every range declares a
sane min and max, every metaobject reference resolves, and every addable section
inserts complete.

Then a headless sweep drives the editor itself at 390 px and 1500 px: it
reorders a section and confirms the page order changed, hides and shows one,
renames the add-to-cart button, switches off the compare-at price, repoints the
specification table at another metaobject and confirms the whole table swapped,
adds blocks until the declared cap stops it, confirms the buy panel cannot be
removed and an optional section can, removes and re-adds a section, resets, and
then checks the storefront still works underneath it all.

No horizontal overflow, no console errors, every image decoding with alt text
and reserved dimensions, contrast measured against each element's composited
background.

One defect that caught: the image-with-text section put bone text over a
gradient with no solid colour beneath it, on a photograph of a bright wooden
board. Unmeasurable and probably unreadable. It is a solid panel now.

## Running it

```
npm install
npm run dev
```

## Scope

This models the architecture and the editing experience in React so it can be
opened from a link. On Shopify the same structure is section schema JSON, Liquid
templates and metaobject definitions, which is a translation rather than a
rewrite.

Prototype. Representative brand, product and prices. Photography from Unsplash
under the Unsplash licence.
