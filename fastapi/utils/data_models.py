from typing import List , Tuple

from pydantic import BaseModel


class RequestAircraftModel(BaseModel):
    flight_number: str
    aircraft_model: str

class ResponseAircraftInfo(BaseModel):
    aircraft_type: str
    aircraft_mass: float
    aircraft_emissions: dict
    aircraft_fuel: str

class SrcDesParams(BaseModel):
    src:List
    des:List
    on_air:bool

class AirplanePosition(BaseModel):
    current_pos:List
    