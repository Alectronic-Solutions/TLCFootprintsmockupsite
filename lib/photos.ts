/**
 * Every photo slot on the site, in one place.
 *
 * This is the whole photo workflow: drop a file into `public/photos/`, put its
 * filename in the `src` below, done. The slot switches from placeholder to
 * photo with no component changes and no layout shift, because the aspect
 * ratio is declared here rather than measured from the file.
 *
 * `src: null` renders a designed, unlabeled placeholder. Shot specifications
 * remain here for the person supplying photography and are not exposed on the
 * public site.
 *
 * ART DIRECTION, and the reason it is written down here rather than assumed:
 *
 *  - Photograph the space, not children. Rooms, shelves, the yard, the table
 *    set for lunch. Empty rooms need no consent paperwork and parents read
 *    them as "this is the room my child would be in".
 *  - Never publish a photo showing another family's child without written
 *    permission from that family.
 *  - Shoot in daylight, no flash. The whole site is warm cream; a cool
 *    flash-lit photo will look pasted on.
 *  - Landscape crops for section bands, portrait for the About portrait.
 *
 * If a slot is filled with stock photography for a mock, keep it obviously
 * placeholder-ish and swap it before launch. Stock photos of other people's
 * children on a childcare site are a trust problem, not a design one.
 */

export interface PhotoSlot {
  /** Filename inside /public/photos, or null to render the placeholder. */
  src: string | null;
  /** Always written, placeholder or not: it is what makes the slot accessible. */
  alt: string;
  /** Declared, never measured, so filling a slot causes no layout shift. */
  ratio: "4/3" | "3/2" | "4/5" | "1/1" | "16/9";
  /** Internal shot guidance for whoever supplies the final photograph. */
  spec: string;
}

export const PHOTOS = {
  /**
   * Home hero. The one photo above the fold, and the only slot on the site
   * that runs full-bleed: it is the background of the whole hero section, with
   * the headline and buttons laid over its left half behind a cream scrim.
   *
   * That changes what to shoot. It is cropped hard and unpredictably - tall on
   * a phone, very wide on a desktop - so the subject has to sit right of
   * center with quiet floor or wall on the left for the copy to land on. A
   * busy left third makes the headline unreadable at exactly the width most
   * parents will see it.
   */
  heroRoom: {
    src: null,
    alt: "The main play room at T.L.C. Footprints, with low shelves and floor cushions",
    ratio: "16/9",
    spec: "The main play room, wide, daylight. Subject right of center, quiet left third. 2400 x 1350",
  },

  /**
   * Home page, full-bleed behind the hours section. Like `heroRoom`, this one
   * has copy laid over it, in the right half from lg up, so the quiet third
   * needs to be on the right.
   */
  dayPlay: {
    src: "learning-toy-shelves.webp",
    alt: "Organized shelves of toys, puzzles, books, and creative materials at T.L.C. Footprints",
    ratio: "3/2",
    spec: "Morning play setup, from standing height. Subject left of center, quiet right third. 2000 x 1333",
  },

  /** What to expect, full-bleed behind the hours section. Copy sits over the
      right half from lg up, so keep that side of the frame quiet. */
  outdoor: {
    src: null,
    alt: "The fenced back yard, with shade and outdoor toys",
    ratio: "3/2",
    spec: "Back yard, shade visible, fence in frame. Subject left of center, quiet right third. 2000 x 1333",
  },

  /** About page, "Meet LaTrell". */
  portrait: {
    src: "latrell-armstrong-portrait.webp",
    alt: "LaTrell Armstrong, owner of T.L.C. Footprints Home Daycare",
    ratio: "4/5",
    spec: "Portrait, waist up, window light. 1200 x 1500",
  },

  /** Programs page, meals. */
  meals: {
    src: "learning-toy-shelves-rotated.webp",
    alt: "Organized shelves of toys, puzzles, books, and creative materials at T.L.C. Footprints",
    ratio: "1/1",
    spec: "Table set for snack, shot from above. 1200 x 1200",
  },
} satisfies Record<string, PhotoSlot>;

export type PhotoKey = keyof typeof PHOTOS;

/** True once anything at all has been shot, used to skip empty photo bands. */
export const HAS_PHOTOS = Object.values(PHOTOS).some((p) => p.src !== null);
