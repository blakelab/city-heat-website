const dateInput = document.getElementById('event-date');
const eventForm = document.getElementById('event-inquiry-form');
const submitButton = eventForm.querySelector('button[type="submit"]');
const formStatus = document.getElementById('form-status');

dateInput.min = new Date().toISOString().split('T')[0];

eventForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(eventForm);

  if (formData.get('website')) return;

  const services = formData.getAll('services');
  const templateParams = Object.fromEntries(formData.entries());
  templateParams.services = services.length ? services.join(', ') : 'Not specified';
  delete templateParams.website;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  formStatus.textContent = 'Sending your event inquiry…';

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_bu59jqs',
        template_id: 'template_810u5od',
        user_id: '9ivR2MpXCbuc_feQj',
        template_params: templateParams
      })
    });

    if (!response.ok) throw new Error(await response.text());

    window.location.href = 'thank-you.html';
  } catch (error) {
    console.error('Event inquiry submission failed:', error);
    formStatus.textContent = 'We could not send your inquiry. Please try again or email support@twelfthandarlington.com.';
    submitButton.disabled = false;
    submitButton.textContent = 'Request My Proposal';
  }
});
