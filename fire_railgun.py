import calcul
import math

#recevoir les inputs du dictionnaire
#creer un projectile selon les inputs
    #masse, volume, p init
#faire le calcul du railgun
#retourner la serie de points 

#tt ca devrait etre pull du dictionaire
mass = 1
volume = 1
length = 5 
angl = math.pi/4
voltage = 10000
resistivity = 0.0001
railradius = 10
interspace = 0.001
viscosity = 10**-8
accel = -9.8

points = 10
timeStep = 0.2


projectile = calcul.Projectile(mass,volume)
projectile.acceleration = accel

projectile.position.SetPolar(length, angl)

projectile.velocity.SetPolar(calcul.Rail_Gun(voltage, mass, resistivity, length, interspace, railradius), angl)
print(calcul.Rail_Gun(voltage, mass, resistivity, length, interspace, railradius))

output = calcul.ArrayOutputFriction(projectile, points, timeStep, viscosity)

outpute = calcul.ArrayOutput(projectile, points, timeStep)

print(output)

print(outpute)


#renvoyer output au front end pour affichage