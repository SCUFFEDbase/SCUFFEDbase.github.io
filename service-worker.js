self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('pastebin-clone-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/service-worker.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

async function syncPosts() {
  const posts = await fetch('/posts').then(response => response.json());
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '<h2>Most Recent Drops</h2>';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
    `;
    postsContainer.appendChild(postElement);
  });
}
