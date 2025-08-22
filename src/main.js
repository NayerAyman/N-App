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

const postsAPI = "https://tarmeezacademy.com/api/v1/posts?limit=50"
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


// get posts
const getPosts=function(){axios.get(`${postsAPI}`)
  .then(response => {
    const posts = response.data.data;

    postsContainer.innerHTML=""
    posts.forEach(post => {
      // HTML لكل منشور
      const postHTML = `
                
          <div class="card shadow rounded-4 mx-auto" style="max-width: 90%;">
            
            <div class="card-header d-flex align-items-center">
                  <img 
                  src="${post.author.profile_image || 'user-icon-icon_1076610-59410.avif'}" 
                  alt="User" 
                  class="rounded-circle me-3" 
                  width="50" 
                  height="50"
                  onerror="this.onerror=null; this.src='user-icon-icon_1076610-59410.avif';"
                >
                
              <div>
                <h6 class="mb-0">${post.author.name}</h6>
                <small class="text-muted">${post.created_at}</small>
              </div>
            </div>

            
            <div class="card-body">
            ${post.title?`<h5 class="card-title">${post.title}</h5>`:""}
              

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
              <span id="tags-place-${post.id}">

              </span>
            </div>
          </div>
      `;

      postsContainer.innerHTML += postHTML;

      const currentPostTagsId = `tags-place-${post.id}`
      document.getElementById(currentPostTagsId).innerHTML=""
      for(tag of post.tags){
        let tagHtml=`
        <button class="btn btn-sm rounded-5 " style="background-color: rgba(203, 207, 207, 1);color: rgba(56, 55, 55, 1); padding-right: 10px; padding-left: 10px; padding-bottom: 6px; "  > ${tag.name} </button>
        `
        document.getElementById(currentPostTagsId).innerHTML+=tagHtml
      }
    });
      const preloader = document.getElementById("preloader");;

      preloader.classList.add("hidden");
    })
    .catch(error => {
      // ✅ خطأ: برضه نخفي الـ preloader عشان ما يعلقش
      document.getElementById("preloader").classList.add("hidden");

      Swal.fire({
        toast: true,
        icon: 'error',
        title: error.response?.data?.message || 'Something went wrong!',
        position: 'top-end',
        background: '#e47a7aff', // 🔥 داكن
        color: '#fff',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
    });
};
  getPosts()



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
      
      // render posts
      getPosts()


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