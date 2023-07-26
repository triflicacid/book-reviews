import { tiers, getBookCoverPath, getBookImage } from "./utils.js";

// CONSTANTS
const bookData = tiers.reduce((p, c) => (p[c] = [], p), {}),
    tierElements = {};
window.books = bookData;

// SETUP TIER LIST
const container = document.getElementsByClassName("container")[0];
const eTierList = document.createElement("div");
eTierList.classList.add("tier-list");
container.appendChild(eTierList);
tiers.forEach(tier => {
    const eTier = document.createElement("div");
    eTier.classList.add("tier");
    eTier.dataset.tier = tier;
    eTierList.appendChild(eTier);
    
    const eLabel = document.createElement("div");
    eLabel.classList.add("tier-label");
    eLabel.innerText = tier;
    eTier.appendChild(eLabel);
    
    const content = document.createElement("div");
    content.classList.add("tier-content");
    eTier.appendChild(content);

    tierElements[tier] = content;
});

// FETCH BOOK DATA
fetch("assets/data.json")
    .then(r => r.json())
    .then(data => {
        data.forEach((book, id) => {
            const text = book.title + " by " + book.author;
            bookData[book.tier] = book;

            const eBook = document.createElement("div");
            // eBook.title = text;
            tierElements[book.tier].appendChild(eBook);
            eBook.addEventListener("click", () => {
                location.href = "book.html?id=" + id;
            });

            const image = getBookImage(getBookCoverPath(book));
            image.attr = text;
            eBook.appendChild(image);
            
            eBook.insertAdjacentHTML("beforeend", "<div class=\"tier-item-glow\"></div>");
        });     
    });
