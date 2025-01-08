// const Swal= require("sweetalert2");

function sendAlert(messages) {
  if (messages && messages.message) {
    const { title, text, icon } = messages.message[0]
    return `
      <script>
        Swal.fire({
          title: "${title}" ,
          text: "${text}" ,
          icon: "${icon}",
        });
      </script>
    `;
   
  }else{
    return ''
  }
}

function sendAlertOption(option) {
  if (option && option.text) {
    return `
      <script>
        function confirmDelete(button) {
          Swal.fire({
            title: "Are You Sure?",
            text: "${option.text}",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // Submit form jika konfirmasi
              const form = button.closest('.delete-form');
              form.submit();
            } else {
              Swal.fire({
                title: "Cancelled",
                text: "Action has been cancelled.",
                icon: "error",
              });
            }
          });
        }
      </script>
    `;
  } else {
    return '';
  }
}

module.exports = {
  sendAlert,
  sendAlertOption
};
