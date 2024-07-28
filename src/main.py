# src/main.py
import matplotlib.pyplot as plt
from physics import Particle, State
import numpy as np

def main():
    particles = [
        Particle(position=[0, 0], velocity=[1, 1], mass=1, radius=0.5, state=State.SOLID),
        Particle(position=[1, 1], velocity=[-1, -1], mass=1, radius=0.5, state=State.LIQUID)
    ]

    dt = 0.01  # Time step
    t_end = 10  # End time

    positions = [[] for _ in particles]

    for t in np.arange(0, t_end, dt):
        for i, particle in enumerate(particles):
            particle.update(dt)
            positions[i].append(particle.position.copy())
        for i in range(len(particles)):
            for j in range(i + 1, len(particles)):
                particles[i].resolve_collision(particles[j])

    for i, pos in enumerate(positions):
        pos = np.array(pos)
        state = particles[i].state
        if state == State.SOLID:
            plt.plot(pos[:, 0], pos[:, 1], 'ro-', label=f'Particle {i+1} (Solid)')
        elif state == State.LIQUID:
            plt.plot(pos[:, 0], pos[:, 1], 'bo-', label=f'Particle {i+1} (Liquid)')
        

    plt.xlabel('x')
    plt.ylabel('y')
    plt.legend()
    plt.show()

if __name__ == '__main__':
    main()
