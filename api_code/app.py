import uvicorn
import numpy as np
from fastapi import APIRouter, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from openap import FuelFlow, Emission, prop
import traffic
import os

from api_code.algorithms.graph import Graph
from api_code.utils.data_models import RequestAircraftModel ,SrcDesParams , AirplanePosition
from api_code.utils.utils import create_plots
from api_code.algorithms.a_star import *

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

    emission = Emission(ac=aircraft_model,use_synonym=True)
    aircraft = prop.aircraft(aircraft_model)
    mass = aircraft["limits"]["MTOW"] * 0.85
    cruise_altitude = aircraft["cruise"]["height"]

    tas = np.linspace(50, 500, 50)
    tas_avg = np.mean(tas)
    alt = np.linspace(100, cruise_altitude, 50)
    alt_avg = np.mean(alt)

    from api_code.utils.utils import aircraft_fuel_consumption
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
    This asynchronous endpoint retrieves optimal routes from a source to a destination, considering:

    - Source and destination coordinates (provided in lists)
    - On-air restriction (optional, defaults to False)

    Returns:

    dict: A dictionary containing the following information:
        - paths: A list of optimal routes from source to destination.
        - fly_status: A boolean indicating if all returned paths are airborne.
        - rain_areas: A list of coordinates where rain is happening
        - snow_ares : A list of coordinates where snow is happening
    """
    src = payload.src
    des = payload.des
    on_air = payload.on_air
    response =  pathplanner.return_data_dict(src=src,des=des,on_air=on_air)
    return response

@router.post('/nearest_airport')
def get_nearest_airport(payload:AirplanePosition) :
    """
        This endpoint identifies the nearest airport to a provided airplane's current position.

    Args:
        payload (AirplanePosition): A dictionary containing the airplane's current latitude and longitude coordinates.

    Returns:
        dict: Information about the nearest airport, including:
            - name (str): The name of the airport.
            - city (str): The city where the airport is located.
            - state (str): The state where the airport is located (if applicable).
            - country (str): The country where the airport is located.
            - code (str): The IATA airport code.
            - latitude (float): The latitude coordinate of the airport.
            - longitude (float): The longitude coordinate of the airport.
    """

    src = payload.current_pos
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        # Construct the path to the data folder
    data_dir = os.path.join(root_dir, 'Data')
    path = os.path.join(data_dir, 'airports.json')
    with open(path) as fp:
        data = json.load(fp)
        res_idx = None
        minimum_dis = 1000
        for idx , airport in enumerate(data['airports']) :
            dis = euclidean_distance(src[0],src[1] , float(airport['latitude_deg']),float(airport['longitude_deg']))
            if dis < minimum_dis :
                res_idx = idx
                minimum_dis = dis
        return data['airports'][res_idx]

app = FastAPI(title="ByteBusters")
app.include_router(router)

origins = [
    "http://localhost",
    "http://localhost:8080",
    # Add other allowed origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)