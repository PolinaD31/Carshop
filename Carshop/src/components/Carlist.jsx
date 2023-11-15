import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import AddCar from "./AddCar";
import EditCar from "./EditCars";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function Carlist () {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchCras();
    }, []);

    const fetchCras = () => {
        fetch('https://carrestapi.herokuapp.com/cars')
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong: " + response.statusText);

            return response.json();
        })
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = (url) => {
        if (window.confirm("Are you sure?")) {
            fetch(url, {method: 'DELETE'})
        .then(responce => {
            if (!responce.ok) {
                throw new Error("Error in deletion: " + responce.statusText);
            } else {
                setOpen(true);
                fetchCras();
            }
        })
        .catch(err => console.error(err))
        }
    }

    const [columnDefs] = useState([
        { field: 'brand', sortable: true, filter: true},
        { field: 'model', sortable: true, filter: true},
        { field: 'color', sortable: true, filter: true},
        { field: 'fuel', sortable: true, filter: true, width: 100},
        { field: 'year', sortable: true, filter: true, width: 100},
        { field: 'price', sortable: true, filter: true, width: 150},
        {
            cellRenderer: params => <EditCar cardata={params.data} fetchCars={fetchCras} />,
            width: 120
        },
        {
            cellRenderer: params => <Button size="small" onClick={() => deleteCar(params.data._links.car.href)}>Delete</Button>,
            width: 120
        }
    ]);


    return(
        <>
            <AddCar fetchCars={fetchCras} />
            <div className="ag-theme-material" style={{ width: '100%', height: 600}}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationAutoPageSize={true}
                 />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Car deleted succesfully"
            />
        </>
    );
}

export default Carlist;