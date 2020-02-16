// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]


const categories = []
const categoryObjArr = []

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5)
}

const getCategoryIds = new Promise((resolve, reject) => {
// http://jservice.io/api/categories?count=1&offset=18413
    let randNum = getRandomInt(18413)
    // TODO What are the ways to make this request 6 times, in parallel?
    return axios.get(`http://jservice.io/api/categories?count=6&offset=${randNum}`)
        .then(function (res) {
            let data = res.data
            for (let i = 0; i < 6; i++) {
                categories.push(data[i].id)
                console.log("category ID 1 is ready")
            }
        }).then(function () {
            // TODO is there better way than using for loop?
            let promises = []
            for (let i = 0; i < 6; i++) {
                promises.push(getCategory(categories[i]))
            }
            console.log("ran getCategory function")
            return Promise.all(promises)
            // TODO this should be in the setup section, but it just doesnt work!
        }).then(() => (fillTable()))
        .catch(function (e) {
            console.log(e);
        })
})


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    await axios.get(`http://jservice.io/api/category?id=${catId}`)
        .then((res) => {
            let data = res.data
            const {title, clues} = data
            let categoryObj = {
                title,
                clues
            }
            categoryObjArr.push(categoryObj)
            console.log('categoryObjArr READY')
        }).catch(function (e) {
            console.log(e);
        })
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
    const $categoryRow = $("thead")
    $categoryRow.empty();

    function createHead(){
        let row = ""
        for (let i = 0; i <6; i++) {
            row += "<th></th>"
        }
        return `<tr>${row}</tr>`
    }
    let $item = $(`${createHead()}`)

    $categoryRow.append($item)



    const $body = $("tbody")

    function createRows(){
        let row = ""
        for(let i=0; i<6; i++){
            row += "<td><div class='null'>?</div><div class='question hidden'></div><div class='answer hidden'></div></td>"
        }
        return `<tr>${row}</tr>`
    }

    let $cover = $(`${createRows()}${createRows()}${createRows()}${createRows()}${createRows()}`)

    // TODO use an array and store the elements in the array
    // create a for loop and add html in the array then append that to the body.

    // TODO use for loop to create the table, then add event listener then add html.
    // let $questions = await $(``)
    // let $clues = await $(``)
    $body.append($cover)

    // Fill Category
    let ths = document.querySelectorAll('th')
    for (let i = 0; i < ths.length; i++) {
        ths[i].innerHTML = categoryObjArr[i].title
    }

    // Fill Questions
    function fillQuestions(col){
        let columnCells = document.querySelectorAll(`tbody td:nth-child(${col})`);
        for (let i = 0; i < columnCells.length; i++) {
            columnCells[i].children[1].innerHTML = categoryObjArr[col-1].clues[i].question
        }
    }
    // Fill Answers
    function fillAnswers(col){
        let columnCells = document.querySelectorAll(`tbody td:nth-child(${col})`);
        for (let i = 0; i < columnCells.length; i++) {
            columnCells[i].children[2].innerHTML = categoryObjArr[col-1].clues[i].answer
        }
    }

    function fillContents(){
        for(let i=1; i<=6; i++){
            fillQuestions(i)
            fillAnswers(i)
        }
    }

    fillContents()
}

/** Handle clicking on a clue: show the question or answer.
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

/** Start game:
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    getCategoryIds
    // setTimeout(fillTable(), 5000)
    // await getCategoryIds().then(fillTable()) // also runs getCategory
    //TODO how to make sure that the following runs after get Category IDs done? await doesn't do it.
    // await fillTable()
    // event handler
    $('td').on('click', function(e){
        if(e.target.className.includes("null")){
            $(this).children('div:first').remove()
            $(this).children('div:first').removeClass("hidden")
        }
        else if(this.firstElementChild.className.includes("question")){
            $(this).children('div:first').remove()
            $(this).children('div:first').removeClass("hidden")
        }
    })

}

/** On click of restart button, restart game. */
function restart() {
    // location.href = 'index.html';
}

// $('#restart').addEventListener('click', restart())


/** On page load, setup and start & add event handler for clicking clues */
$(document).ready(function () {
    // start
    setupAndStart();


    // restart
    $('#restart').on('click', function () {
        location.href = 'index.html';
    })
})