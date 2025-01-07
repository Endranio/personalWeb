// document.addEventListener("DOMContentLoaded", function () {
//   const deleteButtons = document.querySelectorAll(".btn-delete");

//   deleteButtons.forEach((button) => {
//     button.addEventListener("click", function (e) {
//       e.preventDefault();

//       const form = this.closest("form");

//       Swal.fire({
//         title: "Are you sure?",
//         text: "This action cannot be undone!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "Cancel",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           Swal.fire({
//             title: "Deleted!",
//             text: "Your file has been deleted.",
//             icon: "success"
//           }).then((ok) =>{
//             if (ok.isConfirmed){form.submit()}
//           })
//         }
//       });
//     });
//   });
// })