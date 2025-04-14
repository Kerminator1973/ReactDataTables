import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-responsive-bs5';

import './App.css'


function App() {

  DataTable.use(DT);

  const [tableData] = useState([
    [ 'Tiger Nixon', 'System Architect' ],
    [ 'Garrett Winters', 'Accountant' ],
    [ 'Maxim Rozhkov', 'Head of a departament' ],
    [ 'Ivan Ivanov', 'Software Developer' ],
    [ 'Angela Kapranova', 'Front-End Developer' ],
    [ 'Michail Novikov', 'Leading Developer' ],
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
            }} className="table table-sm table-striped table-hover table-bordered">
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
