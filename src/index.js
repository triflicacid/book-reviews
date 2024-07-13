import { tiers, getBookCoverPath, getBookImage, createObjectWithTierKeys, tierDescriptions } from "./utils.js";

// create book cover
function generateBookCover(bookId, book) {
    const text = book.title + " by " + book.author;
    bookData[book.tier] = book;

    const eBook = document.createElement("div");
    // eBook.title = text;
    eBook.addEventListener("click", () => {
        location.href = "book.html?id=" + bookId;
    });
    eBook.dataset.tier = book.tier;

    const image = getBookImage(getBookCoverPath(book));
    image.attr = text;
    eBook.appendChild(image);
    
    eBook.insertAdjacentHTML("beforeend", "<div class=\"tier-item-glow\"></div>");

    return eBook;
}

function updateShowList(content) {
    if (showList) {
        showList = true;
        content.innerHTML = '';
        content.appendChild(generateTierList(bookData));
    } else {
        showList = false;
        content.innerHTML = '';
        content.appendChild(generateBookList(bookData));
    }
}

// generate tier list
function generateTierList(bookData) {
    // create tier list
    const eTierList = document.createElement("div");
    eTierList.classList.add("tier-list");
    container.appendChild(eTierList);

    // for each tier, create html and insert books
    tiers.forEach((tier, i) => {
        const eTier = document.createElement("div");
        eTier.classList.add("tier");
        eTier.dataset.tier = tier;
        eTierList.appendChild(eTier);
        
        const eLabel = document.createElement("div");
        eLabel.classList.add("tier-label");
        eLabel.title = tierDescriptions[i];
        eLabel.innerText = tier;
        eTier.appendChild(eLabel);
        
        const content = document.createElement("div");
        content.classList.add("tier-content");
        eTier.appendChild(content);

        // add books to tier
        bookData.forEach((book, i) => book.tier === tier && content.appendChild(generateBookCover(i, book)));
    });

    return eTierList;
}

// generate book list
function generateBookList(bookData) {
    // create tier list
    const eList = document.createElement("div");
    eList.classList.add("book-collection");
    container.appendChild(eList);

    // add books to list
    tiers.forEach((tier, i) => {
        bookData.forEach((book, i) => book.tier === tier && eList.appendChild(generateBookCover(i, book)));
    });

    return eList;
}

// VARIABLES
var showList = true;
const container = document.getElementsByClassName("container")[0];
var bookData;

// header
const eShowList = document.getElementById("show-list");
eShowList.checked = showList;
eShowList.addEventListener("change", () => {
    showList = eShowList.checked;
    updateShowList(content);
});

// create content div
const content = document.createElement("div");
container.appendChild(content);

// fetch book data
fetch("assets/data.json")
    .then(r => r.json())
    .then(data => {
        bookData = data;
        updateShowList(content);
    });
