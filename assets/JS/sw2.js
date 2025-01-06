const hbs= require("hbs");

function sendAlert() {
  hbs.registerHelper("sweetAlert", (type, message) => {
    return hbs.safeString(`
    <script>
            Swal.fire({
  title: "Oops!",
  text: '${message}',
  icon: "${type}"
});
</script>
`);
  });
}

module.exports = {
  sendAlert,
};
