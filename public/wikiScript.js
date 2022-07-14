inputEl = document.getElementById("searchInput");
spinnerEl = document.getElementById("spinner");
searchResultsEl = document.getElementById("searchResults");

function searchAndAppend(entry) {

    let { description, title, link } = entry;
    let resultEl = document.createElement("div");
    resultEl.classList.add("search-results");
    searchResultsEl.appendChild(resultEl);

    let titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultEl.appendChild(titleEl);

    let titleBreakEl = document.createElement("br");
    resultEl.appendChild(titleBreakEl);

    let linkEl = document.createElement("a");
    linkEl.href = link;
    linkEl.target = "_blank";
    linkEl.textContent = link;
    linkEl.classList.add("result-url");
    resultEl.appendChild(linkEl);

    let linkBreakEl = document.createElement("br");
    resultEl.appendChild(linkBreakEl);

    let descriptionEl = document.createElement("p");
    descriptionEl.classList.add("link-description");
    descriptionEl.textContent = description;
    resultEl.appendChild(descriptionEl);

}

function displayResults(searchResults) {
    spinnerEl.classList.toggle("d-none");
    for (entry of searchResults) {
        searchAndAppend(entry);
    }
}

function getSearchResults(event) {
    if (event.key === "Enter") {
        searchResultsEl.textContent = "";
        spinnerEl.classList.toggle("d-none");
        let query = inputEl.value;
        let url = "https://apis.ccbp.in/wiki-search?search=" + query;
        let options = {
            method: "GET",
        };
        fetch(url, options).then(function (response) {
            return response.json();
        }).then(function (jsonData) {
            //console.log(jsonData);
            if (jsonData.search_results.length === 0) {
                spinnerEl.classList.toggle("d-none");
                let paraEl = document.createElement("p");
                paraEl.classList.add("no-result");
                paraEl.textContent = "No results found! Try another query.";
                searchResultsEl.appendChild(paraEl);

            } else {
                let { search_results } = jsonData;
                displayResults(search_results);
            }
        })
    }
}

inputEl.addEventListener("keydown", getSearchResults);
