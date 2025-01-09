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
    const {text} = option[0]
    return `
      <script>
       Swal.fire({
  title: "Are you sure?",
  text: "${text}",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
})
      </script>
    `;
  } else {
    return `
   
    `
  }
}
// function sendAlertOption(option) {
//   if (option && option.text) {
//     const {text} = option[0]
//     return `
//       <script>
//         document.addEventListener("DOMContentLoaded", function() {
//           Swal.fire({
//             title: "Are You Sure?",
//             text: "${text}",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Yes",
//             cancelButtonText: "No",
//             reverseButtons: true,
//           }).then((result) => {
//             if (result.isConfirmed) {
//               // Submit form jika konfirmasi
//               const form = document,querySelector(".delete-form")
//              if(form) form.submit();
//             } else if (result.dismiss == Swal.DismissReason.cancel) {
//               Swal.fire({
//                 title: "Cancelled",
//                 text: "Action has been cancelled.",
//                 icon: "error",
//               });
//             }
//           });
// )}
//       </script>
//     `;
//   } else {
//     return `
   
//     `
//   }
// }

module.exports = {
  sendAlert,
  sendAlertOption
};
