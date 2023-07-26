import { getAssetsPath, getBookCoverPath, getBookImage, imageSuffix, tierDescriptions, tiers } from "./utils.js";

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

    container.dataset.tier = book.tier;
    document.documentElement.dataset.tier = book.tier;

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
    let readPeriods = [];
    for (let i = 0; i < book.read.length; i += 2) {
        readPeriods.push(book.read[i] + ' &mdash; ' + (book.read[i + 1] ?? '<em>Ongoing</em>'));
    }

    container.insertAdjacentHTML("beforeend", `<div class='book-read'>Read ${readPeriods.join(', ')}</div>`);

    if (book.status) {
        container.insertAdjacentHTML("beforeend", `<div class='book-status'>Status: ${book.status}</div>`);
    }

    // Book image
    const image = getBookImage(getBookCoverPath(book));
    image.classList.add("book-image-main");
    image.alt = "Book cover";
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
            const image = getBookImage(assetsPath + (i + 1).toString() + "." + imageSuffix);
            image.classList.add("book-image");
            if (i > book.readTo) image.classList.add("book-not-read");
            image.alt = name;
            books.appendChild(image);
        });
    }

    let include;
    try {
        include = await fetch(assetsPath + "include.html");
        include = include.ok ? await include.text() : null;
    } catch {}
    if (include) {
        const content = document.createElement("div");
        content.classList.add("content");
        content.innerHTML = include;
        container.appendChild(content);

        const images = content.querySelectorAll("img");
        for (const image of images) {
            image.src = getAssetsPath(book.title) + image.src.replace(location.origin, '');
        }
    }
})();