//setup
const Title = document.getElementById("Title");
const Family = document.getElementById("Family");

const SearchElement = document.getElementById("Search");
const SearchBar = document.getElementById("SearchBar");

const BlocsListe = document.querySelectorAll(".block");
var UnFam;

const MaListe = document.getElementById("MaListe");

const NoFamMess = document.getElementById("NoFamMess");

const MemberListe = document.getElementById("MembreListe");
const familleListe = document.getElementById("FamilyListe");

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
var FamilySelected = false;

//OnLoad
document.addEventListener("DOMContentLoaded", () => {

    const ActualSession = FindActualSession();


    if (ActualSession && ActualSession.Nom) {
        UserName = ActualSession.Nom;
    }

    if (ActualSession && ActualSession.Fam) {
        FamilyName = ActualSession.Fam;
    }

    const IsLog = !(UserName == null || UserName == "");
    const FamSet = !(FamilyName == null || FamilyName == "");

    LogObjectListe.forEach((bloc) => {
        bloc.classList.toggle("Hide", !IsLog);
    })
    UnlogObjectListe.forEach((bloc) => {
        bloc.classList.toggle("Hide", IsLog);
    })

    //Adaptative Object
    //Titles
    if (Title) {
        if (IsLog) {
            Title.textContent = UserName.toUpperCase();

            FindFamily();
        }
        else {
            Title.textContent = "BIENVENUE"
        }
    }
    if (Family) {
        if (FamSet) {
            Family.textContent = FamilyName;
            if (MaListe) {
                MaListe.classList.toggle("Hide", false);
            }
            if (SearchBar) {
                SearchBar.classList.toggle("Hide", false);
            }
            if (NoFamMess) {
                NoFamMess.classList.toggle("Hide", true);
            }

            FindMembre();
        }
        else {
            Family.textContent = "Selectionner une famille";
            Family.style.backgroundColor = "lightgrey";
            Family.style.borderColor = "grey";
            if (MaListe) {
                MaListe.classList.toggle("Hide", true);
            }
            if (SearchBar) {
                SearchBar.classList.toggle("Hide", true);
            }
            if (NoFamMess) {
                NoFamMess.classList.toggle("Hide", false);
            }
        }

    }
})

//Fonctionnement Family liste
if (Family) {
    Family.addEventListener("click", () => {
        FamilySelected = !FamilySelected;

        familleListe.classList.toggle("Hide", !FamilySelected);

    })
}

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
                window.location.replace("index.html");
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
        window.location.replace("index.html");

    } catch (error) {
        alert(error.toString());
        return;
    }
}

async function FindMembre() {
    try {
        const respond = await fetch(`${URLDataBase}?Page=familleListe`);
        const Data = await respond.json();
        const ListeMemberName = Data.find(f => f.Nom == FamilyName).Membre;

        if (ListeMemberName) {
            const MemberTable = ListeMemberName.split(",").map(Nom => Nom.trim());

            MemberTable.forEach((bloc) => {
                if (bloc != UserName) {
                    const htmlMembre = `<Section href="" class="block">
                                            <div>
                                                <h3>${bloc}</h3>
                                                <div class="tags-liste">
                                                    <p class="tag">X idée</p>
                                                    <p class="tag">X restant</p>
                                                </div>
                                            </div>
                                        </Section>`

                    MemberListe.insertAdjacentHTML("beforeend", htmlMembre);
                }

            })
        }

    } catch {
        alert(err.toString());
        return;
    }
}

async function FindFamily() {
    try {
        const respond = await fetch(`${URLDataBase}?Page=AccountList`);
        const Data = await respond.json();
        const ListeUserName = Data.find(f => f.Nom == UserName).Familles;

        if (ListeUserName) {
            const FamilleTable = ListeUserName.split(",").map(Nom => Nom.trim());

            FamilleTable.forEach((bloc) => {
                const htmlFamille = `<section class="SousFamille" style="cursor: pointer;">
                                        <h3>${bloc}</h3>
                                    </section>`

                familleListe.insertAdjacentHTML("beforeend", htmlFamille);
            })
        }

        UnFam = document.querySelectorAll(".SousFamille");

        if (UnFam) {
            UnFam.forEach((bloc) => {
                bloc.addEventListener("click", () => {
                    ChangeFamily(bloc);
                })
            })
        }

    } catch (err) {
        alert(err.toString());
        return;
    }
}

async function ChangeFamily(Obj) {
    try {
        const Nouv = Obj.textContent.trim();

        const LocalChange = {
            Nom: UserName,
            Fam: Nouv
        };
        localStorage.setItem(SessionKey, JSON.stringify(LocalChange));
        window.location.replace("index.html");
    } catch (err) {
        alert(err.toString());
        return;
    }
}