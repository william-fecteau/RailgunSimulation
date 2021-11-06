import calcul
import math

#recevoir les inputs du dictionnaire
#creer un projectile selon les inputs
    #masse, volume, p init
#faire le calcul du railgun
#retourner la serie de points 

#tt ca devrait etre pull du dictionaire
mass = 1
volume =1
length = 5 
angle = math.pi/18
voltage = 10000
resistance= 1 
interspace = 0.1
points = 10
timeStep = 0.2


projectile = calcul.Projectile(mass,volume)

projectile.position.SetPolar(length,angle)

projectile.velocity.SetPolar(calcul.rail_gun(voltage, mass,resistance,length,interspace))

output = calcul.ArrayOutput(projectile,points, timeStep)



#renvoyer output au front end pour affichage