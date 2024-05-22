import importlib
import traffic
import os
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend
import matplotlib.pyplot as plt

from openap import Emission, FuelFlow, prop
from mpl_toolkits.mplot3d import Axes3D


def aircraft_fuel_consumption(ac_type: str) -> float:
    module_name = 'traffic.data.samples'
    submodule_name = f'fuelflow_{ac_type}'

    try:
        # Dynamically import the parent module
        module = importlib.import_module(module_name)
        # Get the specific attribute (submodule) from the parent module
        submodule = getattr(module, submodule_name)

    except ModuleNotFoundError as e:
        raise ModuleNotFoundError(f"Module {module_name} not found. Ensure it exists and is correctly named.") from e
    except AttributeError as e:
        raise AttributeError(f"Submodule {submodule_name} not found in {module_name}.") from e

    if hasattr(submodule, 'assign'):
        f = submodule.assign(
            # the vertical_rate is not present in the data
            vertical_rate=lambda df: df.altitude.diff().fillna(0) * 60,
            # convert to kg/s
            fuelflow=lambda df: df.fuelflow / 3600,
        )
        resampled = f.resample("5s")
        average_fuel = resampled.weight_max - resampled.weight_min
        return average_fuel
    else:
        raise Exception(f"Module {module_name} does not have assign() or does not exists")


def save_plot_as_png(fig, filename):
    fig.write_image(filename, engine="kaleido")


def create_dir(path):
    try:
        os.makedirs(path, exist_ok=True)
        print(f"Directory for '{path}' created successfully or already exists.")
    except Exception as e:
        print(f"An error occurred while creating the directory for '{path}': {e}")


def create_plots(aircraft_type, flight_number):
    create_dir(f'plots/{flight_number}')
    plot_path = f'plots/{flight_number}'

    aircraft = prop.aircraft(ac=aircraft_type)
    fuelflow = FuelFlow(ac=aircraft_type)
    emission = Emission(ac=aircraft_type)

    tas = np.linspace(50, 500, 50)
    alt = np.linspace(100, 35000, 50)
    tas_, alt_ = np.meshgrid(tas, alt)
    mass = aircraft["limits"]["MTOW"] * 0.85

    ff = fuelflow.enroute(mass=mass, tas=tas_, alt=alt_, path_angle=0)

    co2 = emission.co2(ff)
    h2o = emission.h2o(ff)
    sox = emission.sox(ff)
    nox = emission.nox(ff, tas=tas_, alt=alt_)
    co = emission.co(ff, tas=tas_, alt=alt_)
    hc = emission.hc(ff, tas=tas_, alt=alt_)

    filenames = {
        "fuel_flow": "3d_fuel_flow.png",
        "h2o": "3d_h2o_emissions.png",
        "co2": "3d_co2_emissions.png",
        "sox": "3d_sox_emissions.png",
        "nox": "3d_nox_emissions.png",
        "co": "3d_co_emissions.png",
        "hc": "3d_hc_emissions.png"
    }

    data = {
        "fuel_flow": ff,
        "h2o": h2o,
        "co2": co2,
        "sox": sox,
        "nox": nox,
        "co": co,
        "hc": hc
    }

    for key, filename in filenames.items():
        filepath = os.path.join(plot_path, filename)
        fig = plt.figure()
        ax = fig.add_subplot(111, projection="3d")
        surf = ax.plot_surface(tas_, alt_, data[key], cmap='viridis')
        plt.title(f"{key.replace('_', ' ').upper()} (g/s)")
        plt.xlabel("TAS (kt)")
        plt.ylabel("Altitude (ft)")
        plt.savefig(filepath)
        plt.close(fig)

    return [os.path.join(plot_path, filename) for filename in filenames.values()]