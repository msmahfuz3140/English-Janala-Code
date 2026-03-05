const createElemets = arr => {
    const htmlElement = arr.map(el => `<span class="btn">${el}</span>`);
    return htmlElement.join(" ")
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const managespinner = status => {
    if (status == true) {
        document.getElementById("spinner")
            .classList.remove("hidden")
        document.getElementById("word-container")
            .classList.add("hidden")
    } else {
        document.getElementById("word-container")
            .classList.remove("hidden")
        document.getElementById("spinner")
            .classList.add("hidden")
    }
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLessons(json.data))
}

const removeActive = () => {
    const lessonBtns = document.querySelectorAll(".lesson-btn");
    lessonBtns.forEach(btn => btn.classList.remove("active"))

}
const loadLevelWord = (id) => {
    managespinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive() //remove all active class
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            clickBtn.classList.add("active") //add active class
            displayLevelWord(data.data)
        })
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data)
}
const displayWordDetails = (word) => {
    console.log(word)
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
                <div class="">
                    <h2 class="text-3xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
                </div>
                <div>
                    <h2 class="text-2xl font-bold mb-1">Meaning</h2>
                    <p class="font-semibold">${word.meaning}</p>
                </div>
                <div>
                    <h2 class="font-bold text-2xl mb-1">Exaple</h2>
                    <p class="font-semibold">${word.sentence}</p>
                </div>
                <div>
                    <h2 class="font-bold text-2xl mb-2">Synonyme</h2>
                    <div>${createElemets(word.synonyms)}</div>
                </div>
    
    `;
    document.getElementById("my_modal_5").showModal()
}

const displayLevelWord = words => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `
         <div class="text-center bg-red-100 col-span-full rounded-xl py-10 space-y-5">
            <img class="col-span-full mx-auto" src="./assets/alert-error.png"/>
            <p class="text-xl text-gray-400 font-medium font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-3xl font-bangla">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        managespinner(false);
        return;

    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-15 px-5 space-y-5">
            <h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "অনুবাদ পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-sky-50 rounded-md hover:bg-sky-400"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-sky-50 rounded-md hover:bg-sky-400"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.append(card);
    })
    managespinner(false);
}

const displayLessons = lessons => {
    // 1. get the container & empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    // 2. get into every lessons
    for (let lesson of lessons) {
        //     3. create Element

        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" 
        onclick="loadLevelWord(${lesson.level_no})" 
        class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i>
        Lesson-${lesson.level_no}
        </button>
        `
        //     4. appent into container
        levelContainer.appendChild(btnDiv);
    }
}
loadLessons()

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive()
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue)

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWord = data.data;
            console.log(allWord)
            const filterWords = allWord.filter(word => word.word.toLowerCase().includes(searchValue))
            console.log(filterWords)
            displayLevelWord(filterWords)
        })
})