import { getAssetsPath, getBookCoverPath, getBookImage, imageSuffix, tierDescriptions, tiers } from "./utils.js";

const params = new URLSearchParams(location.search);
const bookId = +params.get("id");
const container = document.getElementsByClassName("container")[0];

(async function () {
    function generateBookImage(itemData, i, readTo) {
        const image = getBookImage(assetsPath + (i + 1).toString() + "." + imageSuffix);
        image.classList.add("book-image");
    
        const title = itemData.title
            .replace("$title", bookData.title)
            .replace("$n", i + 1);
    
        if (i > readTo) {
            image.classList.add("book-not-read");
        } else {
            image.dataset.tier = itemData.tier ?? bookData.tier;
        }
    
        image.alt = title;
        image.title = title;
        
        return image;
    }

    // fetch general series data
    const response = await fetch("assets/data.json");
    const booksData = await response.json();
    const bookData = booksData[bookId];

    // report error if bad id
    if (!bookData) {
        container.insertAdjacentHTML("beforeend", `<span style='color: smokewhite;'>Book ID ${bookId} cannot be found.</span>`);
        return;
    }

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

    // fetch more detailed series data on individual books
    const assetsPath = getAssetsPath(bookData.title);
    const fetchedBookData = await fetch(assetsPath + "data.json");
    
    if (fetchedBookData.ok) {
        const xBookData = await fetchedBookData.json(); // Extra book data

        if (xBookData.status) {
            container.insertAdjacentHTML("beforeend", `<div class='book-status'>Status: ${xBookData.status}</div>`);
        }

        // display main book cover
        const image = getBookImage(getBookCoverPath(bookData));
        image.classList.add("book-image-main");
        image.alt = "Book cover";
        container.appendChild(image);

        // display books in series
        if (xBookData.series) {
            const count = xBookData.series.length;
            const series = document.createElement("div");
            series.classList.add("book-series-container");
            container.appendChild(series);

            const books = document.createElement("div");
            books.classList.add("book-series");
            series.appendChild(books);

            let i = 0;
            xBookData.series.forEach(data => {
                if (data.type === "repeat") {
                    for (let j = 0; j < +data.count; j++) {
                        books.appendChild(generateBookImage(data, i++, xBookData.readTo));
                    }
                } else {
                    books.appendChild(generateBookImage(data, i++, xBookData.readTo));
                }
            });
        }
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