const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLessons(json.data))
}

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data => displayLevelWord(data.data))
}

const displayLevelWord = words => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length == 0){
        wordContainer.innerHTML = `
         <div class="text-center bg-red-100 col-span-full rounded-xl py-10 space-y-5">
            <img class="col-span-full mx-auto" src="./assets/alert-error.png"/>
            <p class="text-xl text-gray-400 font-medium font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-3xl font-bangla">নেক্সট Lesson এ যান</h2>
        </div>
        `;
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
                <button class="btn bg-sky-50 rounded-md hover:bg-sky-400"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-sky-50 rounded-md hover:bg-sky-400"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `
        wordContainer.append(card);
    })
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
        <button onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary">
        <i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}
        </button>
        `
        //     4. appent into container
        levelContainer.appendChild(btnDiv);
    }
}
loadLessons()