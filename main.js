const postForm = document.getElementById("postForm");
        const postTitle = document.getElementById("postTitle");
        const imageUrl = document.getElementById("imageUrl");
        const postContent = document.getElementById("postContent");

        const postsContainer = document.getElementById("posts");

        const formTitle = document.getElementById("formTitle");
        const submitBtn = document.getElementById("submitBtn");
        const cancelBtn = document.getElementById("cancelBtn");

        let posts = JSON.parse(localStorage.getItem("blogPosts")) || [];

        let editingPostId = null;

        function savePosts() {
            localStorage.setItem("blogPosts", JSON.stringify(posts));
        }


        function displayPosts() {

            postsContainer.innerHTML = "";

            if (posts.length === 0) {
                postsContainer.innerHTML = `
                    <div class="empty">
                        <h3>No posts yet</h3>
                        <p>Create your first blog post above.</p>
                    </div>
                `;
                return;
            }


            posts.forEach(post => {

                const article = document.createElement("article");
                article.className = "post";

                const image = post.image
                    ? `<img src="${post.image}" alt="${escapeHTML(post.title)}"
                         onerror="this.style.display='none'">`
                    : "";

                article.innerHTML = `
                    ${image}

                    <div class="post-content">

                        <h2>${escapeHTML(post.title)}</h2>

                        <p>${escapeHTML(post.content)}</p>

                        <div class="post-actions">

                            <button
                                class="edit-btn"
                                onclick="editPost(${post.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-btn"
                                onclick="deletePost(${post.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;

                postsContainer.appendChild(article);
            });
        }
        postForm.addEventListener("submit", function(event) {

            event.preventDefault();

            const title = postTitle.value.trim();
            const image = imageUrl.value.trim();
            const content = postContent.value.trim();

            if (!title || !content) {
                alert("Please enter a title and post content.");
                return;
            }

            if (editingPostId !== null) {

                const post = posts.find(
                    post => post.id === editingPostId
                );

                post.title = title;
                post.image = image;
                post.content = content;

                editingPostId = null;

                formTitle.textContent = "Add New Post";
                submitBtn.textContent = "Add Post";
                cancelBtn.style.display = "none";

            } else {

                const newPost = {
                    id: Date.now(),
                    title: title,
                    image: image,
                    content: content
                };

                posts.unshift(newPost);
            }

            savePosts();
            displayPosts();

            postForm.reset();
        });


        // Edit post
        function editPost(id) {

            const post = posts.find(post => post.id === id);

            if (!post) return;

            postTitle.value = post.title;
            imageUrl.value = post.image;
            postContent.value = post.content;

            editingPostId = id;

            formTitle.textContent = "Edit Post";
            submitBtn.textContent = "Update Post";
            cancelBtn.style.display = "inline-block";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }


        // Delete post
        function deletePost(id) {

            const confirmed = confirm(
                "Are you sure you want to delete this post?"
            );

            if (!confirmed) return;

            posts = posts.filter(post => post.id !== id);

            savePosts();
            displayPosts();
        }


        // Cancel editing
        cancelBtn.addEventListener("click", function() {

            editingPostId = null;

            postForm.reset();

            formTitle.textContent = "Add New Post";
            submitBtn.textContent = "Add Post";
            cancelBtn.style.display = "none";
        });


        // Prevent HTML injection
        function escapeHTML(text) {

            const div = document.createElement("div");

            div.textContent = text;

            return div.innerHTML;
        }


        // Initial display
        displayPosts();