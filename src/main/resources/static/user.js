document.addEventListener('DOMContentLoaded', async function () {
    // await usersNavbar()
    await usersTable();
});

async function dataAboutCurrentUser() {
    const response = await fetch("/api/users/current")
    return await response.json();
}

async function usersTable() {
    const currentUserTable = document.getElementById("currentUserTable");
    const currentUser = await dataAboutCurrentUser();

    let currentUserTableHTML = "";
    currentUserTableHTML +=
        `<tr>
            <td>${currentUser.id}</td>
            <td>${currentUser.username}</td>
            <td>${currentUser.email}</td>
            <td>${currentUser.authorities.map(role => role.name.substring(5).concat(" ")).toString().replaceAll(",", "")}</td>
        </tr>`
    userTable.innerHTML = currentUserTableHTML;

    //Вошедший пользователь
    async function usersNavbar() {
        const currentUserEmailNavbar = document.getElementById("currentUserEmailNavbar")
        const currentUser = await dataAboutCurrentUser();
        currentUserEmailNavbar.innerHTML =
            `<strong>${currentUser.username}</strong>
                 with roles: 
                 ${currentUser.authorities.map(role => role.name.substring(5).concat(" ")).toString().replaceAll(",", "")}`;
    }
}

