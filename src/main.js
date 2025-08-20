import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const mainAPI = "https://tarmeezacademy.com/api/v1"

import axios from 'axios';

const postsContainer = document.getElementById('posts-container');

let lastScroll = 0;
const navbar = document.getElementById('navbar');
const popDownNav =function(){
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    // التمرير للأسفل → اخفاء الـ navbar
    navbar.style.top = "-100px";
  } else {
    // التمرير للأعلى → اظهار الـ navbar
    navbar.style.top = "0";
  }

  lastScroll = currentScroll;
});}
popDownNav()
const showPassword = function(){
  const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');

togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
});
}
showPassword()


// get posts
const getPosts=function(){axios.get(`${mainAPI}/posts?limit=50`)
  .then(response => {
    const posts = response.data.data;

    postsContainer.innerHTML=""
    posts.forEach(post => {
      // HTML لكل منشور
      const postHTML = `
                
          <div class="card shadow rounded-4 mx-auto" style="max-width: 90%;">
            
            <div class="card-header d-flex align-items-center">
                  <img 
                  src="${post.author.profile_image || '/user-icon-icon_1076610-59410.avif'}" 
                  alt="User" 
                  class="rounded-circle me-3" 
                  width="50" 
                  height="50"
                  onerror="this.onerror=null; this.src='/user-icon-icon_1076610-59410.avif';"
                >
                
              <div>
                <h6 class="mb-0">${post.author.name}</h6>
                <small class="text-muted">${post.created_at}</small>
              </div>
            </div>

            
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">
                ${post.body}
              </p>

              <img 
              src="${post.image || '/360_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg'}" 
              class="img-fluid rounded mb-3 d-block mx-auto " 
              alt="Post Image"
              onerror="this.onerror=null; this.src='/360_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg';"
              />

              <button class="btn btn-primary"> <span>( ${post.comments_count} ) </span> Comments</button>
              ${post.tags.map(tag => `<a href="#" class="btn btn-secondary">${tag}</a>`).join('')}
            </div>
          </div>
      `;

      postsContainer.innerHTML += postHTML;
    });
  })
  .catch(error => {
    alert('Error fetching posts:', error);
  });}
  getPosts()