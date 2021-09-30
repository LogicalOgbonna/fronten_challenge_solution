import './App.scss'

import { Route, Switch } from 'react-router-dom'
import { Header } from './components'
import { Home } from './pages';

function App() {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main className="main-content">
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default App;
