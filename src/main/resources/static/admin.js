const action = {
    update: 1, delete: 2
}

$(document).ready(function () {
    adminInfo();
    getAllUsers();
    loadRoles();
});


async function adminInfo() {
    const response = await fetch('/api/users/current', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    const {id, username, password, email, roles} = await response.json();

    $('#currentUser').text(username);
    $('#roles').text(roles.map(({name}) => name.replace('ROLE_', '')).join(', '));
}

async function getAllUsers() {
    const response = await fetch('/api/users', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    const users = await response.json();
    const tbody = $('#usersTableBody');

    tbody.empty();
    users.forEach((user) => {
        const {id, username, email, roles} = user;

        tbody.append(`<tr>
        <td>${id}</td>
        <td>${username}</td>
        <td>${email}</td>
        <td>${user.authorities.map(role => role.name.substring(5).concat(" ")).toString().replaceAll(",", "")}</td>
        <td><button type="button" class="btn btn-primary" id="editButton"  onclick="openModalHandler(${action.update}, parseInt(${id}))">Edit</button></td>
        <td><button type="button" class="btn btn-danger" id="deleteButton" onclick="openModalHandler(${action.delete}, ${id})">Delete</button></td>
        </tr>`)

    });
}

async function loadRoles() {

    const response = await fetch('/api/users/roles', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });


    const roles = await response.json();

    console.log(roles);

    const options = roles.map(role =>
        `<option data-id="${parseInt(role.id)}" data-name="${role.name}" data-authority="${role.authority}">
                ${role.name.replace('ROLE_', '')} </option>`);
    $('#role').append(options);
    $('#editRoles').append(options);
}


document.getElementById('addUserForm').addEventListener('submit', e => {
    e.preventDefault();

    saveUser();

    async function saveUser() {

        let addRoles = [];
        let options = document.getElementById('role').options;

        for (let opt of options) {
            if (opt.selected) {
                let id = parseInt(opt.getAttribute('data-id'));
                let name = opt.getAttribute('data-name');
                let authority = opt.getAttribute('data-authority');
                addRoles.push({id, name, authority});
            }
        }

        console.log(addRoles);

        const newUser = JSON.stringify({
            username: $('#username').val(),
            password: $('#password').val(),
            email: $('#email').val(),
            roles: addRoles
        });

        console.log(newUser);


        await fetch('api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newUser
        }).then(() => {
            $('#addUserForm')[0].reset();
            getAllUsers();
            $('#adminUsersTable').click();
        })
    }
});

async function openModalHandler(actionId, userId = null) {

    const modal = $('#editUserModal');

    modal.modal();

    const modalFields = modal.find('.mb-3');
    const idField = modalFields.children('#editUserId').first();

    const emailField = modalFields.children('#editEmail').first();
    const usernameField = modalFields.children('#editUsername').first();
    const passwordField = modalFields.children('#editPassword').first();
    const rolesField = modalFields.children('#editRoles').first();
    const submitBtn = $('#submitEdit');
    const modalLabel = $('#editUserModalLabel');

    const {id, username, email, password} = await getUser(userId);

    idField.val(id);
    idField.parent().prop('hidden', false);
    emailField.val(email).prop('disabled', false);
    usernameField.val(username).prop('disabled', false);
    passwordField.val(password).prop('disabled', false);

    switch (actionId) {
        case action.delete:
            modalLabel.text('Delete user');
            submitBtn
                .removeClass()
                .addClass('btn btn-danger')
                .text('Delete')
                .off('click')
                .click(() => submitBtnHandler(deleteUser));
            emailField.prop('disabled', true);
            usernameField.prop('disabled', true);
            passwordField.prop('disabled', true);
            rolesField.prop('disabled', true);
            break;
        case action.update:
            modalLabel.text('Edit user');
            submitBtn
                .removeClass()
                .addClass('btn btn-primary')
                .text('Save changes')
                .off('click')
                .click(() => submitBtnHandler(editUser));
            break;
    }
}

async function getUser(userId) {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET', headers: {'Content-Type': 'application/json'}
    });

    return response.json();
}


function collectUserData() {
    const modalFields = $('#editUserModal').find('.mb-3');

    const idField = modalFields.children('#editUserId').first();
    const emailField = modalFields.children('#editEmail').first();
    const usernameField = modalFields.children('#editUsername').first();
    const passwordField = modalFields.children('#editPassword').first();
    const rolesField = modalFields.children('#editRoles').first();


    const user = {
        roles: []
    };

    if (idField.val()) {
        user.id = parseInt(idField.val());
    }


    if (emailField.val()) {
        user.email = emailField.val();
    }

    if (usernameField.val()) {
        user.username = usernameField.val();
    }

    if (passwordField.val()) {
        user.password = passwordField.val();
    }

    let addRoles = [];
    let options = document.getElementById('editRoles').options;

    for (let opt of options) {
        if (opt.selected) {
            let id = parseInt(opt.getAttribute('data-id'));
            let name = opt.getAttribute('data-name');
            let authority = opt.getAttribute('data-authority');
            addRoles.push({id, name, authority});
        }
    }

    user.roles = addRoles;

    console.log("Collect " + user);
    return user;
}

async function submitBtnHandler(callback) {
    const modal = $('#editUserModal');
    const user = collectUserData();
    const userId = user.id;
    console.log(userId);
    console.log(user);

    modal.modal('hide');
    await callback(user);
    await getAllUsers();
}

const deleteUser = async ({id}) => fetch(`/api/users/${id}`, {
    method: 'DELETE', headers: {'Content-Type': 'application/json'}
});

const editUser = async (user) => fetch(`/api/users`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(user)
});