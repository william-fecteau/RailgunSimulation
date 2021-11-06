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
        
    def ModifComposante(self,x,y):
        self.x = x
        self.y = y
        self.hyp = math.sqrt(x**2 + y**2)
        self.angle = math.atan(y/x)
    
    def ModifPolaire(self, hyp, angle):
        self.hyp = hyp
        self.angle = angle
        self.x = hyp*math.cos(angle)
        self.y = hyp*math.sin(angle)
    
    def Print(self):
        print("Composantes: \n X: ", self.x, " \n Y: ", self.y, "\n\n Hypotenuse: ", self.hyp, "\n Angle(rad): ", self.angle )




class Projectile:
    def __init__(self,masse,volume):
        self.masse = masse
        self.vitesse = Vector(0,0)
        self.position = Vector(0,0)
        self.acceleration = Vector(0,0)
        self.volume = volume


    #prend un Vector 
    def ModifVitesse(self,vitesse):
        self.vitesse = vitesse

    def ModifPosition(self,position):
        self.position = position
    #position
    #masse
    #velocite
    #densite/volume
    
#class Environement:
    #densite air/coeff drag
    #gravite
    #vitesse vent
    


vitesse = Vector(0,-1)
position = Vector(3,9)
vitesse.ModifPolaire(1000,1/2)

vitesse.Print()

Xavier = Projectile(10,1)
Xavier.ModifPosition(position)
Xavier.ModifVitesse(vitesse)

Xavier.position.Print()
Xavier.vitesse.Print()