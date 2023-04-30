import React, { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { AppGame, GameCategory } from "../app-game-support";
import { standardOuterMargin } from "../app-game-support/styles";
import { games as appGames } from "../games/app-games";
import "./app.css";
import { GameComponent } from "./game-component";
import { gamePath } from "./url-params";

const HomePageStyles = styled.div`
    font-size: 18px;
    h1 {
        font-size: 1.2em;
        font-weight: bold;
    }
    
    h2 {
        margin-top: 0.5em;
        font-size: 18px;
        font-weight: 600;
    }

    margin: ${standardOuterMargin};
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 200%;
  margin-bottom: 0.5em;
`;

interface LinkListProps {
    games: Array<AppGame>;
    category: GameCategory;
  }
  
function CategoryLinks(props: LinkListProps) {
    const { games, category } =  props;
    const selectedGames =  games.filter(appGame => appGame.category === category);

    const link = (game: AppGame) => {
        const to = {
            pathname: gamePath(game),
            search: window.location.search,
        };

        return <li key={game.name}>
            <Link to={to}>{game.displayName}</Link>
        </li>;
    };

    if(selectedGames.length === 0) {
        return null;
    }

    return <>
        <h2>{category}</h2>
        <ul>
            {selectedGames.map(link)}
        </ul>
    </>;
}

interface HomePageProps {
    games: Array<AppGame>;
}
  
function GameLinks({ games }: HomePageProps) {
    return (
        <div>
            {Object.values(GameCategory).map((category : GameCategory) =>
                <CategoryLinks key={category} games={games} category={category} />
            )}
        </div>
    );
}

function HomePage(props: HomePageProps) {
    return <HomePageStyles>
        <h1>Available Games</h1>
        <GameLinks {...props} />
    </HomePageStyles>;
}

function PageNotFound(props: HomePageProps) {
    return <HomePageStyles>
        <ErrorMessage>404: Page Not Found</ErrorMessage>
        <div>You could try one of these links:</div>
        <GameLinks {...props} />
    </HomePageStyles>;
         
}

/**
 * Games App.
 */
function App(): JSX.Element {
    
    useEffect(() => {
        document.title = "Games";
    });

    return (
        <BrowserRouter>
            <Routes>
                <Route key="/" path="/" element={<HomePage games={appGames} />} />

                {appGames.map(appGame => <Route
                    key={appGame.name}
                    path={gamePath(appGame)}
                    element={<GameComponent game={appGame}/>}
                />)}

                <Route key="pageNotFound" path="/*" element={<PageNotFound games={appGames} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
