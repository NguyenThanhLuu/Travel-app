function handleSubmit(event) {
    event.preventDefault()
    let formText = document.getElementById('name').value
    if (!Client.checkForName(formText)) {
        return;
    }
    fetch('http://localhost:8082/APIkey')
    .then(res => {
        return res.json()
    }) 
    .then((apiKey) => {
        const formData = new FormData();
        formData.append("key", apiKey.application_key);
        formData.append("txt", formText);
        formData.append("lang", 'en'); 
        const requestOptions = { 
            method: 'POST',
            body: formData,
            redirect: 'follow'
          };
        fetch("https://api.meaningcloud.com/sentiment-2.1", requestOptions)
        .then(res => {
            return res.json()
        })
        .then(function(data) {
            console.log(data)
            if (data && data.agreement) {
                document.getElementById('agreement').innerHTML = data.agreement;
                document.getElementById('confidence').innerHTML = data.confidence;
                document.getElementById('scoreTag').innerHTML = data.score_tag;
                document.getElementById('subjectivity').innerHTML = data.subjectivity;
                document.getElementById('snippet').innerHTML = data.sentence_list[0]['text'];
            }
        })
    })
    .catch((err) => console.log('Error in call Api take data detail: ',err))
    event.preventDefault()
}

export { handleSubmit }

