import { Card, CardBack } from "./types";
import { sAssert } from "../../utils/assert";
import React, { JSX } from "react";
import { cardSize } from "./styles";

function makeCardNames() : string[]{
    // Start with the jokers and the two back cards
    const cardNames = ["1B", "1J", "2B", "2J"];
    
    // Now add the 52 cards
    const suits = ["C", "D", "H", "S"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
    for (const suit of suits) {
        for (const rank of ranks) {
            cardNames.push(rank + suit);
        }
    }
    return cardNames;
}

const cardNames = makeCardNames();

// Lazy load of the card images
function makeLazyComponents() {
    const components : Record<string, ReturnType<typeof React.lazy> > = {};
    for (const name of cardNames) {
        components[name] = React.lazy(() => import(`./images/${name}.svg?react`));
    }

    return components
}      

const lazyComponents = makeLazyComponents();

function getCardComponentByFileName(name: string) : JSX.Element {
    const CardComponent = lazyComponents[name];

    if (!CardComponent) {
        throw new Error(`Card component not found for name: ${name}`);
    }
  
    return (
        <React.Suspense fallback={<div>Loading card...</div>}>
            <CardComponent style={cardSize}/> {/* Kludge: hard coded card size */}
        </React.Suspense>
    );
}

export function getCardComponent(card: Card) : JSX.Element  {
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

export function getCardBackComponent(cardBack: CardBack) : JSX.Element {

    const fileName = cardBack === "black" ? "1B" : "2B";

    return getCardComponentByFileName(fileName);
}