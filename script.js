const SearchElement = document.getElementById("Search");
const BlocsListe = document.querySelectorAll(".block");

SearchElement.addEventListener("input", () => {
    const SearchingText = SearchElement.value.toLowerCase();

    BlocsListe.forEach((bloc) => {
        const ContentText = bloc.textContent.toLowerCase();
        const Correspond = ContentText.includes(SearchingText);

        bloc.classList.toggle("Hide", !Correspond);
    })
})