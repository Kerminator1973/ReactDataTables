import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import DataTable from 'datatables.net-react';
//import DT from 'datatables.net-dt';
import DT from 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-responsive-bs5';

import './App.css'


DataTable.use(DT);

function App() {

  const [tableData, setTableData] = useState([
    [ 'Tiger Nixon', 'System Architect' ],
    [ 'Garrett Winters', 'Accountant' ]
  ]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <DataTable data={tableData} options={{
                select: true,
                responsive: true
            }} className="display">
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Position</th>
                  </tr>
              </thead>
          </DataTable>
    </>
  )
}

export default App
