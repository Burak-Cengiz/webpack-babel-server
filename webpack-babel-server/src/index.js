
import { Request } from "./request";
import {UI} from "./ui";
//Elementleri seçme

const form = document.getElementById("employee-form");
const nameInput = document.getElementById("name");
const departmantInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const employeesList = document.getElementById("employees");
const updateEmployeeButton = document.getElementById("update");


const request = new Request("http://localhost:3000/employees");
const ui = new UI();

let updateState = null;

eventListeners();

function eventListeners(){
    document.addEventListener("DOMContentLoaded",getAllEmployees);
    form.addEventListener("submit",addEmploye);
    employeesList.addEventListener("click",UpdateOrDelete);
    updateEmployeeButton.addEventListener("click",updateEmployee);
}

function updateEmployee(){


    if(updateState){
        //güncelle
        const data = {name:nameInput.value.trim(),department:departmantInput.value.trim(),salary:Number(salaryInput.value.trim())};
        console.log(updateState.updateId);
        console.log(data);
        request.put(updateState.updateId,data)
        .then(updatedEmployee => {
             ui.updateEmployeeOnUI(updatedEmployee,updateState.updateParent);        
        })
        .catch(err => console.error(err));

        console.log(request.url + "/" + 2);
    }
}

function UpdateOrDelete(e){

    if(e.target.id === "delete-employee"){
        //silme
        deleteEmployee(e.target);
    }
    else if(e.target.id === "update-employee"){
        //güncelleme
        updateEmployeeController(e.target.parentElement.parentElement);
    }
}

function updateEmployeeController(targetEmployee){

    ui.toggleUpdateButton(targetEmployee);

    if(updateState === null){
        updateState = {
            updateId : targetEmployee.children[3].textContent,
            updateParent : targetEmployee
        }
    }
    else{
        updateState = null;
    }
}

function deleteEmployee(targetEmployee){
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.textContent;

    request.delete(id)
    .then(message => {
        ui.deleteEmpyloeeFromUI(targetEmployee.parentElement.parentElement);
    })
    .catch(err => console.log(err));
}

function addEmploye(e){

    const employeeName = nameInput.value.trim();
    const employeeDepartment = departmantInput.value.trim();
    const employeeSalary = salaryInput.value.trim();

    if(employeeName === "" || employeeDepartment === "" || employeeSalary === "")
    {
        alert("Lütfen tüm alanları doldurunuz!");
    }
    else{
        request.post({name:employeeName,department:employeeDepartment,salary:Number(employeeSalary)})
        .then(empyloee => {
            ui.addEmployeeToUI(empyloee);
        })
        .catch(err => console.log(err));
    }


    ui.clearInputs();
    e.preventDefault();
}

function getAllEmployees(){
    request.get()
    .then(employees => {
       ui.addAllEmployeeToUI(employees);
        
    })
    .catch(err => console.log(err));
}



// request.get()
// .then(employees => console.log(employees))
// .catch(err => console.log(err));

// request.post({name:"Serhat Say",departmant:"Pazarlama",salary:5000})
// .then(employees => console.log(employees))
// .catch(err => console.log(err));


// request.put(1,{name:"Sinan",departmant:"uçuk",salary:5000})
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

// request.delete(8)
// .then(message => console.log(message))
// .catch(err => console.log(err));

