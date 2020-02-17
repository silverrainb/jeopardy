const categories = [] // [id, id, id, id, id, id]
const categoryObjArr = [] // [{title:"asdf", clues: [{question: "", answer:""},{}...]}, {}, {}, {}, {}, {} ]

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const getCategoryIds = new Promise((resolve, reject) => {
// http://jservice.io/api/categories?count=1&offset=18413
    let randNum = getRandomInt(18413)
    // fetches category ids
    return axios.get(`http://jservice.io/api/categories?count=6&offset=${randNum}`)
        .then(function (res) {
            let data = res.data
            for (let i = 0; i < 6; i++) {
                categories.push(data[i].id)
            }
        })
        .then(function () {
            let promises = []
            for (let i = 0; i < 6; i++) {
                promises.push(getCategory(categories[i]))
            }
            return Promise.all(promises)
        })
        .then(() => (fillTable()))
        .then(() => {
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
        })
        .catch(function (e) {
            console.log(e);
        })
})


async function getCategory(catId) {
    // produces categoryObjArr
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
        })
        .catch((e) => {
            console.log(e);
        })
}


function fillTable() {
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
            row += "<td><div class='null'>?</div><div class='question hidden'></div><div class='answer hidden'></div></td>"
        }
        return `<tr>${row}</tr>`
    }

    let $item = $(`${createHead()}`)
    $categoryRow.append($item)

    let $cover = $(`${createRows()}${createRows()}${createRows()}${createRows()}${createRows()}`)
    $body.append($cover)

    // Fill Table Head with Category
    function fillHead(){
        let ths = document.querySelectorAll('th')
        for (let i = 0; i < ths.length; i++) {
            ths[i].innerHTML = categoryObjArr[i].title
        }
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
    // fill All Contents
    function fillContents(){
        fillHead()
        for(let i=1; i<=6; i++){
            fillQuestions(i)
            fillAnswers(i)
        }
    }

    fillContents()
}

async function setupAndStart() {
    getCategoryIds
}

//TODO This runs infinitely! FIX IT
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
