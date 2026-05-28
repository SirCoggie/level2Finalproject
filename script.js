const body = document.body;

const searchInput = document.querySelector("#searchInput");
const searchWord = document.querySelector("#search_word");

const toggleSwitch = document.querySelector(".toggle-switch");
const topRanking =document.querySelector("#topRanking");

const moreInfoBtn = document.querySelector("#moreInfo");
const tabBody = document.querySelector("#tab-body");
const closeBtn = document.querySelector(".close-btn");

const fullRankingList = document.querySelector("#fullRanking");

// for the right side of the tab
const saveBtn = document.querySelector("#saveBtn");
const shrinkBtn = document.querySelector(".shrink-btn");

const form = document.getElementById("form");
const noteDisplay = document.querySelector(".note-display");
const pNoteBtn = document.querySelector(".pNoteBtn");
const hideNote = document.querySelector(".hide-note");

const countryInput = document.getElementById("country");
const rankingInput = document.getElementById("ranking");
const wordSearchedInput = document.getElementById("wordSearched");

const noteContainer = document.getElementById("note");

pNoteBtn.addEventListener("click", () => {
    hideNote.classList.remove("hide-note");
})

shrinkBtn.addEventListener("click", () => {
    hideNote.classList.add("hide-note");
})

// function to display and close model
moreInfoBtn.addEventListener("click", () => {
    tabBody.classList.add("active");
})

closeBtn.addEventListener("click", () => {
    tabBody.classList.remove("active");
})



console.log("clear button found", saveBtn)


// localstorage for the notepad part

let notelist = [];

// load the note (convert the note back into object)
function loadNote() {
    const saved = localStorage.getItem("customNote");
    if (saved)  {
    notelist = JSON.parse(saved);
    } else {
        console.log("No notes found");
    }
}

function saveNote() {
    localStorage.setItem("customNote", JSON.stringify(notelist));
}

function renderNote(notesToRender) {
    noteContainer.innerHTML = "";
    console.log("Rendering notes",notesToRender);
    notesToRender.forEach((note, index) => {
        const card = document.createElement("div");
        card.classList.add("note-card");

        card.innerHTML = `
    <em>Country:</em>${note.country}<br>
  <em>Ranking:</em> ${note.ranking}<br>
  <em>Word Searched:</em> ${note.wordSearched}<br>
  <button class="delete-btn" data-index="${index}">🗑️ Delete</button>`;

    noteContainer.appendChild(card);
    });

    const deleteBtns = document.querySelectorAll(".delete-btn");

    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            notelist.splice(index, 1);
            saveNote();
            renderNote(notelist);
        });
    });
    }

function addNote(e) {
    e.preventDefault();
    let note = {
        country: countryInput.value.trim(),
        ranking: rankingInput.value.trim(),
        wordSearched: wordSearchedInput.value.trim(),
    };

    notelist.push(note);
    saveNote();
    renderNote(notelist);
    form.reset();
}
// API function
async function fetchTrendData(searchTerm) {

  try {

    const response = await axios.get(
      "http://localhost:3000/api/trends",
      {
        params: {
          q: searchTerm,
        },
      }
    );

    const data = response.data;

    const regions = data.interest_by_region;

    printTopRanking(regions);

    printFullRanking(regions);

  } catch (error) {

    console.log("API ERROR:", error);

  }

};




// load theme function that
// -> pull the localstorage and get the theme and change the theme to mint if the theme is mint else nothing
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    console.log("theme loaded", savedTheme);
    if (savedTheme === "mint") {
        body.classList.add('mint');
    }
}

// toggle theme function that toggle a class in css called mint
// -> set theme in local storage as mint
function toggleTheme() {
    body.classList.toggle('mint');
    const isMint = body.classList.contains('mint');
    localStorage.setItem('theme', isMint ? 'mint' : "")
}

// toggle theme activate only when the click button is made
toggleSwitch.addEventListener('click', toggleTheme);

form.addEventListener("submit", addNote);

loadTheme();
loadNote();
renderNote(notelist);

// mock data
const mockData = {"search_metadata":{
"id": "69ea846166bc78c0f86a5656"},
"search_parameters":{
    "engine":
"google_trends"},
"interest_by_region":
[
{ "location":"South Korea", "value":"100"}, 
{ "location": "India", "value": "92" },
{ "location": "Japan", "value": "78" },
{ "location": "Italy", "value": "74" },
{ "location": "Germany", "value": "68" },
{ "location": "United Kingdom", "value": "65" },
{ "location": "Canada", "value": "60" },
{ "location": "Brazil", "value": "58" },
{ "location": "Australia", "value": "55" },
{ "location": "France", "value": "52" },
{ "location": "Singapore"," value": "50" }
]
}


function printTopRanking (regions) {
    // this create an inner HTML within topRanking as blank
    topRanking.innerHTML = "";

    // go into mockData.interest_by_region and create a new array containing from 0~4th index (basically 1,2,3,4 and 5th index)
    // and then execute the function for each index to create rank, create element within html file with p tag.
    regions.slice(0,4).forEach((item, index) => {
        const rank = index + 1;
        const rankingText = document.createElement("p");
    
        rankingText.classList.add("rank");
        rankingText.textContent = `#${rank} ${item.location}`;
        
        topRanking.appendChild(rankingText);
    });
}

// this create searchWord event have a submit event that will prevent refresh and execute printTopRanking function.
// this has to be edited so that the submit word is inserted into api for the api function to run.
searchWord.addEventListener("submit",async (event) => {

event.preventDefault();

const searchTerm = searchInput.value;

await fetchTrendData(searchTerm);


});

// Render full ranking to the full rank
function printFullRanking(regions) {
    fullRankingList.innerHTML = "";

    regions.slice(0,10).forEach((item, index) => {
        const li = document.createElement("li");

        li.textContent = `#${index + 1} ${item.location}`;

        fullRankingList.appendChild(li);
    })
}

