const NUMBER_OF_CATEGORIES = 18413;
const WIDTH_OF_GAME_BOARD = 6;
const HEIGHT_OF_GAME_BOARD = 5;

/** On page load, setup and start & add event handler for clicking clues */
$(document).ready(function () {
    // start
    setup()
    // restart
    $('#restart').on('click', restart)
})

/**  fill categories with ids
 fill categoryObjArr with data
 fill table with contents
 add handler*/
async function setup() {
    await fillTable(await getCategoryObjArr(await getCategoryIds()))
    $('td').on('click', clickHandler)
}

async function getCategoryIds() {
    let categories = []; // [id, id, id, id, id, id]
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    let randNum = getRandomInt(NUMBER_OF_CATEGORIES);
    let res = await axios.get(`https://jservice.io/api/categories?count=6&offset=${randNum}`);
    let data = res.data;
    for (let i = 0; i < WIDTH_OF_GAME_BOARD; i++) {
        categories.push(data[i].id);
        // console.log(`category ID ${i} is ready`)
    }
    return categories
}

async function getCategoryObjArr(categories) {
    let categoryObjArr = []; // [{title:"asdf", clues: [{question: "", answer:""},{}...]}, {}, {}, {}, {}, {} ]
    async function getCategoryData(catId) {
        // produces categoryObjArr
        let res = await axios.get(`https://jservice.io/api/category?id=${catId}`);
        let data = res.data;
        const {title, clues} = data;
        const categoryObj = {
            title,
            clues
        };
        return categoryObj
    }

    for (let i = 0; i < WIDTH_OF_GAME_BOARD; i++) {
        categoryObjArr.push(await getCategoryData(categories[i]));
        // console.log(`categoryObjArr ${i} is ready`)
    }
    return categoryObjArr
}

function fillTable(categoryObjArr) {
    createTable(categoryObjArr);
    fillContents(categoryObjArr)
}

function createTable(categoryObjArr) {
    const $categoryRow = $("thead");
    const $body = $("tbody");
    $categoryRow.empty();

    function createHead() {
        let row = "";
        for (let i = 0; i < WIDTH_OF_GAME_BOARD; i++) {
            row += "<th></th>"
        }
        return `<tr>${row}</tr>`
    }

    let $item = $(`${createHead()}`);
    $categoryRow.append($item);

    function fillHead(categoryObjArr) {
        let ths = document.querySelectorAll('th');
        for (let i = 0; i < ths.length; i++) {
            ths[i].innerHTML = categoryObjArr[i].title
        }
    }

    fillHead(categoryObjArr);

    function createRows() {
        let row = "";
        for (let i = 0; i < WIDTH_OF_GAME_BOARD; i++) {
            row += "<td><div class='default'>?</div>" +
                "<div class='question hidden'></div>" +
                "<div class='answer hidden'></div></td>"
        }
        return `<tr>${row}</tr>`
    }

    for (let i = 0; i < HEIGHT_OF_GAME_BOARD; i++) {
        $body.append(`${createRows()}`)
    }
}

function fillContents(categoryObjArr) {
    const CLUE = 1
    const ANSWER_IN_FORM_OF_QUESTION = 2
    // Fill Questions
    function fillQuestions(col) {
        let columnCells = document.querySelectorAll(`tbody td:nth-child(${col})`);
        for (let i = 0; i < columnCells.length; i++) {
            columnCells[i].children[CLUE].innerHTML = categoryObjArr[col - 1].clues[i].question
        }
    }

    // Fill Answers
    function fillAnswers(col) {
        let columnCells = document.querySelectorAll(`tbody td:nth-child(${col})`);
        for (let i = 0; i < columnCells.length; i++) {
            columnCells[i].children[ANSWER_IN_FORM_OF_QUESTION].innerHTML = categoryObjArr[col - 1].clues[i].answer
        }
    }

    for (let i = 1; i <= WIDTH_OF_GAME_BOARD; i++) {
        fillQuestions(i)
        fillAnswers(i)
    }
}

function clickHandler(event) {
    if (event.target.className.includes("default")) {
        $(this).children('div:first').remove();
        $(this).children('div:first').removeClass("hidden")
    } else if (this.firstElementChild.className.includes("question")) {
        $(this).children('div:first').remove();
        $(this).children('div:first').removeClass("hidden")
    }
}

/** On click of restart button, restart game. */
function restart() {
    location.href = 'index.html';
}