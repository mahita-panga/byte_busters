from api_code.algorithms.graph import Graph, get_weather_context
from heapq import nsmallest, heappush, heappop
from math import sqrt
import json
import time
import threading

red_flag_codes = {4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 22, 23, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 38, 39, 40, 41,
                  42, 43, 44, 45, 46, 47, 48, 49, 54, 55, 56, 57, 58, 59, 6061, 62, 63, 64, 65, 66, 67, 68, 69, 80, 81,
                  82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 94, 95, 96, 97, 98, 99}


def get_weather_code_score(code: int):
    if code in red_flag_codes:
        return 30
    else:
        return 0


def euclidean_heuristic(source_coords, destination_coords):
    """
    Calculates the straight-line (Euclidean) distance estimate between two points.

    Args:
        source_coords: Tuple containing latitude and longitude of the source node.
        neighbor_coords: Tuple containing latitude and longitude of the neighbor node.
        destination_coords: Tuple containing latitude and longitude of the destination node.

    Returns:
        Estimated straight-line distance between the neighbor and the destination.
    """

    # Unpack coordinates for readability
    neighbor_x, neighbor_y = source_coords
    destination_x, destination_y = destination_coords

    # Calculate the squared differences in coordinates
    x_diff_squared = (destination_x - neighbor_x) ** 2
    y_diff_squared = (destination_y - neighbor_y) ** 2

    # Calculate the Euclidean distance (straight line)
    distance = sqrt(x_diff_squared + y_diff_squared)

    return distance


def euclidean_distance(lat1, lon1, lat2, lon2):
    return sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)


def find_nearest_coordinates(coords, target_lat, target_lon, n=3):
    distances = {}

    for key, (lat, lon) in coords.items():
        distance = euclidean_distance(target_lat, target_lon, lat, lon)
        distances[key] = distance

    nearest_keys = nsmallest(n, distances, key=distances.get)

    return nearest_keys


class PathPlanner():
    def __init__(self, graph: Graph) -> None:
        self.routes = graph.get_graph()
        self.graph = graph
        self.weather_data = {}
        self.cache_lock = threading.Lock()
        self.cleanup_thread = threading.Thread(target=self.weather_updation, daemon=True)
        self.cleanup_thread.start()
        self.rouge_weather_node_rain = set()
        self.rouge_weather_node_snow = set()

    def find_nearest_coordinates(coords, target_lat, target_lon, n=3):
        distances = {}

        for key, (lat, lon) in coords.items():
            distance = euclidean_distance(target_lat, target_lon, lat, lon)
            distances[key] = distance

        nearest_keys = nsmallest(n, distances, key=distances.get)

        return nearest_keys

    def find_multiple_paths_by_nodeId(self, src, des):
        """
        Returns :
            list of list cotainings paths with each path list containing the node id in it
        """
        lat, long = src
        src_nodes = find_nearest_coordinates(self.graph.coordinate_map, lat, long, n=5)
        lat, long = des
        des_nodes = find_nearest_coordinates(self.graph.coordinate_map, lat, long, n=5)
        paths = []
        for src_node in src_nodes:
            for des_node in des_nodes:
                paths.extend(self.a_star_search(src_node, des_node, max_paths=3))
        return paths

    def weather_updation(self, updation: bool = False, updation_interval: int = 3600):
        if not updation:
            while True:
                with self.cache_lock:
                    current_time = time.time()
                    keys_to_delete = [key for key, (timestamp, _) in self.weather_data.items() if
                                      current_time - timestamp > updation_interval]
                    for key in keys_to_delete:
                        del self.weather_data[key]
                time.sleep(1)
        else:
            while True:
                with self.cache_lock:
                    current_time = time.time()
                    keys_to_update = [key for key, (timestamp, _) in self.weather_data.items() if
                                      current_time - timestamp > updation_interval]
                    for key in keys_to_update:
                        self.weather_data[key] = self.update_weather_data_for_node(key)
                time.sleep(1)

    def update_weather_data_for_node(self, node_id):
        if node_id not in self.weather_data:
            # print(node_id)
            lat, long = self.graph.coordinate_map[node_id]
            self.weather_data[node_id] = (time.time(), get_weather_context(lat, long))

    def get_weather_data_for_node(self, node_id):
        if node_id not in self.weather_data:
            self.update_weather_data_for_node(node_id)
        _, data = self.weather_data[node_id]
        return data

    def get_weather_score(self, node_id):
        weather = self.get_weather_data_for_node(node_id)

        score = weather['rain'] + weather['showers'] + weather['snowfall'] + get_weather_code_score(
            weather['weather_code'])
        if weather['rain'] > 0.6:
            self.rouge_weather_node_rain.add(node_id)
        if weather['snowfall'] > 0.6:
            self.rouge_weather_node_snow.add(node_id)
        return score

    def a_star_search(self, source, destination, max_paths=3):
        """
        Performs A* search to find the best (shortest hop count) paths between source and destination.

        Args:
            source: Starting node of the search.
            destination: Destination node of the search.
            max_paths: Maximum number of paths to return (default: 3).

        Returns:
            A list containing the best max_paths paths (in terms of hop count) or an empty list if no path is found.
        """

        # Priority queue for storing frontier nodes (ordered by f-score)
        frontier = [(0, source, [])]  # (f-score, current node, path to reach current node)

        # Set to store visited nodes
        visited = set()
        results = []
        f_scores = []
        total_f_score = 0
        while frontier:
            # Get the node with the lowest f-score from the frontier
            f_score, current_node, path = heappop(frontier)
            # If the destination is reached, add the path to results and potentially stop
            if current_node == destination:
                path.append(current_node)
                results.append(path)
                f_scores.append(total_f_score)
                if len(results) == max_paths:
                    return results

            # Mark current node as visited
            visited.add(current_node)

            # Explore neighbors
            for neighbor in self.routes[current_node]:
                if neighbor not in visited:
                    # Calculate g-score (hop count) for the neighbor
                    g_score = len(path) + 1

                    # Heuristic function (assuming distance to destination is known for each node)
                    h_score = euclidean_heuristic(self.graph.coordinate_map[neighbor],
                                                  self.graph.coordinate_map[destination])
                    # Calculate f-score (g_score + h_score)
                    # print(h_score , g_score)
                    total_f_score = g_score + 0.25 * h_score

                    # Add neighbor to the frontier with its f-score, path, and g-score
                    heappush(frontier, (total_f_score, neighbor, path + [current_node]))

        return results

    def get_weather_scores_for_path(self, path):
        score = 0
        for node in path:
            score += self.get_weather_score(node)
        return score

    def get_scores_and_rank(self, paths):
        scores = []
        result = []
        for path in paths:
            score = self.get_weather_scores_for_path(path)
            if score < 30:
                result.append(path)
                scores.append(score)
        return result, scores

    def find_multiple_paths_by_coordinates(self, src, des):
        paths = self.find_multiple_paths_by_nodeId(src, des)
        paths, scores = self.get_scores_and_rank(paths)
        paths = [[self.graph.coordinate_map[node] for node in path] for path in paths]
        paths = [[src] + path + [des] for path in paths]
        rain_paths = get_deliberate_rain_paths(paths=paths)
        return paths, rain_paths

    def return_data_dict(self, src, des, on_air=False):
        paths, rain_paths = self.find_multiple_paths_by_coordinates(src, des)
        # rain_nodes = self.get_nodes_with_rain()
        snow_nodes = self.get_nodes_with_snow()
        if len(paths) == 0:
            return {
                "fly_status": "Cannot Fly" if not on_air else "Find nearby airport as overall bad weather conditions",
                "paths": None,
                "rain_areas": rain_paths,
                "snow_areas": snow_nodes
            }
        else:
            return {
                "fly_status": "Can Fly",
                "paths": paths,
                "rain areas": rain_paths,
                "snow nodes": snow_nodes
            }

    def get_nodes_with_rain(self):
        res = list(self.rouge_weather_node_rain)
        return [self.graph.coordinate_map[node] for node in res]

    def get_nodes_with_snow(self):
        res = list(self.rouge_weather_node_snow)
        return [self.graph.coordinate_map[node] for node in res]


def api_json(dictionary: dict):
    with open('sample.json', 'w') as f:
        json.dump(dictionary, f)


def get_deliberate_rain_paths(paths):
    best_path_set = set(tuple(coord) for coord in paths[0])
    clusters = []

    for path in paths[1:]:
        path_clusters = []
        for i in range(len(path) - 2):
            cluster = path[i:i + 3]
            if any(tuple(coord) not in best_path_set for coord in cluster):
                path_clusters.append(cluster)
        clusters.append(path_clusters)

    return [item for sublist in clusters for item in sublist if sublist]


def main():
    routes = Graph()
    pathplanner = PathPlanner(graph=routes)
    dict = pathplanner.return_data_dict((13, 80), (19, 72))
    api_json(dict)

    ### Testing the path generation and ranking with weather score


if __name__ == "__main__":
    main()