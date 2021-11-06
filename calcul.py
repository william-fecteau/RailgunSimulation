import math
import numpy

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
    #position
    #masse
    #velocite
    #densite/volume
    
class Environement:

    def __init__(self,gravity,):
        self.gravity = gravity

    #densite air/coeff drag
    #gravite
    #vitesse vent
    


vitesse = Vector(0,-1)
position = Vector(3,9)
vitesse.SetPolar(1000,1/2)

vitesse.Print()

Xavier = Projectile(10,1)
Xavier.SetPosition(position)
Xavier.SetVelocity(vitesse)

Xavier.position.Print()
Xavier.velocity.Print()