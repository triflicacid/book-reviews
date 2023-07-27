# Book Reviews

This website serves to rank and provide reviews/information about books I have read using Kindle Unlimited.

I use the well known S, A - F ranking system.
- S - Superior, excellent
- A - Very good
- B - Good
- C - Average
- D - Acceptable but not great
- F - Unacceptable, rubbish

All book images are 192x300

## File Structure
- `assets/` - Static assets
    - `data.json` - Contains brief data on each book/series read
    - `data.json.txt` - Description of structure of `data.json`
- `books/` - Directory containing specific series/book data
    - `<title>/` - Directory containing data pertaining to the book/series
        - `<number>.jpg` - Book cover for book number `<number>` in the series.
        - `cover.jpg` - Optional. If present, this is the cover for the series.
        - `data.json` - Contains more focused data pertaining to the series.
        - `data.txt.json` - Description of structure of `data.json`.
        - `include.html` - Optional. Contains extra data to be displayed on the information page. Any image's `src` attribute will be prepended with the path to this directory.

        Other files may be present that are referenced in `include.html`.
    - `unknown.png` - Defaulted to when a book cover image cannot be loaded.
- `src/` - Contains JavaScript filed
- `index.html` - Tier list
- `book.html` - Display information about a book/series as specified by the `GET` parameter `id`.
