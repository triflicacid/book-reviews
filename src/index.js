import { tiers, getBookCoverPath, getBookImage, createObjectWithTierKeys, tierDescriptions } from "./utils.js";

// VARIABLES
const bookData = createObjectWithTierKeys(() => ([])),
    tierElements = {};
var showList = true;

const container = document.getElementsByClassName("container")[0];

// SETUP HEADER CONTROLS
const eShowList = document.getElementById("show-list");
eShowList.checked = showList;
eShowList.addEventListener("change", () => {
    showList = eShowList.checked;
    updateShowList();
});

function updateShowList() {
    if (showList) {
        showList = true;
        eTierList.removeAttribute("hidden");
        eCollection.setAttribute("hidden", "hidden");
    } else {
        showList = false;
        eCollection.removeAttribute("hidden");
        eTierList.setAttribute("hidden", "hidden");
    }
}

// SETUP TIER LIST
const eTierList = document.createElement("div");
eTierList.classList.add("tier-list");
container.appendChild(eTierList);
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

    tierElements[tier] = content;
});

// SETUP COLLECTION
const eCollection = document.createElement("div");
eCollection.classList.add("book-collection");
container.appendChild(eCollection);

// FETCH BOOK DATA
fetch("assets/data.json")
    .then(r => r.json())
    .then(data => {
        const bookCollectionBooks = createObjectWithTierKeys(() => ([]));

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

            // Clone node for book collection
            const eBook2 = eBook.cloneNode(true);
            eBook2.dataset.tier = book.tier;
            bookCollectionBooks[book.tier].push(eBook2);
        });

        for (const tier in bookCollectionBooks)
           for (const e of bookCollectionBooks[tier])
                eCollection.appendChild(e);
    });

updateShowList();
