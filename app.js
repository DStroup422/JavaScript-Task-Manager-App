function addTask(){

let input = document.getElementById("taskInput")
let taskText = input.value

if(taskText === "") return

let li = document.createElement("li")
li.textContent = taskText

li.onclick = function(){
li.remove()
}

document.getElementById("taskList").appendChild(li)

input.value = ""

}