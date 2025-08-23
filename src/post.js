// استيراد CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import * as bootstrap from 'bootstrap';

import axios from 'axios';
import Swal from 'sweetalert2';

import {
        logInBtnModal,
        userName,
        password,
        logOutBtn,
        registerBtnNav,
        logInBtnNav,
        addPostBtn,
        regSubmitBtn,
        regUserNameInput,
        regPasswordInput,
        regnameInput,
        regPhotoInput,
        addPostSubmitBtn,
        postTitle,
        postBody,
        postImage,
      }from'./constants';

const postAPI = "https://tarmeezacademy.com/api/v1/posts/"
const loginAPI = "https://tarmeezacademy.com/api/v1/login"
const regAPI = "https://tarmeezacademy.com/api/v1/register"
const addPostAPI = "https://tarmeezacademy.com/api/v1/posts"

const postsContainer = document.getElementById('posts-container');
const navbar = document.getElementById('navbar');

      const guest = document.getElementById('guestBadge');
      const profileLink = document.getElementById("Profile")


      const logOutUI = function(){
            if(addPostBtn) addPostBtn.classList.add('d-none')
            registerBtnNav.classList.remove('d-none')
            logInBtnNav.classList.remove('d-none')
            logOutBtn.classList.add("d-none")
            guest.classList.remove('d-none');
            profileLink.classList.add("d-none");
                  

      } 

      const loginUI = function(){

        const user = JSON.parse(localStorage.getItem("user"))

      registerBtnNav.classList.add("d-none")
      logInBtnNav.classList.add("d-none")

      logOutBtn.classList.remove('d-none')

      // show add post btn

      addPostBtn.classList.remove("d-none")
      addPostBtn.classList.add("d-flex")

      guest.classList.add('d-none');
      profileLink.classList.remove("d-none")

      // add user name and photo to navbar (profile)

      const userPhoto = document.getElementById("userPhoto");
      userPhoto.src = user.profile_image || "user-icon-icon_1076610-59410.avif";
      userPhoto.onerror = () => {
        userPhoto.src = "user-icon-icon_1076610-59410.avif";
      };
      document.getElementById("userName").textContent = user.name;

      } 
      
const closeLogInModal = function(){
      const loginModalEl = document.getElementById('loginModal');
    const modal = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
    modal.hide();
    userName.value=""
    password.value=""
    userName.focus();
    document.getElementById('passwordInput').type = 'password';
    document.getElementById('togglePassword').textContent = 'Show';
}
const closeRegModal = function(){
      const registerModalEl = document.getElementById('registerModal');
    const modal = bootstrap.Modal.getInstance(registerModalEl) || new bootstrap.Modal(registerModalEl);
    modal.hide();
    regUserNameInput.value=""
    regPasswordInput.value=""
    regnameInput.value=""
    regnameInput.focus();


}
const closeAddPostModal = function(){
      const addPostModalEl = document.getElementById('addPostModal');
    const modal = bootstrap.Modal.getInstance(addPostModalEl) || new bootstrap.Modal(addPostModalEl);
    modal.hide();
    postBody.value=""
    postTitle.value=""
    postTitle.focus();
}

let lastScroll = 0;
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

const showPasswordRegister=function(){
  document.getElementById("rtogglePassword").addEventListener("click", function () {
  const passwordInput = document.getElementById("reg-Password");
  const icon = this.querySelector("i");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("bi-eye");
    icon.classList.add("bi-eye-slash");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("bi-eye-slash");
    icon.classList.add("bi-eye");
  }
});
}
showPasswordRegister()

const showPassword = function(){
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");

  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";
  });
}
showPassword()



// * ==========get post================= 
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id'); 
const token = localStorage.getItem("token")


const getPost = function() {
  if (!postId) {
    // بدلاً من console.error("No postId found in URL!");
Swal.fire({
  icon: "error",
  title: "Error",
  text: "No postId found in URL!",
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  background: "#333",
  color: "#fff"
});

    postsContainer.innerHTML = "<p class='text-danger'>Post not found.</p>";
    return;
  }

  axios.get(`${postAPI}${postId}`)
    .then((res) => {
      const post = res.data.data;
      
      
      
      let postHtml = `
        <div class="card shadow rounded-4 mx-auto mb-4" style="max-width: 90%;">
          <!-- post header -->
          <div class="card-header d-flex align-items-center">
            <img src="${post.author.profile_image || 'user-icon-icon_1076610-59410.avif'}" 
                alt="User" class="rounded-circle me-3" width="50" height="50"
                onerror="this.onerror=null; this.src='user-icon-icon_1076610-59410.avif';">
            <div>
              <h6 class="mb-0">${post.author.name}</h6>
              <small class="text-muted">${post.created_at}</small>
            </div>
          </div>
          <!-- post body -->
          <div class="card-body">
            ${post.title ? `<h5 class="card-title">${post.title}</h5>` : ""}
            <p class="card-text">${post.body}</p>
            ${post.image ? `<img src="${post.image}" class="img-fluid rounded mb-3 d-block mx-auto" alt="Post Image" onerror="this.onerror=null; this.src='/360_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg';" />` : ""}
            <div class="mb-2">
              <span id="tags-${post.id}"></span>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="card shadow rounded-4 mx-auto" style="max-width: 90%;">
          <div class="card-header">
            <h6 class="mb-0">Comments (${post.comments_count})</h6>
          </div>
          <div class="card-body">
            ${post.comments && post.comments.length > 0
              ? post.comments.map(comment => `
                <div class="d-flex mb-3">
                  <img src="${comment.author.profile_image || 'user-icon-icon_1076610-59410.avif'}" 
                      alt="User" class="rounded-circle me-3" width="50" height="50"
                      onerror="this.onerror=null; this.src='user-icon-icon_1076610-59410.avif';">
                  <div class="p-2 ps-3 pe-3 rounded shadow-sm w-100" style="background-color: #dfe1e3c1;">
                    <strong class="mb-1 fs-5 d-block">${comment.author.name}</strong>
                    <hr>
                    <p class="mb-2">${comment.body}</p>
                  </div>
                </div>
              `).join('')
              : `<p class="text-muted">No comments yet.</p>`
            }

            <!-- Add Comment Box -->
            ${token ? `
              <form id="addCommintForm">
                <textarea id="commintBody" class="form-control mb-3" placeholder="Write a comment..." rows="2"></textarea>
                <button type="button" class="btn btn-primary" onclick="addComment(event, ${postId})">Add Comment</button>
              </form>
            ` : `
              <div class="text-center">
                <small class="text-muted">Log in to comment</small>
                <a href="#" class="ms-1" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
                <span>|</span>
                <a href="#" data-bs-toggle="modal" data-bs-target="#registerModal">Register</a>
              </div>
            `}
          </div>
        </div>
      `;

      postsContainer.innerHTML = postHtml;

      // إضافة tags
      const tagsEl = document.getElementById(`tags-${post.id}`);
      tagsEl.innerHTML = post.tags.map(tag => `
        <button class="btn btn-sm rounded-5" style="background-color: rgba(203, 207, 207, 1); color: rgba(56, 55, 55, 1); padding: 5px 10px;">
          ${tag.name}
        </button>
      `).join('');

      // إخفاء preloader
      preloader.classList.add("hidden");


    });
};

getPost();

// * ==========get post================= 

window.addEventListener("load", getPost);




  logInBtnModal.addEventListener("click",function(e){
    e.preventDefault()
    let config = {
      username: userName.value,
      password: password.value
    }

    axios.post(loginAPI,config)
    .then((res)=>{
      const token = res.data.token
      const user = JSON.stringify(res.data.user)

      // save token

      localStorage.setItem("token",token)
      localStorage.setItem("user",user)

      // close modal
      closeLogInModal()

      // change nav btns

      loginUI()
      
      window.location.reload();
      // alert successes

      Swal.fire({
  toast: true,
  icon: 'success',
  title: 'Logged in',
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  background: '#333',
  color: '#fff',
  customClass: {
    popup: 'small-toast'
  }
});
    })
    .catch(err=>{
      Swal.fire({
        toast: true,
        icon: 'error',
        title: err.response?.data?.message || 'Something went wrong!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
    })
  })

logOutBtn.addEventListener("click", function () {
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to log out?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, log out',
    cancelButtonText: 'Cancel',
    background: '#1e1e2f',
    color: '#fff',
    confirmButtonColor: '#4e9af1',
    cancelButtonColor: '#f44336',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // 🟢 تنفيذ تسجيل الخروج
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      logOutUI()
      window.location.reload();
      // ✅ Toast مودرن
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Logged out successfully',
        showConfirmButton: false,
        timer: 2000,
        background: '#2b2b3c',
        color: '#fff',
        customClass: { popup: 'animate__animated animate__fadeInUp small-toast' }
      });
    }
  });
});


  const setUpUI = function(){

    const token = localStorage.getItem("token")

    if(token){

      loginUI()

    }else{

      logOutUI()

    }
  }
  setUpUI()


  regSubmitBtn.addEventListener("click",function(e){
    e.preventDefault()

    // عرض التوست (loading)
function showLoadingToast() {
  Swal.fire({
    title: 'Loading...',
    text: 'Please wait',
    toast: true,
    position: 'top-end',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    }
  });
}

// إغلاق التوست
function dismissLoadingToast() {
  Swal.close();
}



    
    let formData = new FormData()
    formData.append("username",regUserNameInput.value)
    formData.append("password",regPasswordInput.value)
    formData.append("name",regnameInput.value)
    if(regPhotoInput.files[0]){
    formData.append("image",regPhotoInput.files[0])
    }
    
    showLoadingToast()
    regSubmitBtn.disabled = true
    axios.post(regAPI,formData,{

      "Content-Type":"multipart/form-data"
    })
    .then((res)=>{
      const token = res.data.token
      const user = JSON.stringify(res.data.user)

      // save token

      localStorage.setItem("token",token)
      localStorage.setItem("user",user)




      // close modal
      closeRegModal()

      // change nav btns

      loginUI()
      window.location.reload();
      // alert successes

      Swal.fire({
  toast: true,
  icon: 'success',
  title: 'New User Register Success',
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  background: '#333',
  color: '#fff',
  customClass: {
    popup: 'small-toast'
  }
});
    })
    .catch(err=>{
      Swal.fire({
        toast: true,
        icon: 'error',
        title: err.response?.data?.message || 'Something went wrong!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
    }).finally(()=>{
      dismissLoadingToast()
      regSubmitBtn.disabled = false
    })
  })


  addPostSubmitBtn.addEventListener("click",function(e){
    e.preventDefault()

    const token = localStorage.getItem("token")

    // عرض التوست (loading)
function showLoadingToast() {
  Swal.fire({
    title: 'Loading...',
    text: 'Please wait',
    toast: true,
    position: 'top-end',
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading()
    }
  });
}
// إغلاق التوست
function dismissLoadingToast() {
  Swal.close();
}

    let formData = new FormData()
    formData.append("title",postTitle.value)
    formData.append("body",postBody.value)
    if(postImage.files[0]){
    formData.append("image",postImage.files[0])
    }
    
    const loder = showLoadingToast()
    addPostSubmitBtn.disabled = true
    axios.post(addPostAPI,formData,{
      headers:{
              "Authorization":`Bearer ${token} `,
              "Content-Type":"multipart/form-data"
              }

    })
    .then((res)=>{

      console.log(res);
      

      // close modal
      closeAddPostModal()
      
      window.location.href="/index.html"


      Swal.fire({
  toast: true,
  icon: 'success',
  title: 'New User Register Success',
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  background: '#333',
  color: '#fff',
  customClass: {
    popup: 'small-toast'
  }
});
    })
    .catch(err=>{
      Swal.fire({
        toast: true,
        icon: 'error',
        title: err.response?.data?.message || 'Something went wrong!',
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
    }).finally(()=>{
      addPostSubmitBtn.disabled = false
      loder.close()
    })
    
  })


// todo ========== make commint request (axios) ================= 
const addCommintAPI = `https://tarmeezacademy.com/api/v1`;

// 🔹 Helper for dark toast
function showToast(icon, title, time = 2000) {
  Swal.fire({
    toast: true,
    icon,
    title,
    position: 'top-end',
    showConfirmButton: false,
    timer: time,
    timerProgressBar: true,
    background: '#2b2b3c', // dark background
    color: '#fff',         // white text
    customClass: { popup: 'small-toast' }
  });
}

window.addComment = function (e, postId) {
  e.preventDefault();

  const commentBody = document.getElementById("commintBody");
  if (!commentBody || !commentBody.value.trim()) {
    showToast("warning", "Please write a comment first.");
    return;
  }

  if (!postId) {
    showToast("error", "Post ID is missing.");
    return;
  }

  // Show loading
  Swal.fire({
    toast: true,
    title: "Sending...",
    position: "top-end",
    showConfirmButton: false,
    allowOutsideClick: false,
    background: "#2b2b3c",
    color: "#fff",
    didOpen: () => Swal.showLoading()
  });

  const body = { body: commentBody.value.trim() };

  axios.post(`${addCommintAPI}/posts/${postId}/comments`, body, { 
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
  .then((res) => {
    Swal.close(); 
    showToast("success", "Comment posted successfully.");
    commentBody.value = "";
    getPost(); 
  })
  .catch((err) => {
    Swal.close();
    showToast("error", "Failed to post comment.");
  });
};


      // todo ========== make commint request (axios) ================= 