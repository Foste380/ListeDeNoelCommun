//setup
const SearchElement = document.getElementById("Search");
const BlocsListe = document.querySelectorAll(".block");

const BtnLogin = document.getElementById("BtnLogIn");
const LoginText = document.getElementById("LogInText");

const BtnLogout = document.getElementById("LogOut");

const LogObjectListe = document.querySelectorAll(".Loged");
const UnlogObjectListe = document.querySelectorAll(".Unloged");

const URLDataBase = "https://script.google.com/macros/s/AKfycbxGsb3fJU-0y59mcavJB3gKq_9aLSW9f0RsgBxgKEnZkZie4k1SChpa4O0vcukp-R5bLA/exec";
const SessionKey = "SessionCadeauListe"

var UserName;
var FamilyName;

//OnLoad
document.addEventListener("DOMContentLoaded", () => {

    const ActualSession = FindActualSession();

    if (ActualSession && ActualSession.Nom) {
        UserName = ActualSession.Nom;
    }

    const IsLog = !(UserName == null || UserName == "");

    LogObjectListe.forEach((bloc) => {
        bloc.classList.toggle("Hide", !IsLog);
    })
    UnlogObjectListe.forEach((bloc) => {
        bloc.classList.toggle("Hide", IsLog);
    })
})

//Fonctionnement bar de recherche
if (SearchElement) {
    SearchElement.addEventListener("input", () => {
        const SearchingText = SearchElement.value.toLowerCase();

        BlocsListe.forEach((bloc) => {
            const ContentText = bloc.textContent.toLowerCase();
            const Correspond = ContentText.includes(SearchingText);

            bloc.classList.toggle("Hide", !Correspond);
        })
    })
}

//Fonctionnement du Log html
if (BtnLogin && LoginText) {
    BtnLogin.addEventListener("click", () => {
        const saisi = LoginText.value.trim();

        if (saisi === "") {
            alert("il faut remplir le champ au dessus");
            return;
        }

        FindAccount(saisi);
    })

    LogInText.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            BtnLogin.click();
        }
    });
}

//Fonction du Logout
if (BtnLogout) {
    BtnLogout.addEventListener("click", () => {
        UserName = "";
        FamilyName = "";
        localStorage.removeItem(SessionKey);

        window.location.replace("LogScreen.html");
    })
}

//Trouver la Session
function FindActualSession() {
    const Brut = localStorage.getItem(SessionKey);

    if (!Brut) {
        return null;
    }

    try {
        return JSON.parse(Brut);
    } catch {
        localStorage.removeItem(SessionKey);
        return null
    }
}

//Fonction LogIn
async function FindAccount(UserTry) {
    try {
        const Respond = await fetch(`${URLDataBase}?Page=AccountList`)
        const Data = await Respond.json();
        const Scale = Data.length;

        for (let i = 0; i < Scale; i++) {
            if (Data[i].Nom == UserTry) {
                const LocalChange = {
                    Nom: UserTry
                };
                localStorage.setItem(SessionKey, JSON.stringify(LocalChange));
                window.location.replace("Index.html");
                return;
            };
        }

        alert("nom invalide");
        return null;

    } catch {
        return null;
    }
}

//Fonction SignIn
async function NewAccount(UserNew) {
    try {
        const Send = await fetch(URLDataBase, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "SignIn",
                Nom: UserNew
            })
        })

        const Data = await Send.json();

        const LocalChange = {
            Nom: UserNew
        };
        localStorage.setItem(SessionKey, JSON.stringify(LocalChange));
        window.location.replace("Index.html");
    } catch {
        return;
    }
}

