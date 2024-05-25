# ByteBusters

This project is a web application that provides endpoints for various functionalities related to aircraft health and  flight paths. It is built using FastAPI and serves as the backend for a dashboard application.

# Backend:
## Installation

1. Clone the repository: `git clone https://github.com/your-username/dashboard-project.git`
2. Navigate to the project directory: `cd dashboard-project`
3. Install dependencies: `pip install -r requirements.txt`

## Usage

1. Start the server: `uvicorn main:app --reload` or  `python -m api_code.app`
2. The API will be running on `http://localhost:8000`

## Endpoints

- `/health`: Returns a dictionary indicating the health of the application.
- `/aircraft`: Endpoint to get information about an aircraft.
- `/get_paths`: Endpoint to retrieve optimal routes from a source to a destination.
- `/nearest_airport`: Endpoint to identify the nearest airport to a provided airplane's current position.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Dependencies

- `fastapi`: FastAPI framework for building APIs.
- `numpy`: Numerical computing library.
- `uvicorn`: ASGI server for FastAPI.
- `openap`: Library for calculating aircraft emissions.
- `traffic`: Library for working with airport data.
- `json`: Library for working with JSON data.

## Code Structure

- `main.py`: Entry point for the application.
- `api_code/algorithms/`: Implementation of a graph data structure and path algorithm.
-  `api_code/utils/`: Implementation of all util helpers.

# Frontend
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
