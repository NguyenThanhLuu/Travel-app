function checkForName(inputText) {
    if (inputText.trim() === '' ) {
        alert("Input can't be empty!");
        return;
    }
    return inputText
}

export { checkForName }
