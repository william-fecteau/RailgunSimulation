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
        if(Py+radius >= self.lowerBound and Py-radius <= self.upperBound):
            return True
        return False

    def WillHitTargetFriction(self,projectile, friction):
        c = (self.x - projectile.position.x)/(projectile.mass*projectile.velocity.x)
        if(c >= 1):
            return False    
        time = -(projectile.mass/friction)*math.log(1-c)
        Py = max(0,projectile.velocity.y *time + (projectile.acceleration.y/2)*(time**2) + projectile.position.y)
        radius = radius = pow((3/4)*projectile.volume,1/3)
        if(Py+radius >= self.lowerBound and Py-radius <= self.upperBound):
            return True
        return False

    




    

#fonctions de calcul ---------------------------------------------------------

def rail_gun(voltage, mass, resistance, length, interspace):
    intensity = voltage / resistance
    field = ((4 * math.pi * 10**-7) * intensity) / ( math.pi * (interspace / 2))
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


        Px = projectile.velocity.x *time +projectile.position.x + (projectile.acceleration.y/2)*(time**2)
        #calcul de la position
        Py = max(0,projectile.velocity.y *time + (projectile.acceleration.y/2)*(time**2) + projectile.position.y)
        if(Py == 0): #impact avec le sol, le mouvement s'arrete
            output.append((Px,Py,Vx,Vy))
            return(output)

           
        
        
        output.append((Px,Py,Vx,Vy))
    return(output)
         
def ArrayOutputFriction(projectile, points, timeStep, friction):
    output = []
    compteur =0
    for i in range(points):
        time = i*timeStep

        #calcul de la velocity 

        c = projectile.mass * projectile.velocity.x/friction
        Vx = (c*friction/projectile.mass)*math.exp(-friction*time/projectile.mass)


        c = projectile.acceleration.y * projectile.mass/friction
        Vy = c + (projectile.velocity.y - c)*(math.exp(-friction*time/projectile.mass))
        



        #calcul de la position
        c1 = projectile.acceleration.y*projectile.mass/friction
        c2 = (projectile.mass/friction)*(projectile.velocity.y - projectile.acceleration.y*projectile.mass/friction)
        Py = max(0,c1*time + c2*(1-math.exp(-friction*time/projectile.mass)) +projectile.position.y)


        c = projectile.mass * projectile.velocity.x/friction
        Px = c*(1-math.exp(-friction * time / projectile.mass)) +projectile.position.x

        
        if(Py == 0): #impact avec le sol, le mouvement s'arrete
            output.append((Px,Py,Vx,Vy))
            return(output)
        
            
        
        compteur +=1
        output.append((Px,Py,Vx,Vy))
    return(output)



