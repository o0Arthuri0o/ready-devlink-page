import { useEffect, useState } from 'react'

import './App.scss'
import { Route, Routes} from 'react-router-dom';
import ReadyPage from './ReadyPage';

function App() {

 return(

  <div className='app'>
    <Routes>

      <Route path='/:id' element={<ReadyPage/>} />
    </Routes>
  </div>

 );

}

export default App
