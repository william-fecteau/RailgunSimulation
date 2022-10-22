# RailgunSimulation
This project was built in 48h during the Mcgill Physics Hackathon https://www.hackathon.physics.mcgill.ca/

## Idea 
The idea of a rail gun came up to us the day before the Hackathon. We figured out it would be a great challenge on the physical side (because we would have to include electromagnetism as well as aerodynamics) and on the programming side (because we would have to model a camera that follows the movement of our projectile).

## What it does
Our program lets the user play around with almost every parameter used in a rail gun. Then it shoots our lovely monkey Schlader as far as possible.

The user can discover how each parameter affects the shot trajectory and the speed at which Schlader is expelled such as the metal used for the rails, the angle of the cannon or the voltage of the battery.

Also, we figured out this could be cool to just play with a simulation of a rail gun.

Finally we decided to shoot a metal monkey with our cannon, because we wanted to pay respect to this beautiful animal filled with witness and inner peace.

## Project setup
To set up the project, you must have `Python 3` or higher installed, as well as `pip` if it was not included in your install.

1. Install poetry
```cmd
pip install poetry
```
2. Run poetry on the project
```cmd
poetry install
```
3. Run the web app with hot reload active
```cmd
poetry run flask run --reload --debugger
```
