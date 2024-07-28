import matplotlib.pyplot as plt
from physics import Particle
import numpy as np

def main():
    particles = [
        Particle(position=[0, 0], velocity=[1, 1], mass=1, radius=0.5),
        Particle(position=[1, 1], velocity=[-1, -1], mass=1, radius=0.5)
    ]

    dt = 0.01  
    t_end = 10  

    positions = [[] for _ in particles]

    for t in np.arange(0, t_end, dt):
        for i, particle in enumerate(particles):
            particle.update(dt)
            positions[i].append(particle.position.copy())

    for i, pos in enumerate(positions):
        pos = np.array(pos)
        plt.plot(pos[:, 0], pos[:, 1], label=f'Particle {i+1}')

    plt.xlabel('x')
    plt.ylabel('y')
    plt.legend()
    plt.show()

if __name__ == '__main__':
    main()
