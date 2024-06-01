const btn = document.querySelector("#fetch-post");
const newsBox = document.querySelector("#post-container")

function fetchPosts(){
    let res = fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        newsBox.innerHTML = ' ';
        data.forEach(post => {
            let postElem = document.createElement('div');
            postElem.classList.add('post');
            postElem.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}`;
            newsBox.appendChild(postElem);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        newsBox.innerHTML = '<p>Failed to fetch posts. Please try again later.</p>';
    });
}

btn.addEventListener('click', fetchPosts);
