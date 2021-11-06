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




    

#fonctions de calcul ---------------------------------------------------------

def rail_gun(voltage, mass, resistance, length, interspace):
    intensity = voltage / resistance
    field = ((4 * math.pi * 10**-7) * intensity) / (2 * math.pi * (interspace / 2))
    force = intensity * field * interspace
    acc = force / mass
    speed = math.sqrt(2 * acc * length)
    return speed



#return 
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
         


