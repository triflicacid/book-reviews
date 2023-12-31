import { getAssetsPath, getBookCoverPath, getBookImage, imageSuffix, tierDescriptions, tiers } from "./utils.js";

const params = new URLSearchParams(location.search);
const bookId = +params.get("id");
const container = document.getElementsByClassName("container")[0];

(async function () {
    const response = await fetch("assets/data.json");
    const booksData = await response.json();
    const bookData = booksData[bookId];

    if (!bookData) {
        container.insertAdjacentHTML("beforeend", `<span style='color: smokewhite;'>Book ID ${bookId} cannot be found.</span>`);
        return;
    }

    const assetsPath = getAssetsPath(bookData.title);
    const xBookData = await (await fetch(assetsPath + "data.json")).json(); // Extra book data

    container.dataset.tier = bookData.tier;
    document.documentElement.dataset.tier = bookData.tier;

    document.title = bookData.title + " (" + bookData.tier + ")";

    // Title
    container.insertAdjacentHTML("beforeend", `<div class='book-title'>${bookData.title}</div>`);
    
    // Author
    container.insertAdjacentHTML("beforeend", `<div class='book-author'>By ${bookData.author}</div>`);

    // Book rank
    container.insertAdjacentHTML("beforeend", `<div class='book-tier'><div>${bookData.tier}</div> <div>${tierDescriptions[tiers.indexOf(bookData.tier)]}</div></div>`);

    // Genre
    container.insertAdjacentHTML("beforeend", `<div class='book-genre'>Genre(s): ${bookData.genre.join(", ")}</div>`);
    
    // Read times
    let readPeriods = [];
    for (let i = 0; i < bookData.read.length; i += 2) {
        readPeriods.push(bookData.read[i] + ' &mdash; ' + (bookData.read[i + 1] ?? '<em>Ongoing</em>'));
    }

    container.insertAdjacentHTML("beforeend", `<div class='book-read'>Read ${readPeriods.join(', ')}</div>`);

    if (xBookData.status) {
        container.insertAdjacentHTML("beforeend", `<div class='book-status'>Status: ${xBookData.status}</div>`);
    }

    // Book image
    const image = getBookImage(getBookCoverPath(bookData));
    image.classList.add("book-image-main");
    image.alt = "Book cover";
    container.appendChild(image);

    if (xBookData.series) {
        const count = xBookData.series.length;
        const series = document.createElement("div");
        series.classList.add("book-series-container");
        series.insertAdjacentHTML("beforeend", `<div class='book-series-count'>This series contains ${count} book${count === 1 ? '' : 's'}</div>`);
        container.appendChild(series);

        if (xBookData.readTo !== undefined) {
            series.insertAdjacentHTML("beforeend", `<div class='book-stopped-at'>Read up to ${xBookData.series[xBookData.readTo].title}</div>`);
        }

        const books = document.createElement("div");
        books.classList.add("book-series");
        series.appendChild(books);

        xBookData.series.forEach((data, i) => {
            const image = getBookImage(assetsPath + (i + 1).toString() + "." + imageSuffix);
            image.classList.add("book-image");
            if (i > xBookData.readTo) {
                image.classList.add("book-not-read");
            } else {
                image.dataset.tier = data.tier ?? bookData.tier;
            }
            image.alt = data.title;
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

        // Update paths of images
        for (const image of content.querySelectorAll("img")) {
            image.src = getAssetsPath(bookData.title) + image.src.replace(location.origin, '');
        }
        for (const link of content.querySelectorAll("link")) {
            link.href = getAssetsPath(bookData.title) + link.href.replace(location.origin, '');
        }
    }
})();