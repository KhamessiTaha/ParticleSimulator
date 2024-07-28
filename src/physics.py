import numpy as np

class Particle:
    def __init__(self, position, velocity, mass, radius):
        self.position = np.array(position, dtype=float)
        self.velocity = np.array(velocity, dtype=float)
        self.mass = mass
        self.radius = radius

    def update(self, dt):
        self.position += self.velocity * dt
