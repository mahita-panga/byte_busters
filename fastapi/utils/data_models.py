from typing import List

from pydantic import BaseModel


class RequestAircraftModel(BaseModel):
    flight_number: str
    aircraft_model: str

class ResponseAircraftInfo(BaseModel):
    aircraft_type: str
    aircraft_mass: float
    aircraft_emissions: dict
    aircraft_fuel: str
