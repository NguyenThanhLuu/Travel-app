const checkEmptyField = (inputText) => {
  if (inputText.trim() === "") {
    alert("All fields must be filled!");
    return;
  }
  return inputText;
}

export { checkEmptyField };
