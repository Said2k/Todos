// ! TODOS
/**
 *  GET - получить данные 
 * PATCH - частичное изменение
 * PUT - полная замена данных
 * POST - добавление данных
 * DELETE - удаление 
 * 
 * CRUD - Create(POST- request)  Read(GET-request) Update(PUT/patch) Delete(DELETE)
 */

// npx json-server -w db.json -p 8000
// API - APPLICATION PROGRAMMING INTERFACE

// ? npm i -g json-server
let limit = 3
let page =1; 

const API = "http://localhost:8000/todos";

let inpAdd = document.getElementById("inp-add")
let btnAdd = document.getElementById("btn-add")

let inp = document.getElementById("inp-search")

// ! Create
btnAdd.addEventListener("click", async ()=>{
    let newTodo = {
        todo:inpAdd.value,
    }
    // console.log(newTodo);
    if (newTodo.todo.trim()===""){
        alert("заполните поле!")
        return;
    }
   await fetch(API,{
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8",
        },
    })
    inpAdd.value = "";  
    getTodos()
})
getTodos()


// ! SEARCH
inp.addEventListener("input", () => {
    // console.log("INPUT");
    getTodos()
})


//! PAGGINATION 

let pagination = document.getElementById("paggination")






let list = document.getElementById("list")
// console.log(list);
async function getTodos(){
    let response = await fetch(`${API}?q=${inp.value}&_page=${page}&_limit=${limit}`)
    .then((res)=>res.json())
    
    let allTodos = await fetch(API).then((res)=>res.json()).catch((e)=>console.log(e))

    let lastPage = Math.ceil(allTodos.length / 2)-1
    console.log(lastPage);
    // console.log(response);
    list.innerHTML = ""
    response.forEach(element => {
        let newElem = document.createElement("div")
        newElem.id = element.id
        newElem.innerHTML = `
        <span>${element.todo}</span>
        <button class = "btn-delete">Delete</button>
        <button class = "btn-edit">Edit</button>
        `

        list.append(newElem)
        // console.log(newElem);
    });

    // Добавляем паггинацию 
    console.log(page);
    pagination.innerHTML = `
    <button ${page === 1 ? "disabled" : ""} id="btn-prev">Назад</button>
 <span>${page}</span>
 <button ${page === lastPage ? "disabled" : ""} id="btn-next">Вперед</button>`


//     <button ${page === 1 ? "disabled" : ""} id="btn-prev">Назад</button>
// <span>${page}</span>
// <button ${page === lastPage ? disabled : ""} id="btn-next">Вперед</button>

    console.log(lastPage);
}





// ! DELETE
document.addEventListener("click", async (e)=>{
if (e.target.className == "btn-delete"){
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`,{
        method: "DELETE"
    })
    getTodos();
}

})

// ! UPDATE


document.addEventListener("click", async (e)=>{
    if (e.target.className == "btn-edit"){
        modalEdit.style.display = 'flex'
        let id = e.target.parentNode.id;

        let response = await fetch(`${API}/${id}`).then((res)=>res.json()).catch((err)=>console.log(err))

        inpEditTodo.value = response.todo
        inpEditTodo.className = response.id
        // console.log(response);
            
        }
        
        //! Paginate
        if(e.target.id==="btn-next"){
            page++
            getTodos()
        }
        else if(e.target.id==="btn-prev"){
            page--
            getTodos()
        }
    })

let modalEdit = document.getElementById("modal-edit")
let modalEditClose = document.getElementById("modal-edit-close")
let inpEditTodo = document.getElementById("inp-edit-todo")
let btnSaveEdit = document.getElementById("btn-save-edit")

btnSaveEdit.addEventListener("click",async (e)=>{
    if (inpEditTodo.value.trim()===""){
        alert("заполните поле!")
        return;
    }
    
    let editedTodo = {
        todo: inpEditTodo.value,
    };
    // let id = e.target.parentNode.id;
    let id = inpEditTodo.className
    await fetch(`${API}/${id}`,{
        method: "PATCH",
        body: JSON.stringify(editedTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8",
            
        },
    })
    modalEdit.style.display = 'none'
    
    getTodos()
})
modalEdit.style.display = "none"
getTodos()

modalEditClose.addEventListener('click',()=>{
    modalEdit.style.display = 'none'
})


