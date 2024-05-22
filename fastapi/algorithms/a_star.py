from graph import Graph
from heapq import nsmallest , heappush , heappop
from math import sqrt 
import json

red_flag_codes = set([4 ,5,6,7,8,9,13,14,15,16,17,22,23,25,26,27,28,29, \
                      33 ,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48, \
                      49 ,54,55 ,56,57,58,59,6061,62,63,64,65,66,67,68,69, \
                        ])

def euclidean_heuristic(source_coords , destination_coords):
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
    def __init__(self , graph:Graph) -> None:
        self.routes = graph.get_graph()
        self.graph = graph

    def find_nearest_coordinates(coords, target_lat, target_lon, n=3):
        distances = {}

        for key, (lat, lon) in coords.items():
            distance = euclidean_distance(target_lat, target_lon, lat, lon)
            distances[key] = distance

        nearest_keys = nsmallest(n, distances, key=distances.get)

        return nearest_keys
    
    def find_multiple_paths_by_nodeId(self , src , des) :
        """
        Returns : 
            list of list cotainings paths with each path list containing the node id in it 
        """
        lat , long = src 
        src_nodes = find_nearest_coordinates(self.graph.coordinate_map, lat, long , n =5)
        lat , long = des
        des_nodes = find_nearest_coordinates(self.graph.coordinate_map , lat, long , n =5)
        paths = [] 
        for src_node in src_nodes :
            for des_node in des_nodes :
                paths.extend(self.a_star_search(src_node , des_node ,max_paths=3))
        return paths




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
                    h_score = euclidean_heuristic(self.graph.coordinate_map[neighbor] , self.graph.coordinate_map[destination]) 
                # Calculate f-score (g_score + h_score)
                    # print(h_score , g_score)
                    total_f_score =  g_score  + 0.25 * h_score

                # Add neighbor to the frontier with its f-score, path, and g-score
                    heappush(frontier, (total_f_score, neighbor, path + [current_node]))

        return results   
    
        
    def find_multiple_paths_by_coordinates(self , src , des) :
        paths = self.find_multiple_paths_by_nodeId(src , des)
        paths = [[self.graph.coordinate_map[node] for node in path] for path in paths]
        paths = [[src]+path+[des] for path in paths ]
        return {"path" : paths} 
    
def api_json(dictionary:dict):
    with open('sample.json','w') as f:
        json.dump(dictionary , f)


def main():
    routes = Graph()
    pathplanner = PathPlanner(graph=routes)
    paths = pathplanner.find_multiple_paths_by_coordinates((13,80),(19,72))
    api_json(paths)


if __name__ == "__main__":
    main()