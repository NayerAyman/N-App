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
        editPostModal,
        editTitle,
        editBody,
        editImage,
        editPostSubmit,
      }from'./constants';

const postsAPI = "https://tarmeezacademy.com/api/v1/posts"
const loginAPI = "https://tarmeezacademy.com/api/v1/login"
const regAPI = "https://tarmeezacademy.com/api/v1/register"
const addPostAPI = "https://tarmeezacademy.com/api/v1/posts"

const token = localStorage.getItem("token");

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

        const setUpUI = function(){

    const token = localStorage.getItem("token")

    if(token){

      loginUI()

    }else{

      logOutUI()

    }
  }
  setUpUI()


      
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
const popDownNav = () => {
    // Set navbar to visible and scroll to top on page load
    navbar.style.top = "0";
    window.scrollTo(0, 0);

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll === 0) {
            // Always show navbar when at the top of the page
            navbar.style.top = "0";
        } else if (currentScroll > lastScroll) {
            // Scrolling down → hide navbar
            navbar.style.top = "-100px";
        } else {
            // Scrolling up → show navbar
            navbar.style.top = "0";
        }

        lastScroll = currentScroll;
    });
};
popDownNav();

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

let currentPage = 1;
let lastPage = null;
let isLoading = false;
const scrollLoader = document.getElementById("scroll-loader");

// تحميل البوستات
const getPosts = function (firstLoad = false ) {
  if (isLoading) return;
  if (lastPage && currentPage > lastPage) return;

  isLoading = true;
  scrollLoader.style.display = firstLoad ? "none" : "block"; // 🔥 إظهار Loader الصغير لو مش أول تحميل

  axios.get(`${postsAPI}?page=${currentPage}&limit=10`)
    .then(response => {
      const { data: posts, meta } = response.data;
      lastPage = meta.last_page;

      // Example: Get logged-in user data (adjust to your auth system)
const token = localStorage.getItem("token");
const currentUser = token ? JSON.parse(localStorage.getItem("user")) : null; 
// user object should have an "id" field

      posts.forEach(post => {

        const safePost = encodeURIComponent(JSON.stringify(post));

        const postHTML = `
          <div class="card shadow rounded-4 mx-auto mb-4  "    style="max-width: 90%;">
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

              ${
                currentUser && currentUser.id === post.author.id
                  ? `
                    <!-- Edit Post Button -->
                    <button onclick="window.editPost('${safePost}')" id="edit-btn-${post.id}" type="button" class="btn btn-primary btn-sm shadow-sm ms-auto"
                      data-bs-toggle="modal" data-bs-target="#editPostModal">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                  `
                  : `<span id="edit-btn-placeholder-${post.id}" data-author-id="${post.author.id}" class="ms-auto"></span>`
              }
            </div>

            <div class="card-body" style="cursor: pointer;" onclick="window.location.href='/post.html?id=${post.id} '">
              ${post.title ? `<h5 class="card-title">${post.title}</h5>` : ""}
              <p class="card-text">${post.body}</p>
              ${post.image ? `
                  <img 
                      src="${post.image}" 
                      class="img-fluid rounded mb-3 d-block mx-auto" 
                      alt="Post Image"
                      onerror="this.onerror=null; this.src='/360_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg';"
                  />` : ""}
              <button class="btn btn-primary">(${post.comments_count}) Comments</button>
              <span id="tags-${post.id}"></span>
            </div>
          </div>
        `;

        postsContainer.innerHTML += postHTML;



        // تحميل التاجز
        const tagsEl = document.getElementById(`tags-${post.id}`);
        tagsEl.innerHTML = post.tags.map(tag => `
          <button 
            class="btn btn-sm rounded-5" 
            style="background-color: rgba(203, 207, 207, 1); color: rgba(56, 55, 55, 1); padding: 5px 10px;">
            ${tag.name}
          </button>
        `).join('');
      });



      currentPage++;

      // 🔥 إخفاء Preloader بعد أول تحميل
      if (firstLoad) {
        document.getElementById("preloader").classList.add("hidden");
      }

    })
    .catch(error => {
      Swal.fire({
        toast: true,
        icon: 'error',
        title: error.response?.data?.message || 'Something went wrong!',
        position: 'top-end',
        background: '#e47a7aff',
        color: '#fff',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true
      });
    })
    .finally(() => {
      isLoading = false;
      scrollLoader.style.display = "none"; 
    });
};


function updateEditButtons() {
  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(localStorage.getItem("user")) : null;

  document.querySelectorAll("[id^='edit-btn-placeholder-']").forEach((placeholder) => {
    const postId = placeholder.id.replace("edit-btn-placeholder-", "");
    const postAuthorId = placeholder.getAttribute("data-author-id");

    if (currentUser && currentUser.id == postAuthorId) {
      placeholder.outerHTML = `
        <button id="edit-btn-${postId}" type="button" class="btn btn-primary btn-sm shadow-sm ms-auto"
          data-bs-toggle="modal" data-bs-target="#editPostModal">
          <i class="bi bi-pencil-fill"></i>
        </button>
      `;
    }
  });
}

// 🔥 تحميل أول صفحة Posts
window.addEventListener("load", () => {
  getPosts(true); // أول مرة
});

// 🔥 تحميل تلقائي مع Scroll
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
    getPosts();
  }
});


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
      getPosts();
      updateEditButtons();
      setUpUI()
      


      
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


      postsContainer.innerHTML = ""; 
      currentPage = 1; 
      lastPage = null; 
      getPosts(true);
      setUpUI()


      

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



regSubmitBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("username", regUserNameInput.value);
  formData.append("password", regPasswordInput.value);
  formData.append("name", regnameInput.value);
  if (regPhotoInput.files[0]) {
    formData.append("image", regPhotoInput.files[0]);
  }

  // 🔹 Loader small dark toast
  Swal.fire({
    toast: true,
    title: "Registering...",
    position: "top-end",
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
    background: "#333",
    color: "#fff",
  });

  regSubmitBtn.disabled = true;

  try {
    const res = await axios.post(regAPI, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const token = res.data.token;
    const user = JSON.stringify(res.data.user);

    // حفظ التوكن والمستخدم
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);

    // اغلاق modal
    closeRegModal();

    // تحديث الواجهة
    setUpUI();

    // 🔹 Success small dark toast
    Swal.fire({
      toast: true,
      icon: "success",
      title: "New User Registered Successfully",
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#333",
      color: "#fff",
    });

  } catch (err) {
    // 🔹 Error small dark toast
    Swal.fire({
      toast: true,
      icon: "error",
      title: err.response?.data?.message || "Something went wrong!",
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#2d2d2d",
      color: "#fff",
    });
  } finally {
    regSubmitBtn.disabled = false;
  }
});



addPostSubmitBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire({
      toast: true,
      icon: "warning",
      title: "You must be logged in!",
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#333",
      color: "#fff",
    });
    return;
  }

  const formData = new FormData();
  formData.append("title", postTitle.value);
  formData.append("body", postBody.value);
  if (postImage.files[0]) {
    formData.append("image", postImage.files[0]);
  }

  // 🔹 Loader small dark SweetAlert
  Swal.fire({
    toast: true,
    title: "Adding post...",
    position: "top-end",
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
    background: "#333",
    color: "#fff",
  });

  addPostSubmitBtn.disabled = true;

  try {
    await axios.post(addPostAPI, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    closeAddPostModal();
    currentPage = 1;
    lastPage = null;
    postsContainer.innerHTML = "";
    postImage.value = "";
    getPosts();

    // 🔹 Success toast small dark
    Swal.fire({
      toast: true,
      icon: "success",
      title: "Post added successfully!",
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#333",
      color: "#fff",
    });

  } catch (err) {
    // 🔹 Error toast small dark
    Swal.fire({
      toast: true,
      icon: "error",
      title: err.response?.data?.message || "Something went wrong!",
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#2d2d2d",
      color: "#fff",
    });

  } finally {
    addPostSubmitBtn.disabled = false;
  }
});


window.editPost = function (postStr) {
  try {
    const post = JSON.parse(decodeURIComponent(postStr));


    editTitle.value = post.title || "";
    editBody.value = post.body || "";

    window.currentEditPostId = post.id;

  } catch (err) {
    alert("Error loading post data!",err);
  }
};

editPostSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const postAPI = "https://tarmeezacademy.com/api/v1/posts/";
  const token = localStorage.getItem("token");

  if (!window.currentEditPostId) {
    Swal.fire({
      toast: true,
      icon: "warning",
      title: "No post selected!",
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#333",
      color: "#fff"
    });
    return;
  }
      editPostSubmit.disabled = true;


  // Show small dark loading toast
  Swal.fire({
    toast: true,
    title: 'Updating...',
    position: 'top-end',
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
    background: "#333",
    color: "#fff"
  });

  const formData = new FormData();
  formData.append("title", editTitle.value);
  formData.append("body", editBody.value);
  formData.append("_method","put");

  const imageFile = editImage.files[0];
  if (imageFile) formData.append("image", imageFile);

  axios.post(`${postAPI}${window.currentEditPostId}`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then((res) => {

    // تحديث البوستات
    currentPage = 1;
    lastPage = null;
    postsContainer.innerHTML = "";
    getPosts();

    // اغلاق الـ modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editPostModal'));
    if (editModal) editModal.hide();

    // Success small dark toast
    Swal.fire({
      toast: true,
      icon: 'success',
      title: 'Post updated successfully',
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#333',
      color: '#fff'
    });
  })
  .catch((err) => {
    Swal.fire({
      toast: true,
      icon: 'error',
      title: err.response?.data?.message || 'Something went wrong!',
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#333',
      color: '#fff'
    });
  }).finally(() => {
    // إعادة تفعيل الزر بعد انتهاء الطلب
    editPostSubmit.disabled = false;
  });
});
