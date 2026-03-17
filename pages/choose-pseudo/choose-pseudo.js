import { headerComponent } from '../../components/header/header.js'
import { button } from '../../components/button/button.js'

export function choosePseudoPage(params = {}) { 
  const gameId = params.gameId  
  const name = params.name   
  const roomId = params.roomId    
  const defaultsPseudo = [
  "PixelHeros", "DataVador",  
  "ZeroErreur",  "CyberCanard",
   
  "JeanPeuPlus", "PatateDouce", "PandaRoux", "CouscousFlingueur",
  "LicorneEnGrève", "PingouinEnFeu", "TofuGuerrier", "KiwiMasqué", "LoutreZen",
  "PoulpeFrit", "CanardLaqué", "ChatChasseur", "HamsterRusse",
  "GirafeEnSkate", "Ratatouille", "PigeonVoyageur", "KoalaDort", "PouletFrit",
 
  "AlainTerieur", "AlexTerieur", "SarahCroc", "SachaTouille", "KellyDiote",
  "AudeJavel", "DaisyDraté", "GillesEtJohn", "JustinPtitPeu", "OttoGraf",
  "YvonEnBave", "JeanBonBeurre", "AnnaConda", "TerryDicule", "EmmaCarena",
 
  "WifiGratuit", "ElonMusque",
  "AdaLovelace", "PythonGris",  
 
  "SushiMan", "MakiPasFrais", "PizzaAnanas", "BurgerKingSize", "RaclettePower",
  "FondueSavoyarde", "CrepeWhouah", "NuggetDoré",   "CaramelMou", "FriteBelge", "GaufreSucre", "PateAtartiner", 
  "JeTeVois", "LagEternel", "AfkManger",
  "MiamMiam",

   "EcureuilFou", "HerissonBleu", "TortueRapide", "LapinCrétin", "LoupGarou",
  "AigleRoyal", "FauconMillenium", "RequinMarteau", "BaleineBleue", "MeduseZen",
  "ScorpionFixe", "FourmiRouge", "GuepeCool", "MoucheDuCoche", "Libellule",
 
  "GrillePain", "FrigoVide", "MachineALaver","ChatSansFil",  "StyloBille","RadiateurExplosif", 
 "VoleurDeBiscuits" ,
  "BarbareDoux",  "NainDeJardin", "OrcSympa", "TrollGentil",
  "GobelinMalin", "SorciereVerte", "DragonDePoche", "PhoenixRouge", 

  "MrPropre", "CapitaineFlamme", "InspecteurGadget", "SherlockHolm",

  "PetitSuisse", "RavioliFurtif",
  "MisterGeek", "JacquesOuzi", "AudeVaisselle", "LarryCouverts", "MarcAssin",
  "CélineDionysos", "GérardMenvu", "YannSolo", "DinoSkateur", "PandaVengeur",
  "HibouHou", "OursEnGelée", "MoustiqueZen", "ChatPitre", "ChienChaud",
  "SandwichViking", "OmeletteDuFromage", "TarteAuCitron", "BiscuitPerdu", "ChouFleurEspace",
  "CordonBleu", "PateABouler", "VeloutéDeData", "SalamiSami", "BananeBleue",
  "ClavierGras", "SourisDingo", "EcranFumée", 
  "VoldemortDeRire", "HarryPotDeBeurre", "FrodonSacoche", "GandalfLeGrisou",
  "R2D2Dodo", "C3POKemon", "MarioBrossé", "LuigiPasLa", "YoshiRigolo",
  "KirbyGourmand", "SonicLent", "PikachuIte", "Bulbizarre", "SalamècheFroid",
  "TortankVide", "ZeldaPasLien", "LaraCrotte", "PacManMangePas", "TetrisMalPlacé",
  "BombermanDoux", "RaymanSansBras", "SpyroLePetit", "CrashBandicool", "TombRaideur",
  "AgentDoubleZero", "SherlockF Holmes", "ArseneLapin", "ZorroEstArrivé", "TarzanEnVille"
];
 let pseudo = defaultsPseudo[Math.floor(Math.random() * defaultsPseudo.length)]
  return /*html*/ `  <div class="choosePseudoPage">
        ${headerComponent("choose-pseudo")}
        <div class="box">
        <div class="head">

              <h1>${name}</h1> 
        </div> 
          <div class="inputContainer">
            <span>Pseudo</span>
            <span id="error"></span>
            <input id="pseudo" oninput="updateCharacterCount()" type="text" value="${pseudo}"/>
            <span class="caractereCount">${pseudo.length}/20 caractères</span>
            </div>
          ${button(null, null, null, "gameLogin", "Rejoindre", "dark-grey", {
            gameId: gameId,
            roomId: roomId, 
          })}
        </div>

    </div>
    `;  
}
 
window.updateCharacterCount = function() {
  const input = document.getElementById("pseudo");
  const characterCount = document.querySelector(".inputContainer span:last-child");
  characterCount.textContent = `${input.value.length}/20 caractères`;

  if (input.value.length > 20) { 
    input.value = input.value.slice(0, 20);
  }
}
