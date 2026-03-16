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
 
  return /*html*/ `  <div class="choosePseudoPage">
        ${headerComponent("choose-pseudo")}
        <div class="box">
          <div>
              <h1>${name}</h1>
              <span>Choisissez votre pseudo</span>
          </div>
           <span id="error"></span>
          <input id="pseudo" type="text" value="${defaultsPseudo[Math.floor(Math.random() * defaultsPseudo.length)]}"/>
          ${button(null, null, null, "gameLogin", "Rejoindre", "dark-grey", {
            gameId: gameId,
            roomId: roomId, 
          })}
        </div>

    </div>
    `;
}
 
