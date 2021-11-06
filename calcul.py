import math

class Vector:
    def __init__(self,x,y):
        self.x = x
        self.y = y 
        self.hyp = math.sqrt(x**2 + y**2)
        if (x==0):
            if(y >=0):
                self.angle = math.pi/2
            else:
                self.angle = 3*math.pi/2
        else:
            self.angle = math.atan(y/x)
        
    def SetComponent(self,x,y):
        self.x = x
        self.y = y
        self.hyp = math.sqrt(x**2 + y**2)
        self.angle = math.atan(y/x)
    
    def SetPolar(self, hyp, angle):
        self.hyp = hyp
        self.angle = angle
        self.x = hyp*math.cos(angle)
        self.y = hyp*math.sin(angle)
    
    def Print(self):
        print("Component: \n X: ", self.x, " \n Y: ", self.y, "\n\n Hypothenuse: ", self.hyp, "\n Angle(rad): ", self.angle )




class Projectile:
    def __init__(self,mass,volume):
        self.mass = mass
        self.velocity = Vector(0,0)
        self.position = Vector(0,0)
        self.acceleration = Vector(0,0)
        self.volume = volume


    #prend un Vector 
    def SetVelocity(self,velocity):
        self.velocity = velocity

    def SetPosition(self,position):
        self.position = position

    def SetAcceleration(self, acceleration):
        self.acceleration = acceleration
    #position
    #masse
    #velocite
    #densite/volume

"""
cible:
hauteur
position xy 

etat: brisee t/f


comportement: 
avant le tir: check si trajectoire passe dans la cible
pendant le tir quand on arrive au step juste apres le moment de colision
    set brisee a true 
"""
class Cible:
    broken = False
    def __init__(self, x,y,height):
        self.x = x
        self.y = y
        self.height = height
        self.lowerBound = y
        self.upperBound = y+height
    
    def WillHitTarget(self,projectile):
        #y=Vy/Vx *x + a/2 * x^2/Vx^2
        Py = projectile.velocity.y/projectile.velocity.x *self.x + (projectile.acceleration.y/2)*(self.x/projectile.velocity.x)**2
        radius = pow((3/4)*projectile.volume,1/3)
        print("Py ",Py, " Px ", self.x, ' ', self.upperBound, " ", self.lowerBound)
        if(Py+radius >= self.lowerBound and Py-radius <= self.upperBound):
            return True
        return False

    




    

#fonctions de calcul ---------------------------------------------------------

def rail_gun(voltage, mass, resistance, length, interspace):
    intensity = voltage / resistance
    field = ((4 * math.pi * 10**-7) * intensity) / (2 * math.pi * (interspace / 2))
    force = intensity * field * interspace
    acc = force / mass
    speed = math.sqrt(2 * acc * length)
    return speed



#return un array d'array de 4 composantes
#en ordre: position x, position y, velocite x et velocite y
def ArrayOutput(projectile, points, timeStep):
    output = []
    for i in range(points):
        time = i*timeStep

        #calcul de la velocity 
        Vx = projectile.velocity.x + projectile.acceleration.x *time
        Vy = projectile.velocity.y + projectile.acceleration.y *time



        #calcul de la position
        Py = max(0,projectile.velocity.y *time + (projectile.acceleration.y/2)*(time**2) + projectile.position.y)
        if(Py == 0): #impact avec le sol, le mouvement s'arrete
            Px = 0
            Vx = 0
            Vy = 0
        else:
            Px = projectile.velocity.x *time +projectile.position.x + (projectile.acceleration.y/2)*(time**2)
        
        
        output.append((Px,Py,Vx,Vy))
    return(output)
         





