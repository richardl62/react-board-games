//KLUDGE: There must be a better way to implement this.
import { sAssert } from "../../utils/assert";
import { ReactComponent as Card1B } from "./images/1B.svg";
import { ReactComponent as Card1J } from "./images/1J.svg";
import { ReactComponent as Card2B } from "./images/2B.svg";
import { ReactComponent as Card2C } from "./images/2C.svg";
import { ReactComponent as Card2D } from "./images/2D.svg";
import { ReactComponent as Card2H } from "./images/2H.svg";
import { ReactComponent as Card2J } from "./images/2J.svg";
import { ReactComponent as Card2S } from "./images/2S.svg";
import { ReactComponent as Card3C } from "./images/3C.svg";
import { ReactComponent as Card3D } from "./images/3D.svg";
import { ReactComponent as Card3H } from "./images/3H.svg";
import { ReactComponent as Card3S } from "./images/3S.svg";
import { ReactComponent as Card4C } from "./images/4C.svg";
import { ReactComponent as Card4D } from "./images/4D.svg";
import { ReactComponent as Card4H } from "./images/4H.svg";
import { ReactComponent as Card4S } from "./images/4S.svg";
import { ReactComponent as Card5C } from "./images/5C.svg";
import { ReactComponent as Card5D } from "./images/5D.svg";
import { ReactComponent as Card5H } from "./images/5H.svg";
import { ReactComponent as Card5S } from "./images/5S.svg";
import { ReactComponent as Card6C } from "./images/6C.svg";
import { ReactComponent as Card6D } from "./images/6D.svg";
import { ReactComponent as Card6H } from "./images/6H.svg";
import { ReactComponent as Card6S } from "./images/6S.svg";
import { ReactComponent as Card7C } from "./images/7C.svg";
import { ReactComponent as Card7D } from "./images/7D.svg";
import { ReactComponent as Card7H } from "./images/7H.svg";
import { ReactComponent as Card7S } from "./images/7S.svg";
import { ReactComponent as Card8C } from "./images/8C.svg";
import { ReactComponent as Card8D } from "./images/8D.svg";
import { ReactComponent as Card8H } from "./images/8H.svg";
import { ReactComponent as Card8S } from "./images/8S.svg";
import { ReactComponent as Card9C } from "./images/9C.svg";
import { ReactComponent as Card9D } from "./images/9D.svg";
import { ReactComponent as Card9H } from "./images/9H.svg";
import { ReactComponent as Card9S } from "./images/9S.svg";
import { ReactComponent as CardAC } from "./images/AC.svg";
import { ReactComponent as CardAD } from "./images/AD.svg";
import { ReactComponent as CardAH } from "./images/AH.svg";
import { ReactComponent as CardAS } from "./images/AS.svg";
import { ReactComponent as CardJC } from "./images/JC.svg";
import { ReactComponent as CardJD } from "./images/JD.svg";
import { ReactComponent as CardJH } from "./images/JH.svg";
import { ReactComponent as CardJS } from "./images/JS.svg";
import { ReactComponent as CardKC } from "./images/KC.svg";
import { ReactComponent as CardKD } from "./images/KD.svg";
import { ReactComponent as CardKH } from "./images/KH.svg";
import { ReactComponent as CardKS } from "./images/KS.svg";
import { ReactComponent as CardQC } from "./images/QC.svg";
import { ReactComponent as CardQD } from "./images/QD.svg";
import { ReactComponent as CardQH } from "./images/QH.svg";
import { ReactComponent as CardQS } from "./images/QS.svg";
import { ReactComponent as CardTC } from "./images/TC.svg";
import { ReactComponent as CardTD } from "./images/TD.svg";
import { ReactComponent as CardTH } from "./images/TH.svg";
import { ReactComponent as CardTS } from "./images/TS.svg";
import { Card, CardBack } from "./types";


function getCardComponentByFileName(name: string) {
    if (name === "1B") return Card1B;
    if (name === "1J") return Card1J;
    if (name === "2B") return Card2B;
    if (name === "2C") return Card2C;
    if (name === "2D") return Card2D;
    if (name === "2H") return Card2H;
    if (name === "2J") return Card2J;
    if (name === "2S") return Card2S;
    if (name === "3C") return Card3C;
    if (name === "3D") return Card3D;
    if (name === "3H") return Card3H;
    if (name === "3S") return Card3S;
    if (name === "4C") return Card4C;
    if (name === "4D") return Card4D;
    if (name === "4H") return Card4H;
    if (name === "4S") return Card4S;
    if (name === "5C") return Card5C;
    if (name === "5D") return Card5D;
    if (name === "5H") return Card5H;
    if (name === "5S") return Card5S;
    if (name === "6C") return Card6C;
    if (name === "6D") return Card6D;
    if (name === "6H") return Card6H;
    if (name === "6S") return Card6S;
    if (name === "7C") return Card7C;
    if (name === "7D") return Card7D;
    if (name === "7H") return Card7H;
    if (name === "7S") return Card7S;
    if (name === "8C") return Card8C;
    if (name === "8D") return Card8D;
    if (name === "8H") return Card8H;
    if (name === "8S") return Card8S;
    if (name === "9C") return Card9C;
    if (name === "9D") return Card9D;
    if (name === "9H") return Card9H;
    if (name === "9S") return Card9S;
    if (name === "AC") return CardAC;
    if (name === "AD") return CardAD;
    if (name === "AH") return CardAH;
    if (name === "AS") return CardAS;
    if (name === "JC") return CardJC;
    if (name === "JD") return CardJD;
    if (name === "JH") return CardJH;
    if (name === "JS") return CardJS;
    if (name === "KC") return CardKC;
    if (name === "KD") return CardKD;
    if (name === "KH") return CardKH;
    if (name === "KS") return CardKS;
    if (name === "QC") return CardQC;
    if (name === "QD") return CardQD;
    if (name === "QH") return CardQH;
    if (name === "QS") return CardQS;
    if (name === "TC") return CardTC;
    if (name === "TD") return CardTD;
    if (name === "TH") return CardTH;
    if (name === "TS") return CardTS;

    sAssert(false, "Unrecognised card name", name);
}

export function getCardComponent(card: Card) : React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string;
}> {
    const { rank, suit, joker } = card;

    let fileName;
    if(joker) {
        fileName = joker+"J";
    } else {
        sAssert(rank && suit);
        
        const rankLetter = rank === "10" ? "T" : rank; 
        fileName = rankLetter+suit;
    }
    return getCardComponentByFileName(fileName);
}

export function getCardBackComponent(cardBack: CardBack) : React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string;
}> {
    const fileName = cardBack === "black" ? "1B" : "2B";

    return getCardComponentByFileName(fileName);
}