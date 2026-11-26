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
            GiftTitle.textContent = `Liste de ${GTarget} chez ${GFamilyName}`;
        }

        //alert(GUserName + " " + GFamilyName + " " + GTarget)

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
                                                            <img src="Image/Placeholder/Placeholder scare.png" class="BtnPlus">
                                                            <p style="font-weight: bold">Participer</P>
                                                        </div>`
                if (GiftParticipList) {
                    const GiftParticipListCharge = GiftParticipList.split(",").map(Nom => Nom.trim());
                    if (GiftParticipListCharge) {
                        GiftParticipListCharge.forEach((UnderBloc) => {
                            const UnderBlocList = UnderBloc.split("::").map(Nom => Nom.trim());

                            const UnderBlocParticip = UnderBlocList[0];
                            const UnderBlocPrix = UnderBlocList[1];


                            if (UnderBlocParticip == UserName) {
                                const GiftPartcipNewContent = `<div class="Flex" style="margin-bottom: 0.5rem;">
                                                            <img src="Image/Placeholder/Placeholder scare.png" class="BtnPlus">
                                                            <p class="PartRef">${UnderBlocParticip}</p>
                                                            <p class="PartPrix">${UnderBlocPrix}€</p>
                                                        </div>`

                                GiftPartcipContentSelf = GiftPartcipNewContent;
                            }
                            else {
                                const GiftPartcipNewContent = `<div class="Flex" style="margin-bottom: 0.5rem;">
                                                            <p class="PartRef">${UnderBlocParticip}</p>
                                                            <p class="PartPrix">${UnderBlocPrix}€</p>
                                                        </div>`

                                GiftPartcipContent = GiftPartcipContent + GiftPartcipNewContent
                            }

                            GiftPrixCharge += Number(UnderBlocPrix) || 0;
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
            });
        }
    } catch (err) {
        alert(err);
        return;
    }
}
