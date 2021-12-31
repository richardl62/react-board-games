import React, { useEffect } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { games as appGames } from "../games";
import { AppGame, GameCategory } from "../shared/types";
import "./app.css";
import { gameComponent } from "./game-component";
import { gamePath } from "./url-params";

const HomePageStyles = styled.div`
    h1 {
        font-size: 14pt;
        font-weight: bold;
    }
    
    h2 {
        margin-top: 6px;
        font-size: 12pt;
        font-weight: 600;
    }
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

    const renderHomePage = () => <HomePage games={appGames} />;
    const renderPageNotFound = () => <PageNotFound games={appGames} />;
    return (
        <BrowserRouter>
            <Switch>
                <Route key="/" exact path="/" component={renderHomePage} />

                {appGames.map(appGame => <Route
                    key={appGame.name}
                    path={gamePath(appGame)} exact
                    component={() => gameComponent(appGame)}
                />)}

                <Route key="pageNotFound" component={renderPageNotFound} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
