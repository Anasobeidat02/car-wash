


function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
}


    

// النافذة المنبثقة
function openPopup() {
  const popup = document.getElementById('popupWindow');
  if (popup) {
    popup.style.display = 'flex';
  }
}

function closePopup() {
  const popup = document.getElementById('popupWindow');
  if (popup) {
    popup.style.display = 'none';
  }
}

// إغلاق النافذة عند الضغط خارجها 
window.addEventListener('click', function (event) {
  const popup = document.getElementById('popupWindow');
  if (popup && event.target === popup) {
    closePopup();
  }
});