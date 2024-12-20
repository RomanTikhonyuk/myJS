const URL = 'http://localhost:8080/api';

let roles = [];

// Получение всех пользователей, используем loadTable
function getAllUsers() {
    fetch(`${URL}/users`)
        .then(res => res.json())
        .then(data => {
            loadTable(data)
        })
}

// Загрузка таблицы с пользователями
function loadTable(listAllUsers) {
    let res = ``;

    for (let user of listAllUsers) {
        res +=
            `<tr id="row" >
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
              
<!--                <td>${user.authorities.map(role => role.name.substring(5).concat(" ")).toString().replaceAll(",", "")} Пустая таблица</td>-->
<!--                <td>${user.roles.toString()} Пустая таблица </td> -->
<!--                <td>${user.roles}</td> Работает, undefined в Роли -->
<!--                <td>${user.authorities} Работает, Обьект в Роли </td>-->  
                 
                <td>
                    <button id="button-edit" class="btn btn-sm btn-primary" type="button"
                    data-bs-toggle="modal" href="#editModal"
                    onclick="editModal(${user.id})">Изменить</button></td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button"
                    data-bs-toggle="modal" data-bs-target="#deleteModal"
                    onclick="deleteModal(${user.id})">Удалить</button></td>
            </tr>`
    }
    document.getElementById('admin_panel').innerHTML = res;

}

// Получение всех ролей, используем loadRole
function getAllRoles() {
    fetch(`${URL}/users/roles/`)
        .then(res => res.json())
        .then(data => {
            loadRole(data);
            roles = data;
        })
}

// Загрузка ролей
function loadRole(listAllRoles) {
    let res = ``;

    for (let role of listAllRoles) {
        res +=
            `<option value=${role.id}>${role.name}</option>`
    }
    document.getElementById('rolesNew').innerHTML = res;

}

// Новый юзер
function newUserTab() {
    document.getElementById('rolesNew').value
    document.getElementById('newUserForm').addEventListener('submit', (e) => {
        e.preventDefault()

        fetch('http://localhost:8080/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: document.getElementById('usernameNew').value,
                email: document.getElementById('emailNew').value,
                password: document.getElementById('passwordNew').value,
                roles: roles.filter(elem => elem.id === Number(document.getElementById('rolesNew').value)),



            })
        })
            .then((response) => {
                if (response.ok) {
                    document.getElementById('usernameNew').value = '';
                    document.getElementById('emailNew').value = '';
                    document.getElementById('passwordNew').value = '';
                    document.getElementById('rolesNew').value = '';
                    document.getElementById('users-tab').click()

                    getAllUsers();

                }
            })
    })

}

// Закрытие окна
function closeModal() {
    document.querySelectorAll(".btn-close").forEach((btn) => btn.click())
}

// Окно изменения
function editModal(id) {
    let editId = `${URL}/${id}`;
    fetch(`http://localhost:8080/api/users/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'

        }
    }).then(res => {
        res.json().then(user => {
            document.getElementById('editId').value = user.id;
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPassword').value = user.password;
            let res = ``;

            for (let role of roles) {
                res += user.roles[0].id === role.id ?

                    `<option value=${role.id} selected>${role.name}</option>`
                    : `<option value=${role.id}>${role.name}</option>`
            }
            document.getElementById('editRole').innerHTML = res;
        })
    });

}

// Изменяем юзера
async function editUser() {
    let idValue = document.getElementById('editId').value;
    let usernameValue = document.getElementById('editUsername').value;
    let emailValue = document.getElementById('editEmail').value;
    let passwordValue = document.getElementById('editPassword').value;
    let role = roles.filter(elem => elem.id === Number(document.getElementById('editRole').value));


    let user = {
        id: idValue,
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        roles: role
    }
    await fetch(`http://localhost:8080/api/users`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(user)
    });

    closeModal()
    getAllUsers()

}

// Окно удаления
function deleteModal(id) {
    fetch(`http://localhost:8080/api/users/${id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(user => {
            document.getElementById('deleteId').value = user.id;
            document.getElementById('deleteUsername').value = user.username;
            document.getElementById('deleteEmail').value = user.username;
            document.getElementById('deleteRoles').value = user.authorities;
        })
    });
}

// Удаление
async function deleteUser() {
    const id = document.getElementById('deleteId').value
    let urlDel = `${URL}/${id}`;

    let method = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`http://localhost:8080/api/users/${id}`, method).then(() => {
        closeModal()
        getAllUsers()
    })

}
getAllUsers();
getAllRoles();