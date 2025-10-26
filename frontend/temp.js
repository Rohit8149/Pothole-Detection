const name = event.target.elements['name'].value.trim();
const namePattern = /^[A-Za-z\s]+$/;
if (!namePattern.test(name) || name.length < 6) {
  alert('Name must contain only letters and be at least 6 characters long.');
  return false;
}