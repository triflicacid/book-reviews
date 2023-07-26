import { getAssetsPath, getBookCoverPath, tierDescriptions, tiers } from "./utils.js";

const params = new URLSearchParams(location.search);
const bookId = +params.get("id");
const container = document.getElementsByClassName("container")[0];

(async function () {
    const response = await fetch("assets/data.json");
    const books = await response.json();
    const book = books[bookId];

    if (!book) {
        container.insertAdjacentHTML("beforeend", `<span style='color: smokewhite;'>Book ID ${bookId} cannot be found.</span>`);
        return;
    }

    const assetsPath = getAssetsPath(book.title);

    container.classList.add("tier");
    container.dataset.tier = book.tier;

    document.title = book.title + " (" + book.tier + ")";

    // Title
    container.insertAdjacentHTML("beforeend", `<div class='book-title'>${book.title}</div>`);
    
    // Author
    container.insertAdjacentHTML("beforeend", `<div class='book-author'>By ${book.author}</div>`);

    // Book rank
    container.insertAdjacentHTML("beforeend", `<div class='book-tier'><div>${book.tier}</div> <div>${tierDescriptions[tiers.indexOf(book.tier)]}</div></div>`);

    // Genre
    container.insertAdjacentHTML("beforeend", `<div class='book-genre'>Genre(s): ${book.genre.join(", ")}</div>`);

    // Read times
    container.insertAdjacentHTML("beforeend", `<div class='book-read'>Read ${book.read[0]} &mdash; ${book.read.length === 1 ? '<em>Ongoing</em>' : book.read[1]}</div>`);

    if (book.status) {
        container.insertAdjacentHTML("beforeend", `<div class='book-status'>Status: ${book.status}</div>`);
    }

    // Book image
    const image = document.createElement("img");
    image.classList.add("book-image");
    image.alt = "Book cover";
    image.src = getBookCoverPath(book)
    container.appendChild(image);

    if (book.series) {
        const count = book.series.length;
        const series = document.createElement("div");
        series.classList.add("book-series-container");
        series.insertAdjacentHTML("beforeend", `<div class='book-series-count'>This series contains ${count} book${count === 1 ? '' : 's'}</div>`);
        container.appendChild(series);

        if (book.readTo !== undefined) {
            series.insertAdjacentHTML("beforeend", `<div class='book-stopped-at'>Read up to ${book.series[book.readTo]}</div>`);
        }

        const books = document.createElement("div");
        books.classList.add("book-series");
        series.appendChild(books);

        book.series.forEach((name, i) => {
            const image = document.createElement("img");
            image.classList.add("book-image");
            if (i > book.readTo) image.classList.add("book-not-read");
            image.alt = name;
            image.src = assetsPath + (i + 1).toString() + ".png";
            books.appendChild(image);
        });
    }

    let include;
    try {
        include = await fetch(assetsPath + "include.html");
        if (include.ok)
        include = await include.text();
    } catch {}
    if (include && include.ok) {
        const content = document.createElement("div");
        content.classList.add("content");
        content.innerHTML = include;
        container.appendChild(content);
    }
})();