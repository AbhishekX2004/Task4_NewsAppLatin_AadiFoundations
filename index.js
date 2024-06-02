const postBtn = document.querySelector("#fetch-post");
const Box = document.querySelector("#post-container");

// asynchronous function to fetch data from the given url
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// asynchronous function to fetch posts
async function fetchPosts() {
    try {

        // fetching users and posts list
        const [posts, users] = await Promise.all([
            fetchData("https://jsonplaceholder.typicode.com/posts"),
            fetchData("https://jsonplaceholder.typicode.com/users")
        ]);

        // creating a map from users array
        const userMap = Object.fromEntries(users.map(user => [user.id, user]));

        Box.innerHTML = '';     // reseting the Box
        posts.forEach(post => {
            const user = userMap[post.userId];
            const postElem = createPostElement(post, user);
            postElem.addEventListener('click', () => fetchComments(post.id));   //event listener for each post
            Box.appendChild(postElem);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        Box.innerHTML = '<p>Failed to fetch posts. Please try again later.</p>';
    }
}

// asynchronous function to fetch comments
async function fetchComments(postId) {
    try {

        // fetching the particular post and its comments
        const [post, comments] = await Promise.all([
            fetchData(`https://jsonplaceholder.typicode.com/posts/${postId}`),
            fetchData(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        ]);

        // fetching the details of the user who posted the post
        const userData = await fetchData(`https://jsonplaceholder.typicode.com/users/${post.userId}`);

        Box.innerHTML = '';     // reseting the Box
        const postElem = createPostElement(post, userData);
        Box.appendChild(postElem);

        // heading for comment
        const comHead = document.createElement('h2');
        comHead.innerHTML = "Comments :- "
        comHead.classList.add("zoom-in");
        Box.appendChild(comHead);

        comments.forEach(comment => {
            const commentElem = createCommentElement(comment);
            Box.appendChild(commentElem);
        });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        Box.innerHTML = '<p>Failed to fetch data. Please try again later.</p>';
    }
}

// function to create a post object
function createPostElement(post, user) {
    const postElem = document.createElement('div');
    postElem.classList.add('post');
    postElem.innerHTML = `
        <h2>${post.title}</h2>
        <h3>Author: ${user.username}</h3>
        <p><b>Email:</b> ${user.email}</p>
        <p>${post.body}</p>
        <hr/>
        `;
    setTimeout(() => {
        postElem.classList.add('zoom-in');
    }, 100);
    return postElem;
}

// function to create a comment object
function createCommentElement(comment) {
    const commentElem = document.createElement('div');
    commentElem.classList.add('comment');
    commentElem.innerHTML = `
        <h3>${comment.name}</h3>
        <p><b>Email: </b>${comment.email}</p>
        <p>${comment.body}</p>`;

    setTimeout(() => {
        commentElem.classList.add('zoom-in');
    }, 100);
    return commentElem;
}

postBtn.addEventListener('click', fetchPosts);