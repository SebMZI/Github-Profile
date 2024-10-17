const avatarProfile = document.querySelector(".container__user-details-image");
const username = document.querySelector(
  ".container__user-repos-header-username"
);
const userBio = document.querySelector(
  ".container__user-repos-header-description"
);
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const userLocation = document.getElementById("location");
const repoContainer = document.querySelector(".container__user-repos-list");
const searchValue = document.getElementById("username");
let userData = {};

function getTimeAgo(updatedAt) {
  const now = new Date();
  const updatedDate = new Date(updatedAt);

  const differenceInMs = now - updatedDate;

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `updated ${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `updated ${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `updated ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `updated just now`;
  }
}

async function getUserData(username = "github") {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    userData = await response.json();
    handleUserData(userData);
  } catch (error) {
    console.log(error);
  }
}

async function getUserRepos(userRepoLink) {
  try {
    const response = await fetch(userRepoLink);
    let userRepos = await response.json();
    handleUserRepos(userRepos);
  } catch (error) {
    console.log(error);
  }
}

function handleUserData(data) {
  avatarProfile.src = data.avatar_url || "";
  username.textContent = data.name || "";
  userBio.textContent = data.bio || "No bio...";
  followers.textContent = data.followers || 0;
  following.textContent = data.following || 0;
  userLocation.textContent = data.location || "No location";

  getUserRepos(data.repos_url);
}

function handleUserRepos(data) {
  if (data.length === 0 || data === null) {
    let noRepos = document.createElement("p");
    noRepos.textContent = "No repositories found";
    repoContainer.appendChild(noRepos);
  } else {
    data.slice(0, 4).forEach((repo) => {
      let article = document.createElement("article");
      article.classList.add("repo");
      article.innerHTML = `
       <h2 class="container__user-repos-list-item-title">${repo.name}</h2>
        <p class="container__user-repos-list-item-description">${
          repo.description
        }</p>
        <div class="container__user-repos-list-item-footer">
            <span class="container__user-repos-list-item-footer-licence"><img src="assets/Chield_alt.svg" alt="License">${
              repo.license.key
            }</span>
            <span class="container__user-repos-list-item-footer-forks"><img src="assets/Nesting.svg" alt="Forks">${
              repo.forks_count
            }</span>
            <span class="container__user-repos-list-item-footer-stars"><img src="assets/Star.svg" alt="Stars">${
              repo.stargazers_count
            }</span>
            <span class="container__user-repos-list-item-footer-updated">${getTimeAgo(
              repo.updated_at
            )}</span>
        </div>
      `;
      repoContainer.appendChild(article);
    });
  }
}

searchValue.addEventListener("change", (e) => {
  getUserData(e.target.value);
});

getUserData();
