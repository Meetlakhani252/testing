const form = document.getElementById('profileForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    gender: document.getElementById('gender').value,
    country: document.getElementById('country').value,
    address: document.getElementById('address').value,
  };

  // Save data temporarily
  localStorage.setItem('userProfile', JSON.stringify(userData));

  // Show success message
  successMessage.style.display = 'block';

  // Reset form after submit
  form.reset();
});
