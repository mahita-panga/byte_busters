import importlib
import traffic
import os
import boto3
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

    except ModuleNotFoundError as e:
        raise ModuleNotFoundError(f"Module {module_name} not found. Ensure it exists and is correctly named.") from e

    except AttributeError as e:
        openap_fuel_flow = FuelFlow(ac=ac_type, use_synonym=True)
        aircraft = prop.aircraft(ac=ac_type, use_synonym=True)

        tas_avg = np.mean(np.linspace(50, 500, 100))
        alt_avg = np.mean(np.linspace(100, 42000, 100))
        path_angle_avg = np.mean(np.linspace(0, 15, 10))
        mass = aircraft["limits"]["MTOW"] * 0.85

        ff = openap_fuel_flow.enroute(mass=mass, tas=tas_avg, alt=alt_avg, path_angle=path_angle_avg)
        return round(ff * (10 ** (len(str(int(mass))) - 1)), 2)


def upload_file_to_s3(file_path, bucket_name, s3_folder, s3_filename):
    s3_client = boto3.client('s3')
    s3_path = os.path.join(s3_folder, s3_filename)
    try:
        s3_client.upload_file(file_path, bucket_name, s3_path)
        print(f'Successfully uploaded {file_path} to {bucket_name}/{s3_path}')
    except Exception as e:
        print(f'Failed to upload {file_path} to {bucket_name}/{s3_path}: {e}')


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
    print(plot_path)
    aircraft = prop.aircraft(ac=aircraft_type, use_synonym=True)
    fuelflow = FuelFlow(ac=aircraft_type, use_synonym=True)
    emission = Emission(ac=aircraft_type, use_synonym=True)

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

    s3_bucket = 'airbushack'
    s3_folder = f'plots/{flight_number}'
    for key, filename in filenames.items():
        filepath = os.path.join(plot_path, filename)
        print(f"FILEPATH: {filepath}")
        fig = plt.figure()
        ax = fig.add_subplot(111, projection="3d")
        surf = ax.plot_surface(tas_, alt_, data[key], cmap='viridis')
        plt.title(f"{key.replace('_', ' ').upper()} (g/s)")
        plt.xlabel("TAS (kt)")
        plt.ylabel("Altitude (ft)")
        plt.savefig(filepath)
        upload_file_to_s3(filepath, s3_bucket, s3_folder, filename)
        print("Uploaded to s3")
        plt.close(fig)
        os.remove(filepath)

    return [os.path.join(plot_path, filename) for filename in filenames.values()]
