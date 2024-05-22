import uvicorn
import numpy as np
from fastapi import APIRouter, FastAPI, Response
from openap import FuelFlow, Emission, prop
import traffic
from utils.data_models import RequestAircraftModel, ResponseAircraftInfo ,SrcDesParams
from utils.utils import create_plots
from algorithms.a_star import *

router = APIRouter()
routes = Graph()
pathplanner = PathPlanner(graph=routes)

@router.get("/health")
def get_health() -> dict:
    """
    Endpoint to check the health of the application.

    Returns:
        dict: A dictionary containing a message indicating the health of the application.
    """
    return {"message": "Application is healthy"}


@router.post("/aircraft")
def aircraft_details(response: Response, payload: RequestAircraftModel):
    """
    Endpoint to get information about an aircraft.

    Returns:
        dict: A dictionary containing information about the aircraft.
    """
    aircraft_number = payload.flight_number
    aircraft_model = payload.aircraft_model
    #aircraft_engine = payload.aircraft_engine

    emission = Emission(ac=aircraft_model)
    aircraft = prop.aircraft(aircraft_model)
    mass = aircraft["limits"]["MTOW"] * 0.85
    cruise_altitude = aircraft["cruise"]["height"]

    tas = np.linspace(50, 500, 50)
    tas_avg = np.mean(tas)
    alt = np.linspace(100, cruise_altitude, 50)
    alt_avg = np.mean(alt)

    from utils.utils import aircraft_fuel_consumption
    average_fuel_consumption = aircraft_fuel_consumption(ac_type = aircraft_model.lower())

    filenames =create_plots(aircraft_model, aircraft_number)
    average_emissions = {'co2': emission.co2(average_fuel_consumption),
                         'h2o': emission.h2o(average_fuel_consumption),
                         'sox': emission.sox(average_fuel_consumption),
                         'nox': emission.nox(average_fuel_consumption, tas_avg, alt_avg)}


    response_data = {}
    response_data['aircraft_fuel'] = average_fuel_consumption
    response_data['aircraft_mass'] = mass
    response_data['aircraft_type'] = aircraft["aircraft"]
    response_data['aircraft_emissions'] = average_emissions
    response_data['filenames'] = filenames

    return response_data

@router.post("/get_paths")
def get_paths_for_src_to_des(payload:SrcDesParams):
    """
    curl -X 'POST' \
    'http://127.0.0.1:8000/get_paths' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "src": [
        13,80
    ],
    "des": [
        19,72
    ],
    "on_air": false
    }'
    Takes 5 - 10 seconds to evaluate paths and return them 
    """
    src = payload.src
    des = payload.des
    on_air = payload.on_air
    response = pathplanner.return_data_dict(src=src,des=des,on_air=on_air)
    return response

app = FastAPI(title="ByteBusters")
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
