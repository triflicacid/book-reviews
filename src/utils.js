/** Array of ranks */
export const tiers = Object.freeze(['S', 'A', 'B', 'C', 'D', 'E', 'F']);
export const tierDescriptions = Object.freeze(['Excellent', 'Very good', 'Good', 'Average', 'Acceptable', 'Unacceptable']);

/** Given a name such as "the woman", convert to lower case and combine spaces by the given seperator */
export function lowerCaseAndCombine(string, seperator = "-") {
    return string.toLowerCase().replace(/\s+/g, seperator);
}

/** Given the title of a book, return the path the the book's cover image */
export function getBookImage(title) {
    return "assets/images/" + lowerCaseAndCombine(title, '-') + ".png";
}

/** Given the title of a book, return path to assets */
export function getAssetsPath(title) {
    return "assets/" + lowerCaseAndCombine(title, '-') + "/";
}

/** Given a book object, return the image path to the cover */
export function getBookCoverPath(book) {
    return book.cover ? getAssetsPath(book.title) + book.cover.toString() + ".png" : getBookImage(book.title);
}
