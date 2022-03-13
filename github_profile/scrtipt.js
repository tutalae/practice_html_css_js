const APIURL = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    const repos = await axios(APIURL + username + '/repos?sort=pushed');
    addRepos(repos.data);
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard('User not found');
    } else {
      createErrorCard(err.name + ': ' + err.message);
    }
  }
}

function addRepos(repos) {
  const reposElement = document.getElementById('repos');

  repos.slice(0, 5).forEach((repo) => {
    const repoElement = document.createElement('a');
    repoElement.classList.add('repo');
    repoElement.href = repo.html_url;
    repoElement.target = '_blank';
    repoElement.innerText = repo.name;

    reposElement.appendChild(repoElement);
  });
}

function createUserCard(user) {
  const cardHTML = `
  <div class="card">
    <div>
        <img class="avatar" src="${user.avatar_url}" alt="${user.login} avatar" />
    </div>
    <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio ? user.bio : ''}</p>

        <ul>
        <li>${user.followers} <strong>followers</strong></li>
        <li>${user.following} <strong>following</strong></li>
        <li>${user.public_repos} <strong>repositories</strong></li>
        </ul>

        <div id="repos">
        </div>
    </div>
  </div>`;

  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
      <h1>${msg}</h1>
    </div>`;

  main.innerHTML = cardHTML;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
});
