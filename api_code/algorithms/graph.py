import pandas as pd
import requests
import os


def get_weather_context(lat, long):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": long,
        "current": ["rain", "showers", "snowfall", "weather_code", "cloud_cover"]
    }
    response = requests.get(url, params=params)
    return response.json()['current']


class Graph:
    def __init__(self) -> None:
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        # Construct the path to the data folder
        data_dir = os.path.join(root_dir, 'Data')
        path = os.path.join(data_dir, 'final_domestic_routes.csv')
        self.routes = pd.read_csv(path, index_col='route')
        # print(self.routes.head())
        self.get_edge_list()
        self.create_adjacency_graph(self.edge_list)
        self.assign_node_coordinates()
        # print(self.graph)
        print("Graph created successfully 🎉")

    def get_edge_list(self):
        self.edge_list = []

        for route in self.routes.index.unique().values:
            edge = []
            for node in self.routes.loc[route].iterrows():
                edge.append(node[1].node)
                # print(edge)
                if len(edge) == 2:
                    self.edge_list.append(edge.copy())
                    del edge[0]
        print(f'Number of edges in graph : {len(self.edge_list)}')

    def create_adjacency_graph(self, edge_list):
        """
        Creates an adjacency graph represented as a dictionary of sets from an edge list.

        Args:
            edge_list: A list of tuples where each tuple represents an edge (source, destination).

        Returns:
            A dictionary where keys are nodes and values are sets of their connected nodes.
        """
        self.graph = {}
        for source, destination in edge_list:
            if source not in self.graph:
                self.graph[source] = set()
            self.graph[source].add(destination)

            if destination not in self.graph:
                self.graph[destination] = set()
            self.graph[destination].add(source)

    def assign_node_coordinates(self):
        self.coordinate_map = {}
        for route in self.routes.values:
            # print(route[6])
            if route[4] not in self.coordinate_map:
                self.coordinate_map[route[4]] = (route[5], route[6])
                pass

    def get_graph(self):
        return self.graph

    def get_coordinate_map(self):
        return self.coordinate_map


def main():
    graph = Graph()
    weather = get_weather_context(8.5, 76.9)
    print(type(weather))
    print(weather)


if __name__ == "__main__":
    main()