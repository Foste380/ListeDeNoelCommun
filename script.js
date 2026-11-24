//setup
const Title = document.getElementById("Title");
const Family = document.getElementById("Family");

const SearchElement = document.getElementById("Search");
const BlocsListe = document.querySelectorAll(".block");

const BtnLogin = document.getElementById("BtnLogIn");
const LoginText = document.getElementById("LogInText");

const BtnSignin = document.getElementById("BtnSignIn");
const SigninText = document.getElementById("SignInText");

const BtnLogout = document.getElementById("LogOut");

const LogObjectListe = document.querySelectorAll(".Loged");
const UnlogObjectListe = document.querySelectorAll(".Unloged");

const URLDataBase = "https://script.google.com/macros/s/AKfycbyf_bjwZXkXK-io8uWTY01pHf4m3ZALbwzOq-2IT9_WNW9lK69_weIOuO28Iy7VgMbNjQ/exec";
const SessionKey = "SessionCadeauListe"

var UserName;
var FamilyName;
var FamilySelected = true;

//OnLoad
document.addEventListener("DOMContentLoaded", () => {

    const ActualSession = FindActualSession();

    if (ActualSession && ActualSession.Nom) {
        UserName = ActualSession.Nom;
    }

    const IsLog = !(UserName == null || UserName == "");
    const FamSet = !(FamilyName == null || FamilyName == "");

    LogObjectListe.forEach((bloc) => {
        bloc.classList.toggle("Hide", !IsLog);
    })
    UnlogObjectListe.forEach((bloc) => {
        bloc.classList.toggle("Hide", IsLog);
    })

    if (Title) {
        if (IsLog) {
            Title.textContent = UserName.toUpperCase();
        }
        else {
            Title.textContent = "BIENVENUE"
        }
    }

    if (Family && !FamilySelected) {
        if (FamSet) {
            Family.textContent = Family;
        }
        else {
            Family.textContent = "Selectionner une famille";
            Family.style.backgroundColor = "lightgrey";
            Family.style.borderColor = "grey"
        }
    }
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

    LoginText.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            BtnLogin.click();
        }
    });
}

//Fontionnement du SignIn html
if (SigninText && BtnSignin) {
    BtnSignin.addEventListener("click", () => {
        const saisi = SigninText.value.trim();

        if (saisi === "") {
            alert("il faut remplir le champ au dessus");
            return;
        }

        NewAccount(saisi);
    })

    SigninText.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            BtnSignin.click();
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
                Action: "Signin",
                Nom: UserNew
            })
        })

        const reponseTexte = await Send.text();
        console.log("Réponse brute du serveur :", reponseTexte);

        let Data;
        try {
            Data = JSON.parse(reponseTexte);
        } catch (err) {
            alert("Le serveur n'a pas renvoyé de JSON, mais ce texte :\n\n" + reponseTexte);
            return;
        }

        if (!Data.success) {
            alert(Data.message || "Impossible de créer le compte.");
            return;
        }

        const LocalChange = {
            Nom: UserNew
        };

        UserName = UserNew;

        localStorage.setItem(SessionKey, JSON.stringify(LocalChange));
        window.location.replace("Index.html");

    } catch (error) {
        alert(error.toString());
        return;
    }
}

