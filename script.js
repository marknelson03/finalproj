const API_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        renderPosts(posts.slice(0, 10)); // Limiting to 10 posts for better UX
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function renderPosts(posts) {
    const postList = document.getElementById('post-list');
    postList.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button class="edit-btn" data-id="${post.id}" data-title="${post.title}" data-body="${post.body}">Edit</button>
            <button class="delete-btn" data-id="${post.id}">Delete</button>
        `;
        postList.appendChild(postEl);
    });
}

async function handleAddPost(event) {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const body = document.getElementById('body').value.trim();

    if (!title || !body) {
        alert('Both fields are required.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 }),
        });

        if (!response.ok) throw new Error('Failed to add post');

        const newPost = await response.json();

        const postList = document.getElementById('post-list');
        const postEl = document.createElement('div');
        postEl.classList.add('post');
        postEl.innerHTML = `
            <h3>${newPost.title}</h3>
            <p>${newPost.body}</p>
            <button class="edit-btn" data-id="${newPost.id}" data-title="${newPost.title}" data-body="${newPost.body}">Edit</button>
            <button class="delete-btn" data-id="${newPost.id}">Delete</button>
        `;
        postList.prepend(postEl);

        alert('Post added successfully!');
        document.getElementById('add-post-form').reset(); // Clear the form
    } catch (error) {
        console.error('Error adding post:', error);
    }
}

async function handleEditPost(event) {
    if (event.target.classList.contains('edit-btn')) {
        const postId = event.target.dataset.id;
        const currentTitle = event.target.dataset.title;
        const currentBody = event.target.dataset.body;

        const newTitle = prompt('Edit Title:', currentTitle) || currentTitle;
        const newBody = prompt('Edit Content:', currentBody) || currentBody;

        try {
            const response = await fetch(`${API_URL}/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, body: newBody, userId: 1 }),
            });

            if (!response.ok) throw new Error('Failed to edit post');

           
            const postElement = document.querySelector(`button[data-id="${postId}"]`).parentElement;
            postElement.querySelector('h3').textContent = newTitle;
            postElement.querySelector('p').textContent = newBody;

            alert('Post updated successfully!');
        } catch (error) {
            console.error('Error editing post:', error);
        }
    }
}

async function handleDeletePost(event) {
    if (event.target.classList.contains('delete-btn')) {
        const postId = event.target.dataset.id;

        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`${API_URL}/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete post');

            alert('Post deleted successfully!');
            fetchPosts(); // Refresh posts
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
}

document.getElementById('add-post-form').addEventListener('submit', handleAddPost);
document.getElementById('post-list').addEventListener('click', (event) => {
    handleEditPost(event);
    handleDeletePost(event);
});
fetchPosts();
