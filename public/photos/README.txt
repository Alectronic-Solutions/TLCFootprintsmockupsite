Photos go in this folder.

Two steps, both required:

  1. Drop the file here, e.g. play-room.jpg
  2. Open lib/photos.ts and set that slot's `src` to the filename:
       heroRoom: { src: "play-room.jpg", ... }

Until step 2 is done the site shows a placeholder, not the photo.

Then run `npm run optimize-images` to shrink the files for the web.

The slots, what each one is for, and the crop each one needs are all
documented in lib/photos.ts.
