const GiftListe = document.getElementById("GiftListe");
const GiftTitle = document.getElementById("TitleGiftList");

var GUserName;
var GFamilyName;
var GTarget;

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

        FindGift();
    }
})

async function FindGift() {
    const respond = await fetch(`${URLDataBase}?Page=GiftList`);
    const Data = await respond.json();

    const AllGiftNameListe = Data.find(f => f.Nom == GUserName).Familles;
    const SpecGiftNameListe = AllGiftNameListe.find(f => f.Famille == GFamilyName);

    if (SpecGiftNameListe) {
        SpecGiftNameListe.forEach((bloc) => {
            const GiftPrix = bloc.Prix;
            const MainGiftTitle = bloc.Title;
            var TagPriceOrder;

            if (GiftPrix) {
                if (GiftPrix >= 100) {
                    TagPriceOrder = "Très chère";
                }
                else if (GiftPrix >= 40) {
                    TagPriceOrder = "Moyennemnt chère";
                }
                else {
                    TagPriceOrder = "Peu Chère";
                }
            }




            const htmlGift = `<Section class="block" style="display: flex;">
                                <div style="width: 100%;">
                                    <h3>${MainGiftTitle}</h3>
                                    <div class="tags-liste">
                                        <p class="tag">${TagPriceOrder}</p>
                                        <p class="tag">Priorité</p>
                                        <nav class="tag" style="display: flex;">
                                            <a href="">Lier/Dépendence à name</a>
                                        </nav>
                                        <p class="tag">Catégorie</p>
                                    </div>
                                    <p class="Description">Description du cadeau et point clé spécifique
                                    </p>
                                    <div class="Flex">
                                        <div class="Boolean">
                                            <img src="Image/Placeholder/Placeholder scare.png" class="TrueVis Hide">
                                        </div>
                                        <a href="" class="Ref">Source 1</a>
                                    </div>
                                    <div class="Flex">
                                        <div class="Boolean">
                                            <img src="Image/Placeholder/Placeholder scare.png" class="TrueVis Hide">
                                        </div>
                                        <a href="" class="Ref">Liens pour la source 2</a>
                                    </div>
                                </div>
                                <div style="width: 100%;">
                                    <div class="Flex">
                                        <p style="font-weight: bold;">10%</p>
                                        <div class="ScrollBar">
                                            <div class="Bar"></div>
                                        </div>
                                        <p style="font-weight: bold; font-size: 1.2rem;">100€</p>
                                    </div>
                                    <div>
                                        <p class="Participant">Participant</p>
                                        <div class="Flex">
                                            <img src="Image/Placeholder/Placeholder scare.png" class="BtnPlus">
                                                <p class="PartRef">Participant B</p>
                                                <p class="PartPrix">3€</p>
                                        </div>
                                        <div>
                                            <div class="Flex" style="margin-bottom: 0.5rem;">
                                                <p class="PartRef">Participant A</p>
                                                <p class="PartPrix">7€</p>
                                            </div>
                                            <div class="Flex" style="margin-bottom: 0.5rem;">
                                                <p class="PartRef">Participant B</p>
                                                <p class="PartPrix">3€</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Section>`
        });
    }
}
