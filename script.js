document.addEventListener('DOMContentLoaded', function() {
  const bookingForm = document.getElementById('booking-form');
  const contactForm = document.getElementById('contact-form');
  let bookingErrorModal, bookingSuccessModal, contactErrorModal, contactSuccessModal;

  // Initialize modals
  if (bookingForm) {
    bookingErrorModal = new bootstrap.Modal(document.getElementById('bookingErrorModal'));
    bookingSuccessModal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));
  }
  if (contactForm) {
    contactErrorModal = new bootstrap.Modal(document.getElementById('contactErrorModal'));
    contactSuccessModal = new bootstrap.Modal(document.getElementById('contactSuccessModal'));
  }

  function validateName(name) {
    if (!name) return { valid: false, message: 'Name is required.' };
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) return { valid: false, message: 'Name cannot contain numbers or special characters.' };
    return { valid: true };
  }

  function validateEmail(email) {
    if (!email) return { valid: false, message: 'Email is required.' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address (e.g., example@domain.com).' };
    return { valid: true };
  }

  function validatePhone(phone) {
    if (!phone) return { valid: true }; // Phone is optional
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(phone)) return { valid: false, message: 'Please enter a valid phone number (7-15 digits, e.g., +26774111028).' };
    return { valid: true };
  }

  function validateDate(date) {
    if (!date) return { valid: true }; // Date is optional
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) return { valid: false, message: 'Please enter a valid date in DD/MM/YYYY format (e.g., 30/06/2025).' };
    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) return { valid: false, message: 'Date cannot be in the past.' };
    if (dateObj.getDate() !== day || dateObj.getMonth() + 1 !== month || dateObj.getFullYear() !== year) {
      return { valid: false, message: 'Please enter a valid date.' };
    }
    return { valid: true };
  }

  function validateNumberOfPeople(people) {
    if (!people) return { valid: true }; // Number of people is optional
    const num = parseInt(people, 10);
    if (isNaN(num) || num < 1) return { valid: false, message: 'Number of people must be at least 1.' };
    return { valid: true };
  }

  function showFieldError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    const feedback = inputElement.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = message;
      feedback.style.display = 'block';
    }
  }

  function clearFieldErrors(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.remove('is-invalid');
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.style.display = 'none';
      }
    });
  }

  function showModal(modal, messageElementId, message) {
    if (messageElementId) {
      document.getElementById(messageElementId).textContent = message;
    }
    modal.show();
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function(event) {
      event.preventDefault();
      clearFieldErrors(bookingForm);

      const title = bookingForm.querySelector('#title').value;
      const name = bookingForm.querySelector('#name').value;
      const email = bookingForm.querySelector('#email').value;
      const phone = bookingForm.querySelector('#phone').value;
      const bookingType = bookingForm.querySelector('#booking-type').value;
      const date = bookingForm.querySelector('#date').value;
      const people = bookingForm.querySelector('#people').value;

      let errors = [];

      if (!title) {
        showFieldError(bookingForm.querySelector('#title'), 'Please select a title (Mma, Rra, or Other).');
        errors.push('Please select a title.');
      }

      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        showFieldError(bookingForm.querySelector('#name'), nameValidation.message);
        errors.push(nameValidation.message);
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        showFieldError(bookingForm.querySelector('#email'), emailValidation.message);
        errors.push(emailValidation.message);
      }

      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.valid) {
        showFieldError(bookingForm.querySelector('#phone'), phoneValidation.message);
        errors.push(phoneValidation.message);
      }

      if (!bookingType) {
        showFieldError(bookingForm.querySelector('#booking-type'), 'Please select a booking type.');
        errors.push('Please select a booking type.');
      }

      const dateValidation = validateDate(date);
      if (!dateValidation.valid) {
        showFieldError(bookingForm.querySelector('#date'), dateValidation.message);
        errors.push(dateValidation.message);
      }

      const peopleValidation = validateNumberOfPeople(people);
      if (!peopleValidation.valid) {
        showFieldError(bookingForm.querySelector('#people'), peopleValidation.message);
        errors.push(peopleValidation.message);
      }

      if (errors.length > 0) {
        showModal(bookingErrorModal, 'bookingErrorMessage', 'Please correct the following errors:\n- ' + errors.join('\n- '));
        return;
      }

      // Simulate form submission (e.g., API call)
      console.log('Booking Form Submitted:', { title, name, email, phone, bookingType, date, people });
      bookingForm.reset();
      showModal(bookingSuccessModal);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      clearFieldErrors(contactForm);

      const name = contactForm.querySelector('#contact-name').value;
      const email = contactForm.querySelector('#contact-email').value;
      const message = contactForm.querySelector('#message').value;

      let errors = [];

      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        showFieldError(contactForm.querySelector('#contact-name'), nameValidation.message);
        errors.push(nameValidation.message);
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        showFieldError(contactForm.querySelector('#contact-email'), emailValidation.message);
        errors.push(emailValidation.message);
      }

      if (!message) {
        showFieldError(contactForm.querySelector('#message'), 'Message is required.');
        errors.push('Message is required.');
      }

      if (errors.length > 0) {
        showModal(contactErrorModal, 'contactErrorMessage', 'Please correct the following errors:\n- ' + errors.join('\n- '));
        return;
      }

      // Simulate form submission (e.g., API call)
      console.log('Contact Form Submitted:', { name, email, message });
      contactForm.reset();
      showModal(contactSuccessModal);
    });
  }
});