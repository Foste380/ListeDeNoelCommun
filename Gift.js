const GiftListe = document.getElementById("GiftListe");
const GiftTitle = document.getElementById("TitleGiftList");

var GUserName;
var GFamilyName;
var GTarget;

var GiftLinkLicenerNb = 0;

document.addEventListener("DOMContentLoaded", () => {
    const ActualSession = FindActualSession();

    if (ActualSession) {
        if (ActualSession.Nom) {
            GUserName = ActualSession.Nom;
        }

        if (ActualSession.Fam) {
            GFamilyName = ActualSession.Fam;
        }

        if (ActualSession.Targ) {
            GTarget = ActualSession.Targ
        }



        if (GiftTitle) {
            GiftTitle.textContent = `${GTarget} (${GFamilyName})`;
        }

        FindGift();
    }
})

async function FindGift() {
    const respond = await fetch(`${URLDataBase}?Page=GiftList`);
    const Data = await respond.json();

    //alert(JSON.stringify(Data));

    const SpecGiftNameListe = Data.filter(f => (f.Nom == GTarget) && (f.Famille == GFamilyName));

    //alert(JSON.stringify(SpecGiftNameListe));

    try {
        if (SpecGiftNameListe) {
            GiftListe.innerHTML = "";
            SpecGiftNameListe.forEach((bloc) => {

                //SETUP
                const GiftPrix = bloc.Prix;
                const MainGiftTitle = bloc.Title;

                var TagPriceOrder;
                var TagPriceColor;
                if (GiftPrix) {
                    if (GiftPrix >= 100) {
                        TagPriceOrder = "Tres chere";
                        TagPriceColor = "--Chere";
                    }
                    else if (GiftPrix >= 40) {
                        TagPriceOrder = "Moyennement chere";
                        TagPriceColor = "--MidPrice";
                    }
                    else {
                        TagPriceOrder = "Peu Chere";
                        TagPriceColor = "--Chip";
                    }
                }

                const GiftTags = bloc.Tags;
                var GiftPrio = "";
                var GiftPrioColor = "Assombri";
                var GiftPrioHiden = "";
                var GiftDep;
                var GiftCat;
                if (GiftTags) {
                    const GiftSeperatedTags = GiftTags.split(",").map(Nom => Nom.trim())
                    GiftPrio = GiftSeperatedTags[0];
                    if (GiftPrio >= 2) {
                        GiftPrio = "Plus Grosse Priorite";
                        GiftPrioColor = "Danger";
                    }
                    else if (GiftPrio == 1) {
                        GiftPrio = "Prioritere";
                        GiftPrioColor = "Mid";
                    }
                    else if (GiftPrio < 0) {
                        GiftPrio = "En Dernier";
                        GiftPrioColor = "Low";
                    }
                    else {
                        GiftPrioHiden = "Hide"
                    }

                    GiftDep = GiftSeperatedTags[1];
                    GiftCat = GiftSeperatedTags[2];
                }
                var GiftDepContent = "";
                if (GiftDep != "Aucune Dépense") {
                    GiftDepContent = `<nav class="tag">
                                        <a href="#${GiftDep}">Dépend de ${GiftDep}</a>
                                    </nav>`;
                }
                else {
                    GiftDepContent = "";
                }

                const GiftDesc = bloc.Description;

                const GiftRef = bloc.Ref;
                var GiftRefList;
                var GiftRefContent = "";
                if (GiftRef) {
                    GiftRefList = GiftRef.split(",").map(Nom => Nom.trim());
                    if (GiftRefList) {
                        GiftRefList.forEach((UnderBloc) => {
                            const UnderBlocList = UnderBloc.split("::").map(Nom => Nom.trim());

                            const GiftRefName = UnderBlocList[0];
                            const GiftRefLink = UnderBlocList[1];
                            const GiftRefBool = UnderBlocList[2];

                            var GiftRefVisBool;
                            if (GiftRefBool) {
                                GiftRefVisBool = `<div class="Boolean">
                                                    <img src="Image/Placeholder/Placeholder scare.png" id="Link${GiftLinkLicenerNb}" class="TrueVis Hide">
                                                </div>`
                                GiftLinkLicenerNb++;
                            }
                            else {
                                GiftRefVisBool = `<div class="Boolean">
                                                    <img src="Image/Placeholder/Placeholder scare.png" id="Link${GiftLinkLicenerNb}"class="TrueVis">
                                                </div>`
                                GiftLinkLicenerNb++;
                            }

                            const GiftRefNewContent = `<div class="Flex">
                                                        ${GiftRefVisBool}
                                                        <a href="${GiftRefLink}" class="Ref">${GiftRefName}</a>
                                                    </div>`;

                            GiftRefContent = GiftRefContent + GiftRefNewContent;
                        })
                    }
                }

                const GiftIndivPrix = bloc.Prix;
                var GiftPrixPourc = 0;

                const GiftParticipList = bloc.Participant;
                var GiftPrixCharge = 0;

                var GiftPartcipContent = "";
                var GiftPartcipContentSelf = `<div class="Flex" style="margin-bottom: 0.5rem;">
                                                            <img src="Image/Placeholder/Placeholder scare.png" class="BtnPlus" id="btn${MainGiftTitle}">
                                                            <input type="number" id="Prix${MainGiftTitle}" class="PartPrix Unset" Placeholder="Participer" >
                                                        </div>`
                if (GiftParticipList) {
                    const GiftParticipListCharge = GiftParticipList.split(",").map(Nom => Nom.trim());



                    if (GiftParticipListCharge) {
                        GiftParticipListCharge.forEach((UnderBloc) => {
                            if (UnderBloc != "" && UnderBloc != null) {
                                const UnderBlocList = UnderBloc.split("::").map(Nom => Nom.trim());

                                const UnderBlocParticip = UnderBlocList[0];
                                const UnderBlocPrix = UnderBlocList[1];

                                if (UnderBlocParticip == UserName) {
                                    GiftPartcipNewSelfContent = `<div class="Flex" style="margin-bottom: 0.5rem;">
                                                            <img src="Image/Placeholder/Placeholder scare.png" class="BtnPlus" id="btn${MainGiftTitle}">
                                                            <p class="PartRef">Participation</p>
                                                            <input type="number" id="Prix${MainGiftTitle}" class="PartPrix Unset" Placeholder="${UnderBlocPrix}€">
                                                        </div>`

                                    GiftPartcipContentSelf = GiftPartcipNewSelfContent;
                                }
                                else {
                                    const GiftPartcipNewContent = `<div class="Flex" style="margin-bottom: 0.5rem;">
                                                            <p class="PartRef">${UnderBlocParticip}</p>
                                                            <p class="PartPrix">${UnderBlocPrix}€</p>
                                                        </div>`

                                    GiftPartcipContent = GiftPartcipContent + GiftPartcipNewContent
                                }

                                GiftPrixCharge += Number(UnderBlocPrix) || 0;
                            }
                        })
                    }
                }



                if (GiftIndivPrix) {
                    GiftPrixPourc = (GiftPrixCharge / GiftIndivPrix) * 100;
                }

                var GiftPrixColor = "orange"
                if (GiftPrixPourc >= 100) {
                    GiftPrixPourc = 100;
                    GiftPrixColor = "var(--DefaultClaire)"
                }

                //alert("Setup set");

                //CONTENT
                const htmlGift = `<Section id="${MainGiftTitle}" class="block  FlexMain" style="align-items: start">
                                <div style="width: 100%;">
                                    <h3>${MainGiftTitle}</h3>
                                    <div class="tags-liste">
                                        <div class="FlexSpec">
                                            <p class="tag ${GiftPrioHiden}" style="background-color: var(--${GiftPrioColor})">${GiftPrio}</p>
                                            <p class="tag" style="background-color: var(${TagPriceColor})">${TagPriceOrder}</p>    
                                        </div>
                                        <div class="FlexSpec">
                                            ${GiftDepContent}
                                            <p class="tag">${GiftCat}</p>
                                        </div>
                                    </div>
                                    <p class="Description">${GiftDesc}</p>
                                    ${GiftRefContent}
                                    <div class="Flex" style="margin-bottom: 0.5rem;">
                                        <img src="Image/Placeholder/Placeholder scare.png" class="BtnPlus" id="LinkBtn${MainGiftTitle}">
                                        <div>
                                            <input type="text" id="NewLinkTitle${MainGiftTitle}" class="Ref Unset" Placeholder="Intuler du nouveau lien" >
                                            <input type="text" id="NewLinkContent${MainGiftTitle}" class="Ref Unset" Placeholder="Ajouté un lien" >
                                        </div>
                                    </div>
                                </div>
                                <div style="width: 100%;">
                                    <div class="Flex">
                                        <p style="font-weight: bold;">${Math.round(GiftPrixPourc)}%</p>
                                        <div class="ScrollBar">
                                            <div class="Bar" style="width: ${GiftPrixPourc}%; background-color: ${GiftPrixColor}"></div>
                                        </div>
                                        <p style="font-weight: bold; font-size: 1.2rem;">${GiftIndivPrix}€</p>
                                    </div>
                                    <div>
                                        <p class="Participant">Participant</p>
                                        ${GiftPartcipContentSelf}
                                        <div>
                                            ${GiftPartcipContent}
                                        </div>
                                    </div>
                                </div>
                            </Section>`
                //alert("Gift created");
                GiftListe.insertAdjacentHTML("beforeend", htmlGift);

                //Add Particip
                const BtnAddPart = document.getElementById(`btn${MainGiftTitle}`);
                if (!BtnAddPart) {
                    alert("bouton Add Participiannt not found");
                    return
                }
                const PrixAddInput = document.getElementById(`Prix${MainGiftTitle}`);

                try {
                    BtnAddPart.addEventListener("click", () => {
                        if (PrixAddInput) {
                            NewPrice(PrixAddInput, MainGiftTitle);
                        }
                        else {
                            alert("text not found")
                        }
                    })
                } catch (error) {
                    alert(err);
                }

                //Add Link
                const BtnAddLink = document.getElementById(`LinkBtn${MainGiftTitle}`);
                if (!BtnAddLink) {
                    alert("bouton Add Participiannt not found");
                    return
                }
                const TitleLinkAddInput = document.getElementById(`NewLinkTitle${MainGiftTitle}`);
                const LinkAddInput = document.getElementById(`NewLinkContent${MainGiftTitle}`);

                try {
                    BtnAddLink.addEventListener("click", () => {
                        if (TitleLinkAddInput && LinkAddInput) {
                            NewLink(TitleLinkAddInput, LinkAddInput, MainGiftTitle);
                        }
                        else {
                            alert("text or link not found")
                        }
                    })
                } catch (error) {
                    alert(err);
                }


            });
        }
    } catch (err) {
        alert(err);
        return;
    }
}

async function NewPrice(params, params1) {
    const Price = params.value;

    const respond = await fetch(`${URLDataBase}?Page=GiftList`);
    const Data = await respond.json();

    const SpecGiftName = Data.filter(f => (f.Nom == GTarget) && ((f.Famille == GFamilyName) && (f.Title == params1)));

    if (SpecGiftName) {

        const ActualElement = SpecGiftName[0].Participant;

        var Participant;

        var TextToSend = "";
        if (ActualElement) {
            Participant = ActualElement.split(",").map(Nom => Nom.trim());
            Participant.forEach((bloc) => {
                const blocSep = bloc.split("::").map(Nom => Nom.trim());

                if (blocSep[0] != GUserName) {
                    TextToSend = TextToSend + bloc + ",";
                }
            })
        }
        if (Price > 0 && Price != "" && Price != null) {
            const TextToAdd = GUserName + "::" + Price;
            TextToSend = TextToSend + TextToAdd;
        }

        //alert("text : " + TextToSend);

        const Send = await fetch(URLDataBase, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                Action: "NewPrice",
                Nom: GTarget,
                Famille: GFamilyName,
                Titre: params1,
                Particip: TextToSend
            })
        })

        const SendRespond = await Send.text();
        //alert(SendRespond);

        FindGift();
    }
}

async function NewLink(params, paramsBis, params1) {
    var TitleToAdd = params.value;
    const LinkToAdd = paramsBis.value;

    const respond = await fetch(`${URLDataBase}?Page=GiftList`);
    const Data = await respond.json();

    const SpecGiftName = Data.filter(f => (f.Nom == GTarget) && ((f.Famille == GFamilyName) && (f.Title == params1)));

    if (SpecGiftName) {

        const ActualElement = SpecGiftName[0].Ref;

        var Participant;


        var TextToSend = "";
        if (ActualElement) {
            Participant = ActualElement.split(",").map(Nom => Nom.trim());
            Participant.forEach((bloc) => {
                const blocSep = bloc.split("::").map(Nom => Nom.trim());

                if (blocSep[1] != LinkToAdd) {
                    TextToSend = TextToSend + bloc + ",";
                }
            })
        }

        if (LinkToAdd != "" && LinkToAdd != null) {
            if (!TitleToAdd || TitleToAdd == "") {
                TitleToAdd = "Sans Nom";
                alert(`Nouveau nom : ${TitleToAdd}`)
            }
            const TextToAdd = TitleToAdd + "::" + LinkToAdd + "::false";
            TextToSend = TextToSend + TextToAdd;
        }
        else {
            alert("lien manquant");
            return;
        }

        alert("text : " + TextToSend);

        const Send = await fetch(URLDataBase, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                Action: "NewLink",
                Nom: GTarget,
                Famille: GFamilyName,
                Titre: params1,
                Link: TextToSend
            })
        })

        const SendRespond = await Send.text();
        alert(SendRespond);

        FindGift();
    }
}