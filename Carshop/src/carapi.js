export const fetchCras = () => {
    fetch('https://carrestapi.herokuapp.com/cars')
    .then(response => {
        if (!response.ok)
            throw new Error("Something went wrong: " + response.statusText);

        return response.json();
    })
    .catch(err => console.error(err))
}
