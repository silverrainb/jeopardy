const categories = [] // [id, id, id, id, id, id]
const categoryObjArr = [] // [{title:"asdf", clues: [{question: "", answer:""},{}...]}, {}, {}, {}, {}, {} ]

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function getCategoryIds(){
    let randNum = getRandomInt(18413)
    let res = await axios.get(`https://jservice.io/api/categories?count=6&offset=${randNum}`)
    let data = res.data
    for (let i = 0; i < 6; i++) {
        categories.push(data[i].id)
        console.log(`category ID ${i} is ready`)
    }
    return categories
}

async function getCategory(catId) {
    // produces categoryObjArr
    let res = await axios.get(`https://jservice.io/api/category?id=${catId}`)
    let data = res.data
    const { title, clues } = data
    const categoryObj = {
        title,
        clues
    }
    return categoryObj
}

async function getCategoryObjArr(){
    for (let i = 0; i < 6; i++) {
        categoryObjArr.push(await getCategory(categories[i]))
        console.log(`categoryObjArr ${i} is ready`)
    }
    return categoryObjArr
}

function createTable(){
    const $categoryRow = $("thead")
    const $body = $("tbody")
    $categoryRow.empty();

    function createHead(){
        let row = ""
        for (let i = 0; i <6; i++) {
            row += "<th></th>"
        }
        return `<tr>${row}</tr>`
    }

    function createRows(){
        let row = ""
        for(let i=0; i<6; i++){
            row += "<td><div class='default'>?</div><div class='question hidden'></div><div class='answer hidden'></div></td>"
        }
        return `<tr>${row}</tr>`
    }

    let $item = $(`${createHead()}`)
    $categoryRow.append($item)

    // Fill Head with Categories
    fillHead()

    let $cover = $(`${createRows()}${createRows()}${createRows()}${createRows()}${createRows()}`)
    $body.append($cover)
}

function fillHead(){
    // Fill Head Category
    let ths = document.querySelectorAll('th')
    console.log(ths)
    for (let i = 0; i < ths.length; i++) {
        ths[i].innerHTML =  categoryObjArr[i].title
    }
}

// Fill Questions
function fillQuestions(col){
    let columnCells = document.querySelectorAll(`tbody td:nth-child(${col})`);
    for (let i = 0; i < columnCells.length; i++) {
        columnCells[i].children[1].innerHTML =  categoryObjArr[col-1].clues[i].question
    }
}

// Fill Answers
function fillAnswers(col){
    let columnCells = document.querySelectorAll(`tbody td:nth-child(${col})`);
    for (let i = 0; i < columnCells.length; i++) {
        columnCells[i].children[2].innerHTML =  categoryObjArr[col-1].clues[i].answer
    }
}

function fillContents(){
    // fillHead()
    for(let i=1; i<=6; i++){
        fillQuestions(i)
        fillAnswers(i)
    }
}

function fillTable() {
    createTable()
    fillContents()
}

function handler(e){
    console.log("clicked td!")
    if(e.target.className.includes("default")){
        $(this).children('div:first').remove()
        $(this).children('div:first').removeClass("hidden")
    }
    else if(this.firstElementChild.className.includes("question")){
        $(this).children('div:first').remove()
        $(this).children('div:first').removeClass("hidden")
    }
}

async function setup(){
    // fill categories with ids
    await getCategoryIds()
    // fill categoryObjArr with data
    await getCategoryObjArr()
    // fill table and contents
    await fillTable()
    // // add handler
    $('td').on('click', handler)
}

/** On click of restart button, restart game. */
function restart() {
    location.href = 'index.html';
}

/** On page load, setup and start & add event handler for clicking clues */
$(document).ready(function () {
    // start
    setup()
    // restart
    $('#restart').on('click', restart)
})