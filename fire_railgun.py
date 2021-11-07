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
angl = math.pi/2
voltage = 10000
resistivity = 1
railradius = 1
interspace = 0.001
viscosity = 1**-8
accel = -9.8

points = 10
timeStep = 0.2


projectile = calcul.Projectile(mass,volume,accel)

projectile.position.SetPolar(length, angl)

projectile.velocity.SetPolar(calcul.rail_gun(voltage, mass, resistivity, length, interspace, railradius), angl)

output = calcul.ArrayOutputFriction(projectile, points, timeStep, viscosity)

outpute = calcul.ArrayOutput(projectile, points, timeStep)

print(output)
print(outpute)


#renvoyer output au front end pour affichage