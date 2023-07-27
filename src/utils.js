/** Array of ranks */
export const tiers = Object.freeze(['S', 'A', 'B', 'C', 'D', 'E', 'F']);
export const tierDescriptions = Object.freeze(['Excellent', 'Very good', 'Good', 'Average', 'Acceptable', 'Unacceptable', 'Terrible']);

export const imageSuffix = "jpg";

/** Given a name such as "the woman", convert to lower case and combine spaces by the given seperator */
export function lowerCaseAndCombine(string, seperator = "-") {
    return string.toLowerCase().replace(/\s+/g, seperator);
}

/** Given the title of a book, return path to assets */
export function getAssetsPath(title) {
    return "books/" + lowerCaseAndCombine(title, '-') + "/";
}

/** Given a book object, return the image path to the cover */
export function getBookCoverPath(book) {
    return getAssetsPath(book.title) + (book.cover ?? "cover") + "." + imageSuffix;
}

/** Return an Image element with the given source */
export function getBookImage(src) {
    const image = document.createElement("img");
    image.src = src;
    image.onerror = () => image.src = "books/unknown.png";
    return image;
}
