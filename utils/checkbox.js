function isChecked(value, array) {
    return array && array.includes(value) ? "checked" : "";
  }

  module.exports={
    isChecked
  }

  